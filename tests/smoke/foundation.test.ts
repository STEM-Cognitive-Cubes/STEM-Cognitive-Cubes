import { useAuth } from "@/hooks/useAuth";

describe("test foundation", () => {
  it("resolves repo aliases inside the jest-expo environment", () => {
    expect(useAuth()).toMatchObject({
      childId: "child123",
      token: "mock-token-123",
    });
  });
});
