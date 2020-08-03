export function getRoomId(roomName: string) {
  const res = /^room:(.+)$/.exec(roomName);
  return res ? res[1] : null;
}
