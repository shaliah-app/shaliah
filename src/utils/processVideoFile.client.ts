import type { VideoMetadata } from "~/types/SlideModel";
import { checkVideoHasAudio } from "../client/utils";
/**
 * Processes a video by creating a temporary video element,
 * waiting for metadata to load, then checking if it has audio
 * and exports first frame as a poster.
 */
export async function processVideoFile(
  src: string,
  opts: {
    maxWidth?: number;
    maxHeight?: number;
    jpegQuality?: number; // 0 to 1
  } = {}
): Promise<Pick<VideoMetadata, "poster" | "hasAudio">> {
  const { maxWidth = 320, maxHeight = 180, jpegQuality = 1 } = opts;

  return new Promise<Pick<VideoMetadata, "poster" | "hasAudio">>(
    (resolve, reject) => {
      const video = document.createElement("video");

      video.preload = "auto";
      video.src = src;
      video.muted = true;
      video.playsInline = true;
      video.style.position = "absolute";
      video.style.left = "-9999px"; // Hide the element offscreen
      document.body.appendChild(video);

      const cleanup = () => {
        document.body.removeChild(video);
      };

      video.addEventListener("canplay", async () => {
        try {
          const hasAudio: boolean = await checkVideoHasAudio(video);

          // Compute target dimensions while preserving aspect ratio
          let { videoWidth: w, videoHeight: h } = video;
          const ratio = Math.min(maxWidth / w, maxHeight / h, 1);
          w = Math.floor(w * ratio);
          h = Math.floor(h * ratio);

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.drawImage(video, 0, 0, w, h);

          const poster = canvas.toDataURL("image/jpeg", jpegQuality);

          cleanup();
          resolve({
            hasAudio,
            poster,
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
    }
  );
}
