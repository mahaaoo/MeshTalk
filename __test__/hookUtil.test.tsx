import { useSubscribeToken } from "@utils/hooks";
import useAppStore from "../src/store/useAppStore";
import { renderHook } from "@testing-library/react-native";

describe("Hooks util", () => {
  test("useSubscribeToken", async () => {
    const fetchApi = jest.fn();

    renderHook(() => useSubscribeToken(fetchApi));
    useAppStore.setState({
      token: "123",
    });

    expect(fetchApi).toHaveBeenCalled();
  });
});
