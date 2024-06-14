import { get } from "../src/utils/request";

describe("request util", () => {
  test("get request", async () => {
    const { ok } = await get(
      "https://cache.video.iqiyi.com/jp/avlist/202861101/1/",
    );
    expect(ok).toBe(true);
  });
});
