import { FC } from "react";

import { useRoomState } from "../contexts/socket/useRoomState";

import { JoinRoomForm } from "./JoinRoomForm";
import { RoomMembersList } from "./RoomMembersList";
import { TextLogs } from "./TextLogs";
import { SendTextForm } from "./SendTextForm";

interface IProps {
  roomId: string;
}

export const Body: FC<IProps> = ({ roomId }) => {
  const { joined } = useRoomState();
  return (
    <div>
      <JoinRoomForm roomId={roomId} />
      {joined && (
        <>
          <RoomMembersList />
          <TextLogs />
          <SendTextForm />
        </>
      )}
    </div>
  );
};
