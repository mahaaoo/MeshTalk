import { arrayToTree } from "../src/utils/array";

describe("Array To Tree", () => {
  test("tree", async () => {
    const head = {
      id: "112631166361614120"
    }
    const testArray: any[] = [
      {
          "id": "112631182528667321",
          "in_reply_to_account_id": "106884305002328353",
          "in_reply_to_id": "112631166361614120",
      },
      {
          "id": "112631193684929527",
          "in_reply_to_account_id": "106884305002328353",
          "in_reply_to_id": "112631182528667321",
      },
      {
          "id": "112631205827636062",
          "in_reply_to_account_id": "106884305002328353",
          "in_reply_to_id": "112631193684929527",
      },
      {
          "id": "112631206853252073",
          "in_reply_to_account_id": "106884305002328353",
          "in_reply_to_id": "112631166361614120",
      },
      {
          "id": "112631211921015781",
          "in_reply_to_account_id": "37781",
          "in_reply_to_id": "112631206853252073",
      }
    ]

    const tree = arrayToTree(testArray, head, 0);
    expect(tree.children[0].node).toBe(testArray[0]);
    expect(tree.children[0].children[0].node).toBe(testArray[1]);
    expect(tree.children[0].children[0].children[0].node).toBe(testArray[2]);
  });
});
