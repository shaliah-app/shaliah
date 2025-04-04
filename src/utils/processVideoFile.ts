import { checkVideoHasAudio } from "~/utils/videoHasAudio";
import type { VideoFileRecord } from "~/types/FileRecord";
/**
 * Processes a video file by creating a temporary video element,
 * waiting for metadata to load, then checking if it has audio.
 */
export async function processVideoFile(
  file: File
): Promise<Partial<VideoFileRecord["meta"]>> {
  return new Promise<Partial<VideoFileRecord["meta"]>>((resolve, reject) => {
    const video = document.createElement("video");

    video.preload = "auto";
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.style.position = "absolute";
    video.style.left = "-9999px"; // Hide the element offscreen
    document.body.appendChild(video);

    const cleanup = () => {
      URL.revokeObjectURL(video.src);
      document.body.removeChild(video);
    };

    video.addEventListener("canplay", async () => {
      try {
        const hasAudio: boolean = await checkVideoHasAudio(video);
        cleanup();
        resolve({
          hasAudio,
        });
      } catch (error) {
        cleanup();
        reject(error);
      }
    });

    video.addEventListener("error", (error) => {
      cleanup();
      reject(error);
    });
  });
}
