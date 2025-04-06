
// Este arquivo funciona como um ponto de entrada para todas as utilidades de imagem
// Reexportando todas as funções necessárias dos módulos individuais

export { 
  CONTEXT_IMAGES, 
  PLACEHOLDER_IMAGES,
  imageCache
} from './imageMapping';

export {
  getContextImage,
  searchFreepikImages,
  getFreepikImage,
  getCachedFreepikImage,
  setManualCourseImage,
  setContextImage,
  getAllContextImages,
  getAllCachedImages
} from './imageSearch';

export {
  uploadImage
} from './imageUpload';
