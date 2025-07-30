// Sistema de armazenamento de arquivos para imagens
// Em produção, isso seria substituído por um serviço como AWS S3, Cloudinary, etc.

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Garantir que o diretório de uploads existe
export const ensureUploadDir = async () => {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
};

// Salvar arquivo de imagem
export const saveImage = async (file: File, filename: string): Promise<string> => {
  await ensureUploadDir();
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const filepath = path.join(UPLOAD_DIR, filename);
  await writeFile(filepath, buffer);
  
  // Retorna o caminho público
  return `/uploads/${filename}`;
};

// Gerar nome único para arquivo
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  
  return `${baseName}_${timestamp}_${random}${extension}`;
};

