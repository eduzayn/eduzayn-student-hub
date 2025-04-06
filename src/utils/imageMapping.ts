// Mapeamento de imagens de contexto específico para diferentes categorias/tópicos
export const CONTEXT_IMAGES = {
  // Education categories
  // ... keep existing code (categorias gerais)
  
  // Course topics
  // ... keep existing code (tópicos de cursos)
  
  // Subject areas
  // ... keep existing code (áreas de conhecimento)
  
  // Course titles (adicionando correspondências específicas para títulos de cursos populares)
  // ... keep existing code (títulos de cursos populares)
  
  // Adicionando chaves específicas para elementos da interface
  // ... keep existing code (elementos da interface)
  
  // Cursos de educação especial
  // ... keep existing code (cursos de educação especial)
  
  // Adicionando cursos específicos de segunda licenciatura
  // ... keep existing code (segunda licenciatura)
  
  // Atualização - Termos para formação pedagógica
  // ... keep existing code (formação pedagógica)
  
  // Nova imagem para cursos de educação física
  // ... keep existing code (educação física)
  
  // Novos termos para administração com a nova imagem
  // ... keep existing code (administração)
  
  // Novos termos para cursos de direito - imagem 1
  "direito administrativo": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "direito civil": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "direito constitucional": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "direito do trabalho": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "direito educacional": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "direito eleitoral": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "direito empresarial": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "direito imobiliário": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "direito internacional": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "direito penal": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "direito previdenciário": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "direito processual": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "direito tributário": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "direito ambiental": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "direito digital": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "direito contratual": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "direito lgbt+": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "direito notarial": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "direito aduaneiro": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "direito público": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "direito": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "compliance": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "law": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "legal": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "jurídico": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "arbitragem": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "legislação": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "mediação": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  "perícia": "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "auditoria": "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png",
  
  // Generic fallback
  "default": "/lovable-uploads/359b596a-c889-4fda-9b37-6c5c76ea2f53.png"
};

// Imagens de fallback quando o contexto não é encontrado
export const PLACEHOLDER_IMAGES = [
  "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png",
  "/lovable-uploads/1bfc1ad9-bf1a-4193-bf15-92aab488ed41.png",
  "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  null,
  "/lovable-uploads/230842bd-1461-4f56-bebf-d69b4f691e7b.png",
  "/lovable-uploads/359b596a-c889-4fda-9b37-6c5c76ea2f53.png",
  "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png",
  "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png"
];

// Cache para armazenar imagens já buscadas por categoria
export const imageCache: Record<string, string> = {};
