import {
  callFunction,
  cleanupBackendTestEnv,
  clearBackendState,
  createSignedInUser,
  getCurrentUserToken,
  readCollection,
  readDocument,
  seedDocument,
} from "../helpers/backendEmulator";

describe("finalizeSession function backend behavior", () => {
  beforeEach(async () => {
    await clearBackendState();
  });

  afterAll(async () => {
    await cleanupBackendTestEnv();
  });

  it("rejects unauthenticated requests", async () => {
    const response = await callFunction("finalizeSession", {
      method: "POST",
      body: { sessionId: "session-unauth" },
    });

    expect(response.status).toBe(401);
    expect(response.json).toEqual({
      error: "Your session expired. Please sign in again.",
    });
  });

  it("rejects payloads that do not include a sessionId", async () => {
    await createSignedInUser("backend-finalize-missing@example.com", "Password123!");
    const token = await getCurrentUserToken();

    const response = await callFunction("finalizeSession", {
      method: "POST",
      token,
      body: {
        durationSeconds: 10,
        events: [],
      },
    });

    expect(response.status).toBe(400);
    expect(response.json).toEqual({ error: "sessionId is required" });
  });

  it("rejects requests that try to finalize another parent's session", async () => {
    const user = await createSignedInUser("backend-finalize-forbidden@example.com", "Password123!");
    const token = await getCurrentUserToken();

    await seedDocument(["playSessions", "foreign-session"], {
      parentId: "someone-else",
      status: "active",
    });

    const response = await callFunction("finalizeSession", {
      method: "POST",
      token,
      body: {
        sessionId: "foreign-session",
        durationSeconds: 10,
        events: [],
      },
    });

    expect(user.uid).toBeDefined();
    expect(response.status).toBe(403);
    expect(response.json).toEqual({ error: "Forbidden" });
  });

  it("returns the expected response shape and persists session metadata for a valid payload", async () => {
    const user = await createSignedInUser("backend-finalize-success@example.com", "Password123!");
    const token = await getCurrentUserToken();
    const sessionId = `session-success-${Date.now()}`;

    const response = await callFunction("finalizeSession", {
      method: "POST",
      token,
      body: {
        sessionId,
        childId: "child-1",
        durationSeconds: 12,
        events: [
          { t: 0, type: "connect", cubeA: "A", faceA: 2, cubeB: "B", faceB: 5 },
          { t: 1500, type: "disconnect", cubeA: "A", faceA: 2, cubeB: "B", faceB: 5 },
          { t: -3, type: "connect", cubeA: "X", cubeB: "Y" },
        ],
      },
    });

    const sessionDoc = await readDocument(["playSessions", sessionId]);
    const latestEndedSession = await readDocument([
      "parents",
      user.uid,
      "sessionMeta",
      "latestEndedSession",
    ]);
    const edgeEvents = await readCollection(["playSessions", sessionId, "edgeEvents"]);

    expect(response.status).toBe(200);
    expect(response.json).toMatchObject({
      sessionId,
      source: "request_payload",
      eventCount: 2,
      invalidEventCount: 1,
      durationMs: 1500,
    });
    expect(response.json?.playbackJsonPath).toBe(`sessions/${sessionId}/session.json`);
    expect(typeof response.json?.playbackJsonUrl).toBe("string");

    expect(sessionDoc).toMatchObject({
      parentId: user.uid,
      childId: "child-1",
      status: "ended",
      durationSeconds: 12,
      eventCount: 2,
      playbackDurationMs: 1500,
      playbackSchemaVersion: 1,
    });
    expect(sessionDoc?.playbackJsonPath).toBe(`sessions/${sessionId}/session.json`);
    expect(latestEndedSession).toMatchObject({
      sessionId,
      childId: "child-1",
      status: "ended",
      durationSeconds: 12,
      eventCount: 2,
      playbackDurationMs: 1500,
    });
    expect(edgeEvents).toHaveLength(2);
  });

  it("uses existing stored edge events without duplicating them on repeated finalization", async () => {
    const user = await createSignedInUser("backend-finalize-duplicate@example.com", "Password123!");
    const token = await getCurrentUserToken();
    const sessionId = "session-duplicate-check";

    await seedDocument(["playSessions", sessionId], {
      parentId: user.uid,
      status: "active",
    });
    await seedDocument(["playSessions", sessionId, "edgeEvents", "000000"], {
      session_id: sessionId,
      ts: 1200,
      event: "connect",
      a: "A",
      fa: 2,
      b: "B",
      fb: 5,
    });

    const response = await callFunction("finalizeSession", {
      method: "POST",
      token,
      body: {
        sessionId,
        durationSeconds: 2,
        events: [
          { t: 0, type: "connect", cubeA: "X", faceA: 1, cubeB: "Y", faceB: 6 },
        ],
      },
    });

    const edgeEvents = await readCollection(["playSessions", sessionId, "edgeEvents"]);

    expect(response.status).toBe(200);
    expect(response.json).toMatchObject({
      sessionId,
      source: "firestore_edge_events",
      eventCount: 1,
      invalidEventCount: 0,
      durationMs: 1200,
    });
    expect(edgeEvents).toHaveLength(1);
  });
});
