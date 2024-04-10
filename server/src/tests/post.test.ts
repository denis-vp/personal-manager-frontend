import request from "supertest";
import server, { Note, notes } from "../index.ts";
import { afterAll, test, describe, expect } from "@jest/globals";

const note: Note = {
  id: "testId",
  title: "A Note",
  category: "todos",
  content: "This is a note",
  date: new Date().toISOString().slice(0, 10),
};

afterAll(() => {
  notes.splice(
    notes.findIndex((n) => n.id === "testId"),
    1
  );

  server.close();
});

describe("Test to add a note", () => {
  test("It should respond with the POST method to add a note", (done) => {
    request(server)
      .post("/notes/create")
      .send(note)
      .then((response) => {
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toStrictEqual(note.title);
        expect(response.body.category).toStrictEqual(note.category);
        expect(response.body.content).toStrictEqual(note.content);
        expect(response.body.date).toStrictEqual(note.date);
        done();
      });
  });
});
