import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface StrategyPhoto {
  id: string;
  url: string;
  order: number;
}

interface StrategyPhotoGalleryProps {
  photos?: StrategyPhoto[];
}

const StrategyPhotoGallery = ({ photos = [] }: StrategyPhotoGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!autoRotate || photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoRotate, photos.length]);

  const handlePrevious = () => {
    setAutoRotate(false);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    setAutoRotate(false);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goToSlide = (index: number) => {
    setAutoRotate(false);
    setCurrentIndex(index);
  };

  // If no photos, show placeholder
  if (!photos || photos.length === 0) {
    return (
      <div className="relative w-full">
        <div className="aspect-square relative">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-sm rotate-3" />
          <div className="absolute inset-4 border-2 border-primary/30 rounded-sm -rotate-2" />
          <div className="absolute inset-8 bg-primary/5 rounded-sm flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ImageIcon className="text-primary" size={32} strokeWidth={1.5} />
              </div>
              <p className="font-heading text-lg font-semibold text-foreground">Strategi Disesuaikan</p>
              <p className="text-muted-foreground text-sm mt-1">Untuk setiap klien</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Single photo - no carousel
  if (photos.length === 1) {
    return (
      <div className="relative w-full">
        <div className="aspect-square relative overflow-hidden rounded-sm">
          <img
            src={photos[0].url}
            alt="Strategy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  // Multiple photos - carousel
  return (
    <div className="relative w-full">
      <div className="aspect-square relative overflow-hidden rounded-sm group">
        {/* Carousel container */}
        <div className="relative w-full h-full">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95'
              }`}
            >
              <img
                src={photo.url}
                alt={`Strategy photo ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              onMouseEnter={() => setAutoRotate(false)}
              onMouseLeave={() => setAutoRotate(true)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              onMouseEnter={() => setAutoRotate(false)}
              onMouseLeave={() => setAutoRotate(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to photo ${index + 1}`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/40 text-white text-sm rounded-full">
              {currentIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StrategyPhotoGallery;
