import { FC } from "react";
import { UserProfileIface } from "../../shared/UserProfileIface";

interface UserProps {
  data?: UserProfileIface;
}

export const User: FC<UserProps> = ({ data }) => {
  if (!data) {
    return <>-</>;
  }
  return (
    <>{`${data.name} (${data.ua.browser.name} v${data.ua.browser.major} on ${
      data.ua.os.name
    } ${data.ua.os.version || "(unknown version)"})`}</>
  );
};
