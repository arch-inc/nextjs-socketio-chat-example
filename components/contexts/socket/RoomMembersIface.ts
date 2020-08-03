import { SocketUserIface } from "./SocketUserIface";

export interface RoomMembersIface {
  [socketId: string]: SocketUserIface;
}
