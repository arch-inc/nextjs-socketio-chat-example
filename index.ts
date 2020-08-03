import next from "next";
import { Server } from "http";
import io from "socket.io";
import path from "path";
import fs from "fs";

import { generateUserName } from "./server/generateUserName";
import { createSocketHandler } from "./server/createSocketHandler";
import { createRequestHandler } from "./server/createRequestHandler";

const port = parseInt(process.env.PORT) || 3000;
const env = process.env.NODE_ENV || "production";
const dev = env !== "production";
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json")).toString()
);

const nextApp = next({
  dir: ".",
  dev,
});
const handler = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(async () => {
    // create http server
    const httpServer = new Server((req, res) => {
      requestHandler(req, res) || handler(req, res);
    });

    // create Socket.io server
    const socketServer = io(httpServer);
    const socketHandler = createSocketHandler(socketServer);
    const requestHandler = createRequestHandler(socketServer);
    socketServer.engine["generateId"] = generateUserName;
    socketServer.on("connection", socketHandler);

    // start listening
    httpServer.listen(port, () => {
      console.error("Web server started to listen port:", port);
    });
  })
  .catch((err) => {
    console.error("Next.js server failed to start", err);
  });
