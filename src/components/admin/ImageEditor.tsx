
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadImage, setContextImage } from "@/utils/freepikAPI";

interface ImageEditorProps {
  contextKey: string;
  currentImageUrl?: string;
  onImageUpdate?: (newImageUrl: string) => void;
  associatedText?: string;
  onTextUpdate?: (newText: string) => void;
  title?: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  contextKey,
  currentImageUrl,
  onImageUpdate,
  associatedText,
  onTextUpdate,
  title = "Editor de Imagem"
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [text, setText] = useState(associatedText || "");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Preview local
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      toast.error("Selecione uma imagem para enviar");
      return;
    }

    try {
      setUploading(true);
      
      // Gerar nome de arquivo único baseado no contexto
      const fileName = `${contextKey.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${imageFile.name.split('.').pop()}`;
      const path = `${contextKey.toLowerCase().replace(/\s+/g, '-')}/${fileName}`;
      
      // Upload para o bucket apropriado
      const imageUrl = await uploadImage(
        imageFile, 
        path, 
        contextKey.includes("curso") ? "course_images" : "category_images"
      );
      
      if (imageUrl) {
        // Atualizar cache de imagens
        setContextImage(contextKey, imageUrl);
        
        if (onImageUpdate) {
          onImageUpdate(imageUrl);
        }
        
        toast.success("Imagem enviada com sucesso");
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Falha ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleTextUpdate = () => {
    if (onTextUpdate) {
      onTextUpdate(text);
      toast.success("Texto atualizado com sucesso");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Selecionar imagem</Label>
          <Input 
            id="image-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
          />
        </div>
        
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Preview:</p>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-md border"
            />
          </div>
        )}
        
        {associatedText !== undefined && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="text-edit">Texto associado</Label>
            <Textarea
              id="text-edit"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 justify-end">
        {associatedText !== undefined && (
          <Button 
            variant="outline" 
            onClick={handleTextUpdate}
          >
            Atualizar texto
          </Button>
        )}
        
        <Button 
          onClick={handleUpload} 
          disabled={!imageFile || uploading}
        >
          {uploading ? "Enviando..." : "Enviar imagem"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageEditor;
