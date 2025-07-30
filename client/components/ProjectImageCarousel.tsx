import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ProjectImageCarouselProps {
  images: string[];
  title: string;
  className?: string;
}

export default function ProjectImageCarousel({ images, title, className = "" }: ProjectImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Preload all images
  useEffect(() => {
    if (!images || images.length === 0) return;

    const loadStates = new Array(images.length).fill(false);
    setLoadedImages(loadStates);
    
    const preloadImages = async () => {
      const promises = images.map((src, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadStates[index] = true;
            setLoadedImages([...loadStates]);
            resolve();
          };
          img.onerror = () => {
            loadStates[index] = false;
            setLoadedImages([...loadStates]);
            resolve();
          };
          img.src = src;
        });
      });

      await Promise.all(promises);
      setAllImagesLoaded(true);
    };

    preloadImages();
  }, [images]);

  // Auto-slide effect when hovered and there are multiple images
  useEffect(() => {
    if (!isHovered || images.length <= 1 || !allImagesLoaded) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered, images.length, allImagesLoaded]);

  const goToPrevious = () => {
    if (!allImagesLoaded) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    if (!allImagesLoaded) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToIndex = (index: number) => {
    if (!allImagesLoaded) return;
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      className={`relative w-full h-48 rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Loading State */}
      {!allImagesLoaded && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading images...</span>
          </div>
        </div>
      )}

      {/* All Images - Stack them and show/hide with opacity */}
      {images.map((src, index) => (
        <img
          key={index}
          ref={(el) => imageRefs.current[index] = el}
          src={src}
          alt={`${title} - Image ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
            index === currentIndex && allImagesLoaded ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            display: loadedImages[index] === false ? 'none' : 'block'
          }}
        />
      ))}

      {/* Fallback for failed images */}
      {allImagesLoaded && loadedImages.every(loaded => !loaded) && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-2xl mb-2">🖼️</div>
            <span className="text-sm">Images failed to load</span>
          </div>
        </div>
      )}

      {/* Keep dots indicator for navigation - but make them less prominent */}
      {images.length > 1 && allImagesLoaded && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white/80'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Loading progress for multiple images */}
      {!allImagesLoaded && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            Loading {loadedImages.filter(Boolean).length}/{images.length}
          </div>
        </div>
      )}
    </div>
  );
}
