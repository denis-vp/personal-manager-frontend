import { Note, notes } from "./index"
import { v4 as uuidv4 } from "uuid";
import { loremIpsum } from "lorem-ipsum";
import wss from "./socket";

export const noteGenerator = async () => {
    while (true) {
        console.log("Generating a new note...");
        const note: Note = {
            id: uuidv4(),
            title: `Random Note`,
            category: "random",
            content: loremIpsum({
                count: Math.floor(Math.random() * 10) + 1,
                units: "sentences",
            }),
            date: new Date().toISOString().slice(0, 10),
        };
        notes.push(note);
        console.log("Note generated:", note);
        wss.clients.forEach((client) => {
            client.send(JSON.stringify(note));
        });
        
        // Generate a new note every 5-15 seconds
        const timeOutDuration = Math.floor(Math.random() * 5000) + 10000;
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}