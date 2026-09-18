import { rgbToHex } from './colorUtils';

/**
 * Extracts dominant vibrant colors from an image file
 */
export async function extractColorsFromImage(file: File, count: number = 5): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }

          // Downscale image for fast processing and noise reduction
          const maxDim = 120;
          const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
          canvas.width = Math.max(10, Math.floor(img.width * scale));
          canvas.height = Math.max(10, Math.floor(img.height * scale));

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

          // Color bucket map (quantization by 24 units)
          const bucketMap: { [key: string]: { r: number; g: number; b: number; count: number } } = {};
          const step = 4; // Sample every 4th pixel for speed

          for (let i = 0; i < imageData.length; i += 4 * step) {
            const a = imageData[i + 3];
            if (a < 128) continue; // Skip transparent

            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];

            // Quantize
            const q = 24;
            const qr = Math.floor(r / q) * q;
            const qg = Math.floor(g / q) * q;
            const qb = Math.floor(b / q) * q;
            const key = `${qr},${qg},${qb}`;

            if (!bucketMap[key]) {
              bucketMap[key] = { r, g, b, count: 0 };
            }
            bucketMap[key].count++;
          }

          // Sort by frequency
          const sortedBuckets = Object.values(bucketMap).sort((a, b) => b.count - a.count);

          const selectedColors: string[] = [];

          // Color distance helper
          const colorDist = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
            return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
          };

          for (const bucket of sortedBuckets) {
            const hex = rgbToHex({ r: bucket.r, g: bucket.g, b: bucket.b });

            // Check if too similar to any already selected color
            const isDistinct = selectedColors.every((selectedHex) => {
              const r2 = parseInt(selectedHex.slice(1, 3), 16);
              const g2 = parseInt(selectedHex.slice(3, 5), 16);
              const b2 = parseInt(selectedHex.slice(5, 7), 16);
              return colorDist(bucket.r, bucket.g, bucket.b, r2, g2, b2) > 55;
            });

            if (isDistinct) {
              selectedColors.push(hex);
              if (selectedColors.length >= count) break;
            }
          }

          // Fallbacks if image didn't have enough distinct colors
          const fallbacks = ['#2563EB', '#60A5FA', '#DBEAFE', '#F8FAFC', '#0F172A'];
          while (selectedColors.length < count) {
            selectedColors.push(fallbacks[selectedColors.length % fallbacks.length]);
          }

          resolve(selectedColors);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
