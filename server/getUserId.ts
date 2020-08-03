export function getUserId(userName: string) {
  const res = /^user:(.+)$/.exec(userName);
  return res ? res[1] : null;
}
