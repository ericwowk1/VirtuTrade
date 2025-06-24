import fs from 'fs';
import path from 'path';

export async function getCachedLogo(ticker: string): Promise<string | null> {
  const publicDir = path.join(process.cwd(), 'public');
  
  // Check if logo already exists (try common extensions)
  const extensions = ['.png', '.jpg', '.jpeg', '.svg'];
  for (const ext of extensions) {
    const logoPath = path.join(publicDir, `${ticker}${ext}`);
    if (fs.existsSync(logoPath)) {
      return `/${ticker}${ext}`; // Return public URL path
    }
  }
  
  return null; // Not cached
}

export async function cacheLogo(ticker: string, logoUrl: string): Promise<string | null> {
  try {
    const response = await fetch(logoUrl);
    if (!response.ok) return null;
    
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type');
    
    // Determine file extension from content type
    let extension = '.png';
    if (contentType?.includes('jpeg') || contentType?.includes('jpg')) {
      extension = '.jpg';
    } else if (contentType?.includes('svg')) {
      extension = '.svg';
    }
    
    const publicDir = path.join(process.cwd(), 'public');
    const logoPath = path.join(publicDir, `${ticker}${extension}`);
    
    // Save the file
    fs.writeFileSync(logoPath, Buffer.from(buffer));
    
    return `/${ticker}${extension}`; // Return public URL path
  } catch (error) {
    console.error(`Error caching logo for ${ticker}:`, error);
    return null;
  }
}