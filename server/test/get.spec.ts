import request from "supertest";
import server from "../src/index";

afterAll(() => {
  server.close();
});

describe("Test the root path", () => {
  test("It should response the GET method", (done) => {
    request(server)
    .get("/notes")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});