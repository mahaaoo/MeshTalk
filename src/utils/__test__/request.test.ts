import { get } from "../request";

describe("TEST: apisauce get", () => {
  test("GET request", async () => {
    const { ok } = await get(
      "https://cache.video.iqiyi.com/jp/avlist/202861101/1/",
    );
    expect(ok).toBe(true);
  });
});
