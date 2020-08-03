export function isUserName(roomName: string) {
  return /^user:.+$/.test(roomName);
}
