import React from "react";
import { render } from "@testing-library/react-native";

import { LottieSplash } from "@/features/splash/LottieSplash";

jest.mock("lottie-react-native", () => {
  return function MockLottieView() {
    const { Text } = require("react-native");
    return <Text>Lottie Splash Animation</Text>;
  };
});

describe("LottieSplash", () => {
  it("renders the splash animation", () => {
    const { getByText } = render(<LottieSplash />);

    expect(getByText("Lottie Splash Animation")).toBeTruthy();
  });
});
