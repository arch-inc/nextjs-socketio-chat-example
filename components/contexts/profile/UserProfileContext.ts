import { createContext } from "react";

import { UserProfileIface } from "../../../shared/UserProfileIface";

const UserProfileContext = createContext<UserProfileIface>(null);

export default UserProfileContext;
