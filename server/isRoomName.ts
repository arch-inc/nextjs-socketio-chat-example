export function isRoomName(roomName: string) {
  return /^room:.+$/.test(roomName);
}
