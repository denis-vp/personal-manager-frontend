import request from "supertest";
import server, { Note, notes } from "../index.ts";
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

describe("Test to update notes", () => {
  const newNote: Note = {
    id: "testId",
    title: "An Updated Note",
    category: "todos",
    content: "This is an updated note",
    date: new Date().toISOString().slice(0, 10),
  };

  test("It should respond with the PATCH method on a note", (done) => {
    request(server)
      .patch("/notes/testId")
      .send(newNote)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(newNote);
        done();
      });
  });

  test("It should respond with the PATCH method on a note that does not exist", (done) => {
    request(server)
      .patch("/notes/wrongId")
      .send(newNote)
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ message: "Note not found" });
        done();
      });
  });
});
