import { render } from "@testing-library/react-native";
import renderer from "react-test-renderer";

import App from "../src/app/_layout";
import ActionsSheet from "../src/components/ActionsSheet";

describe("ActionsSheet Reply", () => {
  it("Reply Show", () => {
    render(<App />);

    const onSelect = jest.fn();
    const onClose = jest.fn();

    ActionsSheet.Reply.show({ onSelect, onClose });

    renderer.create(<App />);

    expect(ActionsSheet.Reply.isExist()).toBe(true);
  });
});
