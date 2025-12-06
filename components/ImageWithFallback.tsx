import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className, fallbackText }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attempt, setAttempt] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Reset state if src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setAttempt(0);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    const cleanSrc = src.replace(/^\/+/, '').replace(/^.\//, ''); // Remove leading slash or ./
    
    // Define the sequence of paths to try if the first one fails
    // 1. Original (e.g. "images/foo.jpg")
    // 2. Absolute (e.g. "/images/foo.jpg")
    // 3. Src relative (e.g. "/src/images/foo.jpg" - common in some setups)
    // 4. Public relative (e.g. "/public/images/foo.jpg")
    
    if (attempt === 0) {
      setCurrentSrc(`/${cleanSrc}`);
    } else if (attempt === 1) {
      setCurrentSrc(`/src/${cleanSrc}`);
    } else if (attempt === 2) {
      setCurrentSrc(`/public/${cleanSrc}`);
    } else {
      setHasError(true);
    }
    setAttempt(prev => prev + 1);
  };

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-stone-200 text-stone-500 p-2 ${className}`}>
        {fallbackText ? (
           <img 
            src={`https://placehold.co/600x400/d6d3d1/57534e?text=${encodeURIComponent(fallbackText)}`} 
            alt={alt}
            className="w-full h-full object-cover"
           />
        ) : (
           <ImageOff size={24} className="opacity-40" />
        )}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;