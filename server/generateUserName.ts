import { v4 as uuidv4 } from "uuid";
import { IncomingMessage } from "http";

export function generateUserName(_req: IncomingMessage) {
  return `user:${uuidv4()}`;
}
