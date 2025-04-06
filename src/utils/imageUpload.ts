
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Faz upload de uma imagem para o armazenamento do Supabase
 * @param file O arquivo para fazer upload
 * @param path O caminho no bucket (ex: 'categoria/imagem.png')
 * @param bucket O bucket para fazer upload
 * @returns A URL pública da imagem carregada
 */
export async function uploadImage(
  file: File,
  path: string,
  bucket: 'course_images' | 'category_images' | 'avatars' | 'site_images'
): Promise<string | undefined> {
  try {
    // Upload do arquivo
    const { error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error('Erro ao fazer upload da imagem:', uploadError);
      toast.error('Erro ao fazer upload da imagem');
      return undefined;
    }
    
    // Obter a URL pública
    const { data } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(path);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Erro em uploadImage:', error);
    toast.error('Erro ao processar imagem');
    return undefined;
  }
}
