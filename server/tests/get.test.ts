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
  notes.splice(
    notes.findIndex((n) => n.id === "testId"),
    1
  );

  server.close();
});

describe("Test get all notes", () => {
  test("It should respond with the GET method on all notes", (done) => {
    request(server)
      .get("/notes")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        done();
      });
  });
});

describe("Test get specific note", () => {
  test("It should respond with the GET method on a specific note", (done) => {
    request(server)
      .get("/notes/testId")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(note);
        done();
      });
  });
  test("It should respond with the GET method on a specific note that does not exist", (done) => {
    request(server)
      .get("/notes/wrongId")
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ message: "Note not found" });
        done();
      });
  });
});
