import request from "supertest";
import server, { Note, notes } from "../src/old/index.ts";
import { beforeAll, afterAll, test, describe, expect } from "@jest/globals";

const note: Note = {
  id: "testId",
  title: "A Note",
  category: "todos",
  content: "This is a note",
  date: new Date().toISOString().slice(0, 10),
};

beforeAll(() => {
  notes.push(note);
});

afterAll(() => {
  server.close();
});

describe("Test to delete a note", () => {
  test("It should respond with the DELETE method to delete a note", (done) => {
    request(server)
      .delete("/notes/testId")
      .then((response) => {
        expect(response.statusCode).toBe(204);
        done();
      });
  });
  test("It should respond with the DELETE method to delete a note that does not exist", (done) => {
    request(server)
      .delete("/notes/testId")
      .then((response) => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
});
