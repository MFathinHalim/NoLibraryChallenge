import * as http from "http"; //Import Library http

//Host and Port
const host: string = "localhost";
const port: number = 8080;

//Types Value
type notesType = {
  id: string;
  value: string;
  time: string;
};

let notes: notesType[] = []; //Data Notes

const requestListener: http.RequestListener = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  //Servernya
  res.writeHead(200, {
    // Pastikan kodenya 200
    "Content-Type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "*",
    "access-control-request-headers": "*",
  });

  //* Request
  //? Post buat "/add"
  if (req.method === "POST" && req.url === "/add") {
    let body: string = ""; //Bodynya kosong
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString(); // Dapatin data yang didapatkan
    });
    //Kalau Requestnya sudah didapatkan
    req.on("end", async () => {
      try {
        const parsedBody: { value: string } = JSON.parse(body); // Dapatin valuennya
        const formattedDate: string = new Date().toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); //? Bikin date nya

        //Push Notes :3
        notes.push({
          id: btoa(parsedBody.value),
          value: parsedBody.value,
          time: formattedDate,
        });

        // udah selesai, kirim kode 200. \(0w0)/
        res.writeHead(200);
        res.end("Note added successfully!"); // Added here
      } catch (error) {
        console.error("Error parsing request body:", error); //kalau error, di log
        res.writeHead(400); // kasih 400
        res.end("Error!");
      }
    });
  } else if (req.url === "/getNotes") {
    //ini mau ngedapatin notesnya
    res.write(JSON.stringify({ code: 200, notes: notes })); //Kirim datanya
    res.end(); // End responsenya
  } else if (req.method === "POST" && req.url === "/delete") {
    //? Nah ini kalau delete
    let body: string = ""; //Bodynya kosong

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString(); // Dapatin request datanya
    });

    req.on("end", async () => {
      const parsedBody: { id: string } = JSON.parse(body);
      try {
        notes = notes.filter((obj) => obj.id != parsedBody.id); //! Hapus Datanya /(T-T)\
        res.writeHead(200); //kasih code 200
        res.end("Note deleted successfully!"); // Kirim message
      } catch (error) {
        console.error("Error parsing request body:", error); //Log error
        res.writeHead(400); // Bad Request
        res.end("Error!");
      }
    });
  } else {
    //? Kalau dikasih aneh aneh
    res.writeHead(404); // Not Found
    res.end("Resource not found");
  }
};

//Bikin servernya dari request listener tadi
const server: http.Server = http.createServer(requestListener);

//Run servernya \(UwU)/
server.listen(port, host, () => {
  console.log(`[${host}] Server berjalan di port ${port}`);
});
