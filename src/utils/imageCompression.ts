// ========================================
// IMAGE COMPRESSION UTILITIES
// ========================================

/**
 * Compress image while maintaining quality for web display
 * @param file - Original image file
 * @param maxWidth - Maximum width for web display (default: 1200px)
 * @param quality - JPEG quality (0.8 = 80%, default: 0.8)
 * @returns Promise<Blob> - Compressed image blob
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image from file
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate image file before upload
 * @param file - File to validate
 * @returns Object with validation result
 */
export const validateImageFile = (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  const errors: string[] = [];

  // Check file size
  if (file.size > maxSize) {
    errors.push('File size must be less than 5MB');
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, GIF, and WebP images are allowed');
  }

  // Check dimensions (async validation)
  return {
    isValid: errors.length === 0,
    errors,
    maxSize,
    allowedTypes
  };
};

/**
 * Create compressed file with original metadata
 * @param originalFile - Original file
 * @param compressedBlob - Compressed blob
 * @returns File - Compressed file with metadata
 */
export const createCompressedFile = async (
  originalFile: File,
  compressedBlob: Blob
): Promise<File> => {
  return new Promise((resolve) => {
    compressedBlob.arrayBuffer().then((buffer) => {
      const compressedFile = new File(
        [buffer],
        `compressed_${originalFile.name}`,
        {
          type: 'image/jpeg',
          lastModified: Date.now()
        }
      );
      resolve(compressedFile);
    });
  });
};
