# SVG Transformer – Team Guide

This doc explains the SVG import pipeline used in the project so every contributor can work with SVG assets without hitting build issues.

---

## What it does

`react-native-svg-transformer` lets us import `.svg` files directly as React components instead of using `<Image source={...}>`. This gives us:

- Scalable, resolution-independent icons and illustrations
- Props like `width`, `height`, and `fill` on every SVG
- Smaller bundle size (no rasterized PNGs needed for vector art)

## Dependencies

| Package                        | Purpose                      |
| ------------------------------ | ---------------------------- |
| `react-native-svg`             | SVG rendering primitives     |
| `react-native-svg-transformer` | Metro transformer for `.svg` |

Both are already in `package.json`. No extra install needed when pulling the repo.

## How it works

### 1. Metro config (`metro.config.js`)

```js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();
```

Key points:

- `.svg` is **removed** from `assetExts` so Metro stops treating it as a static asset.
- `.svg` is **added** to `sourceExts` so Metro runs it through the Babel transformer.
- The transformer path points to `react-native-svg-transformer/expo` (the Expo-specific entry).

### 2. TypeScript declaration (`src/declarations.d.ts`)

```ts
declare module '*.svg' {
  import * as React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
```

This tells TypeScript that every `.svg` import default-exports a React component accepting `SvgProps`.

### 3. Usage in components

```tsx
import HistoryCardSvg from '@/assets/cards/historyCard.svg';

// Use it like any component:
<HistoryCardSvg width="100%" height="100%" />;
```

## Adding a new SVG asset

1. Drop the `.svg` file into the appropriate folder under `src/assets/`.
2. Import it in your component – no extra config needed.
3. If TypeScript complains, restart the TS server (`Ctrl+Shift+P` → _TypeScript: Restart TS Server_).

## Common issues

| Symptom                          | Fix                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `Unable to resolve module *.svg` | Make sure Metro is restarted (`npx expo start --clear`).                           |
| TypeScript "Cannot find module"  | Check that `src/declarations.d.ts` exists and `tsconfig.json` includes `src/**/*`. |
| SVG renders blank or wrong size  | Verify the SVG's internal `viewBox` attribute is set correctly.                    |
| Build fails after adding new SVG | Clear Metro cache: `npx expo start --clear`.                                       |
| EAS build fails with SVG error   | Run `npx expo prebuild --clean` before rebuilding with EAS.                        |

## Notes for EAS / CI builds

- The transformer only runs at **Metro bundling time**. EAS cloud builds use Metro under the hood, so no extra CI config is required.
- If you ever upgrade `react-native-svg`, also check for a matching `react-native-svg-transformer` release.
