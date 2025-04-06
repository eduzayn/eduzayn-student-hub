
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Array of placeholder images to use when API fails
const PLACEHOLDER_IMAGES = [
  "/placeholder.svg",
  "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png",
  "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
  "/lovable-uploads/ccac1e61-2311-44b6-b9a5-1aedbfb2a20b.png" // Added the new image
];

/**
 * Returns a random placeholder image from the available options
 * @returns A placeholder image URL
 */
function getRandomPlaceholder(): string {
  const index = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
  return PLACEHOLDER_IMAGES[index];
}

/**
 * Gets an image from Supabase storage bucket based on category
 * @param category The category to get image for
 * @param bucket The storage bucket to search in ('category_images' or 'course_images')
 * @returns A promise resolving to an image URL or undefined if not found
 */
async function getSupabaseImage(category: string, bucket: 'category_images' | 'course_images' | 'avatars'): Promise<string | undefined> {
  try {
    const formattedCategory = category.toLowerCase().replace(/\s+/g, '-');
    
    // Just return a placeholder image for now since buckets are empty
    return getRandomPlaceholder();
    
    // This code is commented out until there are actual images in the buckets
    /*
    const { data: files, error } = await supabase
      .storage
      .from(bucket)
      .list(formattedCategory);
      
    if (error || !files?.length) {
      console.warn(`No images found in ${bucket}/${formattedCategory}`);
      return undefined;
    }
    
    // Pick a random image if multiple are available
    const randomIndex = Math.floor(Math.random() * files.length);
    const selectedFile = files[randomIndex];
    
    // Get the public URL for the file
    const { data: publicURL } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(`${formattedCategory}/${selectedFile.name}`);
      
    return publicURL.publicUrl;
    */
  } catch (err) {
    console.error(`Error getting image from Supabase ${bucket}:`, err);
    return undefined;
  }
}

/**
 * Searches for images based on a query
 * @param query The search term
 * @param limit Maximum number of images to return (default: 1)
 * @returns An array of image URLs or placeholders if failed
 */
export async function searchFreepikImages(query: string, limit: number = 1): Promise<string[]> {
  // For now, we'll just return placeholder images
  return Array(limit).fill('').map(() => getRandomPlaceholder());
}

/**
 * Gets a single image URL based on a query
 * @param query The search term
 * @returns A single image URL or placeholder if failed
 */
export async function getFreepikImage(query: string): Promise<string> {
  return getRandomPlaceholder();
}

// Cache mechanism to store already fetched images by category
const imageCache: Record<string, string> = {};

/**
 * Gets an image URL with caching
 * @param query The search term
 * @returns A promise resolving to an image URL
 */
export async function getCachedFreepikImage(query: string): Promise<string> {
  if (imageCache[query]) {
    return imageCache[query];
  }
  
  // Return a placeholder immediately
  const placeholder = getRandomPlaceholder();
  imageCache[query] = placeholder;
  
  return placeholder;
}

/**
 * Uploads an image to Supabase storage
 * @param file The file to upload
 * @param path The path in the bucket (e.g., 'category-name/image.png')
 * @param bucket The bucket to upload to
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  path: string,
  bucket: 'course_images' | 'category_images' | 'avatars'
): Promise<string | undefined> {
  try {
    // Upload the file
    const { error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast.error('Erro ao fazer upload da imagem');
      return undefined;
    }
    
    // Get the public URL
    const { data } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(path);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    toast.error('Erro ao processar imagem');
    return undefined;
  }
}
