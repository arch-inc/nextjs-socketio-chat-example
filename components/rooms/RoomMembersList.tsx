import { FC, useContext } from "react";

import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";

export const RoomMembersList: FC = () => {
  const profile = useContext(UserProfileContext);
  const socket = useContext(SocketContext);
  return (
    <section>
      <h4>me</h4>
      <pre>{profile ? JSON.stringify(profile, null, "  ") : "-"}</pre>
      <h4>other members</h4>
      <pre>
        {socket?.roomMembers
          ? JSON.stringify(socket.roomMembers, null, "  ")
          : "-"}
      </pre>
    </section>
  );
};
