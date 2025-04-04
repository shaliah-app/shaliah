import { waitForValue } from "./waitForValue";

/**
 * Checks if a video element has audio.
 *
 * @param video - The HTMLVideoElement to check.
 * @returns True if the video has audio, false otherwise.
 */
export const checkVideoHasAudio = async (
  video: HTMLVideoElement
): Promise<boolean> => {
  // Check if the browser supports the AudioTrack API
  if (video.audioTracks && video.audioTracks.length > 0) {
    return true;
  }

  // Check if the browser supports mozHasAudio
  if (video.mozHasAudio !== undefined) {
    return video.mozHasAudio;
  }

  // Fallback to webkitAudioDecodedByteCount, handling potential undefined
  const webkitAudioDecodedByteCount = await waitForValue(
    () => video.webkitAudioDecodedByteCount,
    (value) => value !== undefined && value > 0
  );

  return Boolean(webkitAudioDecodedByteCount);
};
