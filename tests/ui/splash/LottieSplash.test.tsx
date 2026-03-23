import React from "react";
import { render } from "@testing-library/react-native";

import { LottieSplash } from "@/features/splash/LottieSplash";

const mockLottieView = jest.fn();

jest.mock("lottie-react-native", () => {
  return function MockLottieView(props: unknown) {
    mockLottieView(props);
    const { Text } = require("react-native");
    return <Text>Lottie Splash Animation</Text>;
  };
});

describe("LottieSplash", () => {
  beforeEach(() => {
    mockLottieView.mockClear();
  });

  it("renders the splash animation", () => {
    const { getByText } = render(<LottieSplash />);

    expect(getByText("Lottie Splash Animation")).toBeTruthy();
  });

  it("calls onFinish when the animation completes", () => {
    const onFinish = jest.fn();

    render(<LottieSplash onFinish={onFinish} />);

    const props = mockLottieView.mock.calls[0]?.[0] as {
      onAnimationFinish?: () => void;
    };

    props.onAnimationFinish?.();

    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
