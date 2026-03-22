import Constants from "expo-constants";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref as storageRef } from "firebase/storage";

import { auth, db, storage } from "./firebase";

export type PlaybackEvent = {
  t: number;
  type: "connect" | "disconnect";
  cubeA: string;
  faceA: number;
  cubeB: string;
  faceB: number;
};

export type SessionPlaybackArtifact = {
  sessionId: string;
  generatedAt: string;
  durationMs: number;
  eventCount: number;
  events: PlaybackEvent[];
};

export type LatestEndedSessionPreview = {
  sessionId: string;
  childId?: string | null;
  durationSeconds: number;
  eventCount: number;
  playbackDurationMs: number;
  playbackJsonPath?: string;
  playbackJsonUrl?: string;
  endedAt?: Date;
};

export type FinalizeSessionPayload = {
  sessionId: string;
  childId?: string;
  durationSeconds: number;
  events: Array<Record<string, unknown>>;
};

export type FinalizeSessionResult = {
  sessionId: string;
  source: string;
  eventCount: number;
  invalidEventCount: number;
  durationMs: number;
  playbackJsonPath: string;
  playbackJsonUrl?: string;
};

export type PlaybackBlock = {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
};

export type PlaybackSnapshot = {
  blocks: PlaybackBlock[];
  appliedEvents: number;
  maxT: number;
  lastEvent?: PlaybackEvent;
};

type Vec3 = { x: number; y: number; z: number };

type CubeState = {
  id: string;
  pos: Vec3;
  neighbors: Set<string>;
};

const blockPalette = [
  "#6D5AAE",
  "#A24BFF",
  "#B860FF",
  "#FF9F43",
  "#22C55E",
  "#38BDF8",
  "#F11EE6",
];

function normalizeBaseUrl(rawValue?: string) {
  const value = rawValue?.trim();
  if (!value) {
    return "http://localhost:5001/blokc-13a99/us-central1";
  }
  return value.replace(/\/+$/, "");
}

function getFunctionsBaseUrl() {
  const expoExtra = Constants.expoConfig?.extra as
    | { API_BASE_URL?: string }
    | undefined;
  return normalizeBaseUrl(expoExtra?.API_BASE_URL);
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function toInt(value: unknown, fallback = 0) {
  const parsed = toFiniteNumber(value);
  if (parsed === null) {
    return fallback;
  }
  return Math.trunc(parsed);
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function hashColor(id: string) {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(index);
    hash |= 0;
  }
  return blockPalette[Math.abs(hash) % blockPalette.length];
}

function toDate(value: unknown) {
  if (!value) {
    return undefined;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }

  if (typeof value === "number" || typeof value === "string") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return undefined;
}

async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be signed in.");
  }

  const idToken = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${idToken}`,
  };
}

async function resolvePrimaryChildId(uid: string) {
  const childrenRef = collection(db, "parents", uid, "children");
  const childrenSnapshot = await getDocs(
    query(childrenRef, orderBy("createdAt", "asc"), limit(1))
  );

  if (childrenSnapshot.empty) {
    return undefined;
  }

  return childrenSnapshot.docs[0].id;
}

export function normalizePlaybackEvents(rawEvents: Array<Record<string, unknown>>) {
  const normalized: PlaybackEvent[] = [];

  rawEvents.forEach((rawEvent) => {
    const type = clean(rawEvent.type || rawEvent.event).toLowerCase();
    const t = toFiniteNumber(rawEvent.t ?? rawEvent.ts);
    const cubeA = clean(rawEvent.cubeA || rawEvent.a);
    const cubeB = clean(rawEvent.cubeB || rawEvent.b);

    if (!cubeA || !cubeB || t === null) {
      return;
    }

    if (type !== "connect" && type !== "disconnect") {
      return;
    }

    normalized.push({
      t,
      type,
      cubeA,
      faceA: Math.max(0, toInt(rawEvent.faceA ?? rawEvent.fa, 0)),
      cubeB,
      faceB: Math.max(0, toInt(rawEvent.faceB ?? rawEvent.fb, 0)),
    });
  });

  normalized.sort((left, right) => left.t - right.t);
  return normalized;
}

export async function createLiveSession() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("You must be signed in.");
  }

  const childId = await resolvePrimaryChildId(uid);
  const sessionRef = doc(collection(db, "playSessions"));

  await setDoc(sessionRef, {
    parentId: uid,
    childId: childId || null,
    status: "active",
    source: "manual_trigger",
    startedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    sessionId: sessionRef.id,
    childId,
  };
}

export async function finalizeSession(payload: FinalizeSessionPayload) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${getFunctionsBaseUrl()}/finalizeSession`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const responsePayload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      responsePayload?.error || "Could not finalize this session right now."
    );
  }

  return responsePayload as FinalizeSessionResult;
}

