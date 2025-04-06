
// Este arquivo agora funciona como um wrapper para manter compatibilidade com o código existente
// Importando e re-exportando todas as funções e constantes dos novos módulos

import {
  CONTEXT_IMAGES,
  PLACEHOLDER_IMAGES,
  imageCache,
  getContextImage,
  searchFreepikImages,
  getFreepikImage,
  getCachedFreepikImage,
  setManualCourseImage,
  setContextImage,
  getAllContextImages,
  getAllCachedImages,
  uploadImage
} from './imageUtils';

// Re-exportando tudo para manter a compatibilidade com o código existente
export {
  CONTEXT_IMAGES,
  PLACEHOLDER_IMAGES,
  imageCache,
  getContextImage,
  searchFreepikImages,
  getFreepikImage,
  getCachedFreepikImage,
  setManualCourseImage,
  setContextImage,
  getAllContextImages,
  getAllCachedImages,
  uploadImage
};
