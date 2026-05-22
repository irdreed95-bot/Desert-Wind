/** Returns true if the src string is a video (base64 data URI or file extension). */
export function isVideo(src: string): boolean {
  if (!src) return false;
  if (src.startsWith('data:video/')) return true;
  return /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(src);
}
