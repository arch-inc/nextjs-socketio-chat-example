import { FC, useContext } from "react";

import SocketContext from "../contexts/socket/SocketContext";

export const TextLogs: FC = () => {
  const socket = useContext(SocketContext);
  return (
    <section>
      <h4>logs</h4>
      <ul>
        {Array.isArray(socket?.textLogs) && socket.textLogs.length > 0 ? (
          socket.textLogs.map((t, i) => (
            <li key={i}>
              {t.message} ({t.sender}, {t.time})
            </li>
          ))
        ) : (
          <li>no text logs found</li>
        )}
      </ul>
    </section>
  );
};
