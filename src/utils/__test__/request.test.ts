import { get, post } from "../request";

describe("TEST: apisauce", () => {
  test("GET request", async () => {
    const { data } = await get(
      "https://cache.video.iqiyi.com/jp/avlist/202861101/1/",
    );
    console.log(data);
  });
});