export async function getLatestEndedSessionPreview() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    return null;
  }

  const latestRef = doc(
    db,
    "parents",
    uid,
    "sessionMeta",
    "latestEndedSession"
  );
  const latestSnapshot = await getDoc(latestRef);
  if (!latestSnapshot.exists()) {
    return null;
  }

  const data = latestSnapshot.data() || {};
  const sessionId = clean(data.sessionId);
  const playbackJsonPath = clean(data.playbackJsonPath);
  const playbackJsonUrl = clean(data.playbackJsonUrl);
  if (!sessionId || (!playbackJsonPath && !playbackJsonUrl)) {
    return null;
  }

  return {
    sessionId,
    childId: clean(data.childId) || null,
    durationSeconds: Math.max(0, toInt(data.durationSeconds, 0)),
    eventCount: Math.max(0, toInt(data.eventCount, 0)),
    playbackDurationMs: Math.max(0, toInt(data.playbackDurationMs, 0)),
    playbackJsonPath: playbackJsonPath || undefined,
    playbackJsonUrl: playbackJsonUrl || undefined,
    endedAt: toDate(data.endedAt),
  } as LatestEndedSessionPreview;
}

async function fetchPlaybackArtifactFromUrl(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load playback artifact (${response.status}).`);
  }

  const payload = (await response.json()) as SessionPlaybackArtifact;
  return {
    ...payload,
    events: normalizePlaybackEvents(payload?.events || []),
  };
}

export async function loadPlaybackArtifact(options: {
  playbackJsonPath?: string;
  playbackJsonUrl?: string;
}) {
  const playbackJsonUrl = clean(options.playbackJsonUrl);
  if (playbackJsonUrl) {
    return fetchPlaybackArtifactFromUrl(playbackJsonUrl);
  }

  const playbackJsonPath = clean(options.playbackJsonPath);
  if (!playbackJsonPath) {
    throw new Error("Missing playback JSON location.");
  }

  try {
    const downloadUrl = await getDownloadURL(storageRef(storage, playbackJsonPath));
    return fetchPlaybackArtifactFromUrl(downloadUrl);
  } catch {
    throw new Error(
      "Playback JSON is not accessible with current Storage rules. End the session again so finalizeSession can attach a replay URL."
    );
  }
}

function getFaceVector(face: number): Vec3 {
  switch (face) {
    case 1:
      return { x: 0, y: 1, z: 0 };
    case 6:
      return { x: 0, y: -1, z: 0 };
    case 2:
      return { x: 1, y: 0, z: 0 };
    case 5:
      return { x: -1, y: 0, z: 0 };
    case 3:
      return { x: 0, y: 0, z: 1 };
    case 4:
      return { x: 0, y: 0, z: -1 };
    default:
      return { x: 0, y: 1, z: 0 };
  }
}

function addVec(left: Vec3, right: Vec3): Vec3 {
  return {
    x: left.x + right.x,
    y: left.y + right.y,
    z: left.z + right.z,
  };
}

function getOrCreateCube(cubes: Map<string, CubeState>, id: string) {
  const existing = cubes.get(id);
  if (existing) {
    return existing;
  }

  const created: CubeState = {
    id,
    pos: { x: 0, y: 0, z: 0 },
    neighbors: new Set<string>(),
  };
  cubes.set(id, created);
  return created;
}

export function buildPlaybackSnapshot(events: PlaybackEvent[], uptoMs: number) {
  const cubes = new Map<string, CubeState>();
  let appliedEvents = 0;
  let lastEvent: PlaybackEvent | undefined;

  events.forEach((event) => {
    if (event.t > uptoMs) {
      return;
    }

    appliedEvents += 1;
    lastEvent = event;

    if (event.type === "connect") {
      const hasA = cubes.has(event.cubeA);
      const hasB = cubes.has(event.cubeB);

      if (!hasA && !hasB) {
        const cubeA = getOrCreateCube(cubes, event.cubeA);
        cubeA.pos = { x: 0, y: 0, z: 0 };
        const cubeB = getOrCreateCube(cubes, event.cubeB);
        cubeB.pos = addVec(cubeA.pos, getFaceVector(event.faceA));
        cubeA.neighbors.add(cubeB.id);
        cubeB.neighbors.add(cubeA.id);
        return;
      }

      if (hasA && !hasB) {
        const cubeA = cubes.get(event.cubeA)!;
        const cubeB = getOrCreateCube(cubes, event.cubeB);
        cubeB.pos = addVec(cubeA.pos, getFaceVector(event.faceA));
        cubeA.neighbors.add(cubeB.id);
        cubeB.neighbors.add(cubeA.id);
        return;
      }

      if (!hasA && hasB) {
        const cubeB = cubes.get(event.cubeB)!;
        const cubeA = getOrCreateCube(cubes, event.cubeA);
        cubeA.pos = addVec(cubeB.pos, getFaceVector(event.faceB));
        cubeA.neighbors.add(cubeB.id);
        cubeB.neighbors.add(cubeA.id);
        return;
      }

      const cubeA = cubes.get(event.cubeA)!;
      const cubeB = cubes.get(event.cubeB)!;
      cubeA.neighbors.add(cubeB.id);
      cubeB.neighbors.add(cubeA.id);
      return;
    }

    const cubeA = cubes.get(event.cubeA);
    const cubeB = cubes.get(event.cubeB);
    if (!cubeA || !cubeB) {
      return;
    }

    cubeA.neighbors.delete(cubeB.id);
    cubeB.neighbors.delete(cubeA.id);

    if (cubeA.neighbors.size === 0) {
      cubes.delete(cubeA.id);
    }

    if (cubeB.neighbors.size === 0) {
      cubes.delete(cubeB.id);
    }
  });

  const blocks = Array.from(cubes.values())
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((cube) => ({
      id: cube.id,
      x: cube.pos.x,
      y: cube.pos.y,
      z: cube.pos.z,
      color: hashColor(cube.id),
    }));

  return {
    blocks,
    appliedEvents,
    maxT: events.length ? events[events.length - 1].t : 0,
    lastEvent,
  } as PlaybackSnapshot;
}

export function playbackEventToContractEvent(
  event: PlaybackEvent,
  sessionId: string
) {
  return {
    session_id: sessionId,
    ts: event.t,
    event: event.type,
    a: event.cubeA,
    fa: event.faceA,
    b: event.cubeB,
    fb: event.faceB,
  };
}

export const DEMO_PLAYBACK_TEMPLATE: PlaybackEvent[] = [
  { t: 0, type: "connect", cubeA: "Cube_1", faceA: 2, cubeB: "Cube_2", faceB: 5 },
  { t: 1200, type: "connect", cubeA: "Cube_2", faceA: 1, cubeB: "Cube_3", faceB: 6 },
  { t: 2400, type: "connect", cubeA: "Cube_3", faceA: 3, cubeB: "Cube_4", faceB: 4 },
  { t: 3600, type: "connect", cubeA: "Cube_4", faceA: 1, cubeB: "Cube_5", faceB: 6 },
  { t: 4800, type: "disconnect", cubeA: "Cube_2", faceA: 1, cubeB: "Cube_3", faceB: 6 },
  { t: 6000, type: "connect", cubeA: "Cube_2", faceA: 3, cubeB: "Cube_6", faceB: 4 },
];
