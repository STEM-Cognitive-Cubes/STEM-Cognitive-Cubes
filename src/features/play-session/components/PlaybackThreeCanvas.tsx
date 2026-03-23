import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Canvas } from "@react-three/fiber/native";
import * as THREE from "three";

import type { PlaybackEvent } from "@/services/sessionPlayback";

type Props = {
  events: PlaybackEvent[];
  playheadMs: number;
};

type CubeState = {
  id: string;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  neighbors: Set<string>;
  createdAt: number;
};

type RenderCube = {
  id: string;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  scale: number;
  color: string;
};

const CUBE_SIZE = 1;
const GRID_Y = -3 * CUBE_SIZE;
const POP_ANIMATION_MS = 220;
const blockPalette = [
  "#6D5AAE",
  "#A24BFF",
  "#B860FF",
  "#FF9F43",
  "#22C55E",
  "#38BDF8",
  "#F11EE6",
];

function hashColor(id: string) {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(index);
    hash |= 0;
  }
  return blockPalette[Math.abs(hash) % blockPalette.length];
}

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function popScale(ageMs: number) {
  if (ageMs <= 0) {
    return 0.01;
  }
  if (ageMs >= POP_ANIMATION_MS) {
    return 1;
  }
  const t = ageMs / POP_ANIMATION_MS;
  const eased = easeOutBack(t);
  return 0.01 + (1 - 0.01) * eased;
}

function getLocalFaceNormal(face: number) {
  switch (face) {
    case 1:
      return new THREE.Vector3(0, 1, 0);
    case 6:
      return new THREE.Vector3(0, -1, 0);
    case 2:
      return new THREE.Vector3(1, 0, 0);
    case 5:
      return new THREE.Vector3(-1, 0, 0);
    case 3:
      return new THREE.Vector3(0, 0, 1);
    case 4:
      return new THREE.Vector3(0, 0, -1);
    default:
      return new THREE.Vector3(0, 1, 0);
  }
}

function getOrCreateCube(cubes: Map<string, CubeState>, id: string, createdAt: number) {
  const existing = cubes.get(id);
  if (existing) {
    return existing;
  }

  const created: CubeState = {
    id,
    position: new THREE.Vector3(0, 0, 0),
    quaternion: new THREE.Quaternion(),
    neighbors: new Set<string>(),
    createdAt,
  };
  cubes.set(id, created);
  return created;
}

function placeNewCubeRelative(
  anchor: CubeState,
  faceA: number,
  nextCube: CubeState,
  faceB: number
) {
  const anchorNormalLocal = getLocalFaceNormal(faceA);
  const anchorNormalWorld = anchorNormalLocal
    .clone()
    .applyQuaternion(anchor.quaternion)
    .normalize();

  const faceCenter = anchor.position
    .clone()
    .add(anchorNormalWorld.clone().multiplyScalar(CUBE_SIZE / 2));
  const targetDir = anchorNormalWorld.clone().negate();
  const nextFaceNormalLocal = getLocalFaceNormal(faceB);

  const q = new THREE.Quaternion().setFromUnitVectors(
    nextFaceNormalLocal.clone().normalize(),
    targetDir
  );

  nextCube.quaternion.copy(q);
  nextCube.position.copy(
    faceCenter.add(anchorNormalWorld.clone().multiplyScalar(CUBE_SIZE / 2))
  );
}

function buildRenderCubes(events: PlaybackEvent[], playheadMs: number) {
  const cubes = new Map<string, CubeState>();

  events.forEach((event) => {
    if (event.t > playheadMs) {
      return;
    }

    if (event.type === "connect") {
      const hasA = cubes.has(event.cubeA);
      const hasB = cubes.has(event.cubeB);

      if (!hasA && !hasB) {
        const cubeA = getOrCreateCube(cubes, event.cubeA, event.t);
        cubeA.position.set(0, 0, 0);
        cubeA.quaternion.identity();

        const cubeB = getOrCreateCube(cubes, event.cubeB, event.t);
        placeNewCubeRelative(cubeA, event.faceA, cubeB, event.faceB);

        cubeA.neighbors.add(cubeB.id);
        cubeB.neighbors.add(cubeA.id);
        return;
      }

      if (hasA && !hasB) {
        const cubeA = cubes.get(event.cubeA)!;
        const cubeB = getOrCreateCube(cubes, event.cubeB, event.t);
        placeNewCubeRelative(cubeA, event.faceA, cubeB, event.faceB);

        cubeA.neighbors.add(cubeB.id);
        cubeB.neighbors.add(cubeA.id);
        return;
      }

      if (!hasA && hasB) {
        const cubeB = cubes.get(event.cubeB)!;
        const cubeA = getOrCreateCube(cubes, event.cubeA, event.t);
        placeNewCubeRelative(cubeB, event.faceB, cubeA, event.faceA);

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

  return Array.from(cubes.values())
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((cube) => {
      const age = playheadMs - cube.createdAt;
      const scale = popScale(age);
      return {
        id: cube.id,
        position: [
          cube.position.x,
          cube.position.y,
          cube.position.z,
        ] as [number, number, number],
        quaternion: [
          cube.quaternion.x,
          cube.quaternion.y,
          cube.quaternion.z,
          cube.quaternion.w,
        ] as [number, number, number, number],
        scale,
        color: hashColor(cube.id),
      } as RenderCube;
    });
}

export default function PlaybackThreeCanvas({ events, playheadMs }: Props) {
  const cubes = useMemo(
    () => buildRenderCubes(events, playheadMs),
    [events, playheadMs]
  );

  return (
    <View style={styles.container}>
      <Canvas
        style={styles.canvas}
        camera={{ fov: 60, near: 0.1, far: 1000, position: [6, 6, 10] }}
      >
        <color attach="background" args={["#0b0e14"]} />
        <ambientLight intensity={0.62} />
        <directionalLight intensity={0.9} position={[5, 10, 7]} />
        <gridHelper
          args={[40, 40, new THREE.Color("#3a4a6a"), new THREE.Color("#1f2a44")]}
          position={[0, GRID_Y, 0]}
        />

        {cubes.map((cube) => (
          <mesh
            key={cube.id}
            position={cube.position}
            quaternion={cube.quaternion}
            scale={[cube.scale, cube.scale, cube.scale]}
          >
            <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
            <meshStandardMaterial
              color={cube.color}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        ))}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  canvas: {
    flex: 1,
  },
});
