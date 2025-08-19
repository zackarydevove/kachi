export function avatarFallbackUtil(name: string | undefined) {
  if (!name) return "U";
  if (name.length >= 2) {
    return name.substring(0, 2).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}
