# Playback / Replay Notes

This document summarizes how session replay playback works in the app right now.

## Goal

After a session ends, replay the most recent ended session in the live/session card using playback JSON data.

## High-Level Flow

1. Session ends.
2. Finalization stores session metadata in Firestore (`playSessions`) and replay JSON in Storage.
3. App reads last ended session metadata.
4. App loads playback artifact JSON.
5. Replay UI renders:
   - timer/play controls
   - 3D structure viewport
   - replay progress (`Events x/y`, percent)

## Data Contract (Replay Events)

Replay JSON is an ordered array of events, for example:

- `t`: timestamp in milliseconds from replay start
- `type`: `"connect"` or `"disconnect"`
- `cubeA`, `faceA`, `cubeB`, `faceB`

The renderer uses event timestamps to reproduce structure state over time.

## Main App Areas

- Screen/UI orchestration:
  - `src/features/play-session/screens/LiveSessionScreen.tsx`
- 3D playback canvas:
  - `src/features/play-session/components/PlaybackThreeCanvas.tsx`
- Session playback loading/service logic:
  - `src/services/sessionPlayback` (and related replay loaders)

## Firebase Dependencies

- Firestore session doc should include replay metadata:
  - playback path / URL
  - event count, duration, status
- Storage object must be readable by app user path/rules model.

If replay JSON cannot be loaded, app falls back to an error message in replay card.

## Known Runtime Requirement (Android)

For 3D replay using Expo GL stack, the installed app must include required native modules.
If ExpoGL native module is missing, rebuild/install dev client:

- `npx expo run:android --device`
- `npx expo start --dev-client -c`

## Current UX Behavior

- Replay auto-progresses with event timestamps.
- Progress bar and event counters update during playback.
- Step-by-step manual event button is removed from default flow.
