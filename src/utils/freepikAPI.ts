import { toast } from "sonner";

// API key from Freepik
const FREEPIK_API_KEY = "FPSXb884c633f1134d11bdf8ee0f98bedfa0";

// Array of placeholder images to use when API fails
const PLACEHOLDER_IMAGES = [
  "/placeholder.svg",
  "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png",
  "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png"
];

interface FreepikImage {
  id: string;
  url: string;
  width: number;
  height: number;
  type: string;
  preview: string;
}

interface FreepikResponse {
  data: {
    mosaic: {
      results: FreepikImage[];
    };
  };
}

/**
 * Returns a random placeholder image from the available options
 * @returns A placeholder image URL
 */
function getRandomPlaceholder(): string {
  const index = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
  return PLACEHOLDER_IMAGES[index];
}

/**
 * Searches for images on Freepik based on a query
 * @param query The search term
 * @param limit Maximum number of images to return (default: 1)
 * @returns An array of image URLs or placeholders if failed
 */
export async function searchFreepikImages(query: string, limit: number = 1): Promise<string[]> {
  try {
    // Create an AbortController to handle timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(
      `https://api.freepik.com/v1/resources/search?locale=en-US&page=1&limit=${limit}&order=priority&term=${encodeURIComponent(query)}&type=photo`,
      {
        headers: {
          'Accept-Language': 'en-US',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Freepik-API-Key': FREEPIK_API_KEY
        },
        signal: controller.signal,
        // Add mode 'cors' explicitly
        mode: 'cors'
      }
    ).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      console.warn(`Freepik API response not OK: ${response.status} ${response.statusText}`);
      return Array(limit).fill('').map(() => getRandomPlaceholder());
    }

    const data = await response.json() as FreepikResponse;
    
    if (!data?.data?.mosaic?.results || !data.data.mosaic.results.length) {
      console.warn('No images found in Freepik response');
      return Array(limit).fill('').map(() => getRandomPlaceholder());
    }
    
    return data.data.mosaic.results.map(image => image.preview || image.url);
  } catch (error) {
    console.error("Error fetching images from Freepik:", error);
    // Don't show toast to avoid spamming the user when many images fail
    // toast.error("Não foi possível carregar imagens externas");
    return Array(limit).fill('').map(() => getRandomPlaceholder());
  }
}

/**
 * Gets a single image URL from Freepik based on a query
 * @param query The search term
 * @returns A single image URL or placeholder if failed
 */
export async function getFreepikImage(query: string): Promise<string> {
  const images = await searchFreepikImages(query, 1);
  return images[0] || getRandomPlaceholder();
}

// Cache mechanism to store already fetched images by category
const imageCache: Record<string, string> = {};

/**
 * Gets an image URL from Freepik with caching
 * @param query The search term
 * @returns A promise resolving to an image URL
 */
export async function getCachedFreepikImage(query: string): Promise<string> {
  if (imageCache[query]) {
    return imageCache[query];
  }
  
  // Return a placeholder immediately and try to fetch in the background
  const placeholder = getRandomPlaceholder();
  imageCache[query] = placeholder;
  
  // Try to fetch the actual image in the background
  getFreepikImage(query).then(imageUrl => {
    if (imageUrl !== placeholder) {
      imageCache[query] = imageUrl;
    }
  }).catch(() => {
    // Keep using the placeholder if fetch fails
  });
  
  return placeholder;
}
