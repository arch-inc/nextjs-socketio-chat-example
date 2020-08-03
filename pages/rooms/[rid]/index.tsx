import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserProfileProvider } from "../../../components/contexts/profile/UserProfileProvider";
import SocketProvider from "../../../components/contexts/socket/SocketProvider";
import { Body } from "../../../components/rooms/Body";

const page: NextPage = () => {
  const [roomId, setRoomId] = useState<string>(null);
  const router = useRouter();

  useEffect(() => {
    setRoomId(router.query.rid as string);
  }, [router.query]);

  return (
    <UserProfileProvider>
      <SocketProvider>
        <Body roomId={roomId} />
      </SocketProvider>
    </UserProfileProvider>
  );
};

export default page;
