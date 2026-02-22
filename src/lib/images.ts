import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

/**
 * Downloads an image from a remote URL and saves it locally under public/.
 *
 * @param url      - Remote image URL (e.g. YouTube CDN)
 * @param localPath - Relative path like "images/thumbnails/{videoId}.jpg"
 * @returns The local path for use in <Image src> (e.g. "/images/thumbnails/xyz.jpg"),
 *          or null if the download fails (caller should fall back to the remote URL).
 */
export async function downloadImage(
  url: string,
  localPath: string
): Promise<string | null> {
  try {
    const fullPath = join(process.cwd(), "public", localPath);

    // Skip download if the file already exists locally (cache)
    if (existsSync(fullPath)) {
      return `/${localPath}`;
    }

    // Ensure the directory exists
    const dir = dirname(fullPath);
    mkdirSync(dir, { recursive: true });

    // Download the image
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Failed to download image from ${url}: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    writeFileSync(fullPath, buffer);

    return `/${localPath}`;
  } catch (err) {
    console.error(`Error downloading image from ${url}:`, err);
    return null;
  }
}
