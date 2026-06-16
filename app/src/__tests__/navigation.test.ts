import type { RootStackParamList } from "../types/navigation";

test("template navigation exposes the starter routes", () => {
  const routes: Array<keyof RootStackParamList> = ["Auth", "Home", "Profile", "Settings"];

  expect(routes).toContain("Home");
  expect(routes).toHaveLength(4);
});
