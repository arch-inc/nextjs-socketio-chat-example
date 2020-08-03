import { FC, useState, useEffect, useCallback, useContext } from "react";
import SocketIO, { Socket } from "socket.io-client";

import UserProfileContext from "../profile/UserProfileContext";
import { UserProfileIface } from "../../../shared/UserProfileIface";
import { TextIface } from "../../../shared/TextIface";

import SocketContext from "./SocketContext";
import { SocketIface } from "./SocketIface";
import { RoomMembersIface } from "./RoomMembersIface";

const SocketProvider: FC = ({ children }) => {
  const [socket, setSocket] = useState<typeof Socket>(null);
  const [roomId, setRoomId] = useState<string>(null);
  const myProfile = useContext(UserProfileContext);
  const [roomMembers, setRoomMembers] = useState<RoomMembersIface>(null);
  const [textLogs, setTextLogs] = useState<TextIface[]>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    console.log("[mounted]");

    // connect to Socket.io server
    const s = SocketIO();
    setSocket(s);

    // initialize state
    setRoomMembers({});
    setTextLogs([]);

    return () => {
      console.log("[unmounted]");
      if (socket && socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket || !myProfile) return;

    /**
     * connection lost
     */
    function disconnect() {
      console.log("[received] disconnect");
      setSocket(null);

      socket.once("reconnect", () => {
        console.log("[reconnected]");
        setSocket(socket);
        setRoomMembers({});
        join(roomId);
      });
    }

    /**
     * somebody joined this session and said hello
     * @param profile
     * @param socketId
     */
    function hello(profile: UserProfileIface, socketId: string) {
      console.log("[received] hello", profile, "from", socketId);
      const cs = Object.assign({}, roomMembers);
      cs[socketId] = {
        profile,
      };
      setRoomMembers(cs);
      socket.emit("hello-ack", roomId, myProfile);
    }

    /**
     * somebody responded to my greeting
     * @param profile somebody
     * @param socketId somebody's socket id
     */
    function helloAck(profile: UserProfileIface, socketId: string) {
      console.log("[received] hello-ack", profile, "from", socketId);
      const cs = Object.assign({}, roomMembers);
      cs[socketId] = {
        profile,
      };
      setRoomMembers(cs);
    }

    /**
     * somebody is leaving this session
     * @param socketId somebody's socket id
     */
    function bye(socketId: string) {
      console.log(
        "[received] bye from",
        socketId,
        "exists?",
        !!roomMembers[socketId]
      );
      if (roomMembers[socketId]) {
        const cs = Object.assign({}, roomMembers);
        delete cs[socketId];
        setRoomMembers(cs);
      }
    }

    socket.on("disconnect", disconnect);
    socket.on("hello", hello);
    socket.on("hello-ack", helloAck);
    socket.on("bye", bye);

    return () => {
      socket.off("hello", hello);
      socket.off("hello-ack", helloAck);
      socket.off("bye", bye);
    };
  }, [socket, myProfile, roomId, roomMembers]);

  useEffect(() => {
    if (!socket) return;

    function text(data: TextIface) {
      const logs = textLogs.slice();
      logs.push(data);
      setTextLogs(logs);
    }

    socket.on("text", text);

    return () => {
      socket.off("text", text);
    };
  }, [socket, roomId, textLogs]);

  const join = useCallback(
    (roomId: string) => {
      if (!roomId || !myProfile) {
        return;
      }
      setRoomId(roomId);
      setTextLogs([]);
      socket.emit("hello", roomId, myProfile);
      console.log("[sent] hello in", roomId);
    },
    [myProfile, socket]
  );

  const leave = useCallback(() => {
    if (socket && roomId) {
      socket.emit("bye", roomId);
      console.log("[sent] bye in", roomId);
    }
    setRoomMembers({});
    setRoomId(null);
    setTextLogs([]);
  }, [socket, roomId]);

  const text = useCallback(
    (message: string) => {
      if (!socket || !roomId) {
        return;
      }
      socket.emit("text", roomId, message);
    },
    [socket, roomId]
  );

  const data: SocketIface = Object.freeze({
    roomId,
    socket,
    roomMembers,
    textLogs,
    join,
    leave,
    text,
  });

  return (
    <SocketContext.Provider value={data}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
