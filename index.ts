import * as http from "http";
import { createServer } from "http";
const host: string = "localhost";
const port: number = 8080;

type notesType = {
  id: string;
  value: string;
  time: string;
};

let notes: notesType[] = [];

const requestListener: http.RequestListener = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  res.writeHead(200, {
    // Ensure status code is 200
    "Content-Type": "application/json",
    "access-control-allow-origin": "*", // Adjust for specific origin if needed
    "access-control-allow-methods": "*", // Adjust for allowed methods if needed
    "access-control-request-headers": "*", // Adjust for allowed headers if needed
  });

  if (req.method === "POST" && req.url === "/add") {
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString(); // Concatenate received data chunks
    });

    req.on("end", async () => {
      try {
        const parsedBody: { value: string } = JSON.parse(body); // Ensure type safety
        const formattedDate: string = new Date().toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        notes.push({
          id: btoa(parsedBody.value),
          value: parsedBody.value,
          time: formattedDate,
        });

        res.writeHead(200);
        res.end("Note added successfully!"); // Added here
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.writeHead(400); // Bad Request
        res.end("Invalid data format!");
      }
    });
  } else if (req.url === "/getNotes") {
    res.write(JSON.stringify({ code: 200, notes: notes }));
    res.end(); // Ensures response stream ends
  } else if (req.method === "POST" && req.url === "/delete") {
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString(); // Concatenate received data chunks
    });

    req.on("end", async () => {
      const parsedBody: { id: string } = JSON.parse(body); // Ensure type safety

      try {
        notes = notes.filter((obj) => obj.id != parsedBody.id); // Filter the data
        res.writeHead(200);
        res.end("Note added successfully!"); // Added here
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.writeHead(400); // Bad Request
        res.end("Invalid data format!");
      }
    });
  } else {
    res.writeHead(404); // Not Found
    res.end("Resource not found");
  }
};

const server: http.Server = createServer(requestListener);

server.listen(port, host, () => {
  console.log("Servernya jalan sayang :3");
});
