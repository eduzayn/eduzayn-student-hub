
import { toast } from "sonner";

// API key from Freepik
const FREEPIK_API_KEY = "FPSXb884c633f1134d11bdf8ee0f98bedfa0";

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
 * Searches for images on Freepik based on a query
 * @param query The search term
 * @param limit Maximum number of images to return (default: 1)
 * @returns An array of image URLs or empty array if failed
 */
export async function searchFreepikImages(query: string, limit: number = 1): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.freepik.com/v1/resources/search?locale=en-US&page=1&limit=${limit}&order=priority&term=${encodeURIComponent(query)}&type=photo`,
      {
        headers: {
          'Accept-Language': 'en-US',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Freepik-API-Key': FREEPIK_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json() as FreepikResponse;
    
    if (!data?.data?.mosaic?.results || !data.data.mosaic.results.length) {
      return [`/placeholder.svg`];
    }
    
    return data.data.mosaic.results.map(image => image.preview || image.url);
  } catch (error) {
    console.error("Error fetching images from Freepik:", error);
    toast.error("Não foi possível carregar imagens do Freepik");
    return [`/placeholder.svg`];
  }
}

/**
 * Gets a single image URL from Freepik based on a query
 * @param query The search term
 * @returns A single image URL or placeholder if failed
 */
export async function getFreepikImage(query: string): Promise<string> {
  const images = await searchFreepikImages(query, 1);
  return images[0] || '/placeholder.svg';
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
  
  const imageUrl = await getFreepikImage(query);
  imageCache[query] = imageUrl;
  return imageUrl;
}
