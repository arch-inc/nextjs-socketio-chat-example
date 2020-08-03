import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import Link from "next/link";

import { Refreshable } from "../Refreshable";

export const Rooms = forwardRef<Refreshable>((_, ref) => {
  const [rooms, setRooms] = useState<string[]>(null);

  const refresh = useCallback(() => {
    setRooms(null);
    fetch("/api/rooms")
      .then((res) => res.json())
      .then(setRooms);
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  useImperativeHandle(ref, () => ({ refresh }), [refresh]);

  return (
    <ul>
      {rooms ? (
        rooms.length > 0 ? (
          rooms.map((room, i) => (
            <li key={i}>
              <Link href={`/rooms/${room}`}>
                <a>{room}</a>
              </Link>
            </li>
          ))
        ) : (
          <li>not found</li>
        )
      ) : (
        <li>loading ...</li>
      )}
    </ul>
  );
});
