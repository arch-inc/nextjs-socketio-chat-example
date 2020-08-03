import { Server } from "socket.io";
import { IncomingMessage, ServerResponse } from "http";

import { emitJSON } from "./emitJSON";
import { isRoomName } from "./isRoomName";
import { getRoomId } from "./getRoomId";
import { getRoomName } from "./getRoomName";
import { isUserName } from "./isUserName";
import { getUserId } from "./getUserId";

type RequestHandler = (req: IncomingMessage, res: ServerResponse) => boolean;

export function createRequestHandler(server: Server): RequestHandler {
  return function (req, res): boolean {
    if (typeof req.url !== "string") {
      return false;
    }
    // get list of rooms
    if (/^\/api\/rooms\??.*$/.test(req.url)) {
      emitJSON(
        res,
        Object.keys(server.of("/").adapter.rooms)
          .filter(isRoomName)
          .map(getRoomId)
      );
      return true;
    }

    // get list of users
    if (/^\/api\/users(\?.*)?$/.test(req.url)) {
      emitJSON(
        res,
        Object.keys(server.of("/").adapter.rooms)
          .filter(isUserName)
          .map(getUserId)
      );
      return true;
    }

    // get list of users in a room
    let usersInRoom: RegExpExecArray;
    if ((usersInRoom = /^\/api\/users\/in\/(.+)\??.*$/.exec(req.url))) {
      const roomId = usersInRoom[1];
      const rooms = server.of("/").adapter.rooms;
      const room = rooms[getRoomName(roomId)];
      if (!room) {
        emitJSON(res, []);
        return true;
      }
      emitJSON(res, Object.keys(room.sockets));
      return true;
    }

    return false;
  };
}
