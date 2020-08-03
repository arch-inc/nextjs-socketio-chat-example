import { createContext } from "react";

import { SocketIface } from "./SocketIface";

const SocketContext = createContext<SocketIface>(null);

export default SocketContext;
