import { put } from '@vercel/blob';

export async function uploadImage(file: File, folder: 'charutos' | 'anilhas'): Promise<string> {
  try {
    const filename = `${folder}/${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: 'public',
    });
    
    return blob.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export function getImageUrl(filename: string): string {
  // Se já for uma URL completa, retorna como está
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // Caso contrário, assume que é um filename do Vercel Blob
  return filename;
}

