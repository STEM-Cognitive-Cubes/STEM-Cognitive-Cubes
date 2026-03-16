# Splash Screen Implementation

## Overview

The splash screen provides an engaging animated introduction when users launch the STEM Cognitive Cubes application. It utilizes **Lottie animations** for smooth, high-quality vector animations that are lightweight and scalable across different device sizes.

---

## Architecture

### Component Location

```
src/
└── features/
    └── splash/
        └── LottieSplash.tsx
```

### Assets

```
assets/
└── lottie/
    └── splash.json
```

---

## Technical Implementation

### Component: `LottieSplash`

A functional React Native component that renders a full-screen animated splash experience.

#### Props

| Prop       | Type         | Required | Description                                              |
| ---------- | ------------ | -------- | -------------------------------------------------------- |
| `onFinish` | `() => void` | No       | Callback function triggered when the animation completes |

#### Features

- **Full-Screen Animation**: Uses `StyleSheet.absoluteFill` to cover the entire viewport
- **Auto-Play**: Animation starts automatically on component mount
- **Non-Looping**: Plays once and triggers completion callback
- **Responsive**: `resizeMode="cover"` ensures the animation scales appropriately

### Code Example

```tsx
import { LottieSplash } from '@/features/splash/LottieSplash';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <LottieSplash onFinish={() => setShowSplash(false)} />;
  }

  return <MainApp />;
}
```

---

## Dependencies

| Package               | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `lottie-react-native` | Renders Lottie JSON animations in React Native |
| `react-native`        | Core framework (Animated, StyleSheet, View)    |

---

## Design Specifications

| Property         | Value                 |
| ---------------- | --------------------- |
| Background Color | `#B860FF` (Purple)    |
| Animation Format | Lottie JSON           |
| Animation Mode   | Single play (no loop) |
| Resize Mode      | Cover                 |

---

## Animation Flow

```
┌─────────────────────┐
│   App Launches      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  LottieSplash       │
│  Component Mounts   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Lottie Animation   │
│  Auto-Plays         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  onAnimationFinish  │
│  Callback Triggers  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  onFinish Prop      │
│  Executes           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Navigate to        │
│  Main Application   │
└─────────────────────┘
```

---

## Styling

The component includes pre-defined styles for optional text overlays:

- **Title**: 38px, bold (800 weight), white text with letter spacing
- **Subtitle**: 16px, medium weight (500), semi-transparent white

These styles are available for future enhancements if text needs to be added to the splash screen.

---

## Best Practices

1. **Keep animations short**: Splash animations should be 2-4 seconds to avoid user frustration
2. **Optimize Lottie files**: Use tools like [LottieFiles](https://lottiefiles.com/) to compress animations
3. **Test on multiple devices**: Ensure the animation looks good on various screen sizes
4. **Provide fallback**: Consider a static fallback for devices that may have issues with Lottie

---

## Future Enhancements

- [ ] Add animated text overlay with slide-in effect
- [ ] Implement skip functionality for returning users
- [ ] Add accessibility considerations (reduced motion support)
- [ ] Cache animation for faster subsequent loads

---

## Related Documentation

- [Lottie React Native Documentation](https://github.com/lottie-react-native/lottie-react-native)
- [LottieFiles - Animation Resources](https://lottiefiles.com/)

---

_Last Updated: February 2026_
