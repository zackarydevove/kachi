const AVATAR_S3_BUCKET_URL = process.env.NEXT_PUBLIC_AVATAR_S3_BUCKET_URL || "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export function getAvatarUrl(
  avatar: string | null | undefined,
): string | undefined {
  if (!avatar) {
    return undefined;
  }

  // If it's already a full URL (http/https), return as-is (for Google OAuth avatars)
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }

  // In production, prepend AVATAR_S3_BUCKET_URL to the key
  if (IS_PRODUCTION && AVATAR_S3_BUCKET_URL) {
    // If avatar already starts with /, don't add another one
    const separator = avatar.startsWith("/") ? "" : "/";
    return `${AVATAR_S3_BUCKET_URL}${separator}${avatar}`;
  }

  // In development, return as-is
  return avatar;
}
