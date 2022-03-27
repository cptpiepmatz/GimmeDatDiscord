/** Size parameter for the discord media proxy. */
export const avatarSize = "?size=4096";

/**
 * Function to prepare an object including the avatars in different file formats.
 * @param avatarUrl Url of the url to construct object with
 */
export default function prepareAvatars(avatarUrl: string) {
  let avatars: Record<string, string> = {};
  if (avatarUrl.endsWith(".webp")) {
    avatars["webp"] = avatarUrl + avatarSize;
    avatars["png"] = avatarUrl.replace(".webp", ".png") + avatarSize;
  }
  if (avatarUrl.endsWith(".png")) {
    avatars["png"] = avatarUrl + avatarSize;
  }
  if (avatarUrl.endsWith(".gif")) {
    avatars["gif"] = avatarUrl + avatarSize;
    avatars["png"] = avatarUrl.replace(".gif", ".png") + avatarSize;
  }
  return avatars;
}
