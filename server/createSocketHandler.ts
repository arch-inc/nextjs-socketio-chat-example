import { Server, Socket } from "socket.io";
import { UserProfileIface } from "../shared/UserProfileIface";
import { getRoomName } from "./getRoomName";
import { isRoomName } from "./isRoomName";
import { TextIface } from "../shared/TextIface";

export function createSocketHandler(server: Server) {
  return function socketHandler(socket: Socket) {
    /**
     * somebody is leaving the session
     */
    function onDisconnecting() {
      // broadcast "bye" message in rooms of which s/he is a member
      Object.keys(socket.rooms)
        .filter(isRoomName)
        .forEach((roomName) => {
          socket.to(roomName).emit("bye", socket.id);
          console.log(
            "[disconnecting] somebody is leaving the room",
            roomName,
            "sent from",
            socket.id
          );
        });
    }

    /**
     * somebody joined this session and said hello
     * @param roomId - room id
     * @param profile - user profile
     */
    function onHello(roomId: string, profile: UserProfileIface) {
      const roomName = getRoomName(roomId);

      // request to send text logs
      const room = server.sockets.adapter.rooms[roomName];
      if (room) {
        const users = Object.keys(room.sockets);
        if (users.length > 0) {
          server.to(users[0]).emit("logs", socket.id);
        }
      }

      socket.join(roomName, () => {
        // broadcast "hello" message to room members
        socket.to(roomName).emit("hello", profile, socket.id);
      });

      console.log(
        "somebody joined this session and said hello",
        roomId,
        profile,
        "sent from",
        socket.id
      );
    }

    /**
     * somebody responded to one's greeting
     * @param roomId - room id
     * @param profile - user profile
     */
    function onHelloAck(roomId: string, profile: UserProfileIface) {
      // broadcast "hello-ack" message to room members
      socket.to(getRoomName(roomId)).emit("hello-ack", profile, socket.id);
      console.log(
        "somebody responded to one's greeting",
        roomId,
        profile,
        "sent from",
        socket.id
      );
    }

    /**
     * somebody is leaving the room
     * @param roomId - room id
     */
    function onBye(roomId: string) {
      socket.to(getRoomName(roomId)).emit("bye", socket.id);
      socket.leave(getRoomName(roomId));
      console.log(
        "somebody is leaving the room",
        roomId,
        "sent from",
        socket.id
      );
    }

    /**
     * somebody sent logs
     */
    function onLogs(socketId: string, logs: TextIface[]) {
      server.to(socketId).emit("logs-ack", logs);
      console.log(
        "somebody sent",
        Array.isArray(logs) ? logs.length : 0,
        "logs to",
        socketId,
        "sent from",
        socket.id
      );
    }

    /**
     * somebody said something
     * @param roomId - room id
     * @param message - text message
     */
    function onText(roomId: string, message: string) {
      server.to(getRoomName(roomId)).emit("text", {
        message,
        sender: socket.id,
        time: Date.now(),
      } as TextIface);
      console.log(
        "somebody said",
        message,
        "in",
        roomId,
        "sent from",
        socket.id
      );
    }

    socket.on("disconnecting", onDisconnecting);
    socket.on("hello", onHello);
    socket.on("hello-ack", onHelloAck);
    socket.on("text", onText);
    socket.on("logs", onLogs);
    socket.on("bye", onBye);
  };
}
