import { FC, useState, useEffect, useMemo } from "react";

import { UserProfileIface } from "../../../shared/UserProfileIface";
import UserProfileContext from "./UserProfileContext";

export const UserProfileProvider: FC = ({ children }) => {
  const [ua, setUa] = useState<IUAParser.IResult>(null);
  const [name, setName] = useState<string>(null);

  // fetch user agent and set "ua"
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let mounted = true;
    fetch("/api/ua").then(async (res) => {
      if (!mounted || res.status !== 200) {
        return;
      }
      setUa(await res.json());
    });
    return () => (mounted = false);
  }, []);

  const data: UserProfileIface = useMemo(
    () => ({
      ua,
      get name() {
        return name;
      },
      /** allow setting name from child components */
      set name(val) {
        setName(val);
      },
    }),
    [ua, name]
  );

  return (
    <UserProfileContext.Provider value={data}>
      {children}
    </UserProfileContext.Provider>
  );
};
