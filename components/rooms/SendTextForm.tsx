import {
  FC,
  useContext,
  useCallback,
  ChangeEvent,
  useState,
  FormEvent,
} from "react";

import SocketContext from "../contexts/socket/SocketContext";

export const SendTextForm: FC = () => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState<string>("");

  /**
   * say something
   */
  const handleText = useCallback(() => {
    if (!socket || message.length <= 0) {
      return;
    }
    socket.text(message);
    setMessage("");
  }, [socket, message]);

  /**
   * handle form submission (call text)
   */
  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      handleText();
    },
    [handleText]
  );

  /**
   * update text field
   */
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setMessage(ev.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChange} value={message} />
      <button onClick={handleText}>say</button>
    </form>
  );
};
