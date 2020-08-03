import { useContext, useMemo } from "react";

import UserProfileContext from "../profile/UserProfileContext";
import SocketContext from "./SocketContext";

interface RoomStateIface {
  /**
   * true if connected but joined
   */
  readonly joinable: boolean;

  /**
   * true if joined
   */
  readonly joined: boolean;
}

export function useRoomState(): RoomStateIface {
  const profile = useContext(UserProfileContext);
  const socket = useContext(SocketContext);

  const joinable = useMemo(
    () =>
      /* connected */ socket &&
      /* profile set */ profile &&
      /* not yet joined to any room */ !socket.roomId &&
      /* user name set */ profile.name &&
      /* user name non-empty string */ profile.name.length > 0,
    [socket, profile]
  );

  const joined = useMemo(() => !!socket?.roomId, [socket]);

  return { joined, joinable };
}
