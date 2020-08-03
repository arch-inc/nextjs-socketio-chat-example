import { ServerResponse } from "http";
export function emitJSON(res: ServerResponse, json: any) {
  const str = JSON.stringify(json);
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": str.length,
  });
  res.end(str);
}
