import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause, Circle } from 'lucide-react';
import { trackApartmentView } from '@/utils/analytics';

interface SlideshowItem {
  title: string;
  img: string;
  text: string;
  link: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TrikalaSlideshowProps {
  items: SlideshowItem[];
  autoPlay?: boolean;
  interval?: number;
}

const TrikalaSlideshow: React.FC<TrikalaSlideshowProps> = ({ 
  items, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, items.length]);

  // Handle slide transitions
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentSlide, isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % items.length);
  }, [currentSlide, items.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide === 0 ? items.length - 1 : currentSlide - 1);
  }, [currentSlide, items.length, goToSlide]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [prevSlide, nextSlide, togglePlayPause]);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Slideshow Container */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5">
        {/* Slides */}
        <div className="relative h-[600px] md:h-[700px]">
          {items.map((item, index) => (
            <div
              key={item.title}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading={index === currentSlide ? 'eager' : 'lazy'}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-end">
                <div className="w-full p-8 md:p-12 text-white">
                  <div className="max-w-2xl">
                    {/* Icon */}
                    {item.icon && (
                      <div className="mb-4">
                        <item.icon className="h-12 w-12 text-accent" />
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="font-serif text-4xl md:text-6xl font-bold mb-4 leading-tight">
                      {item.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                      {item.text}
                    </p>
                    
                    {/* CTA Button */}
                    <Button
                      asChild
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                      onClick={() => trackApartmentView(item.title)}
                    >
                      <Link to={item.link}>
                        Discover {item.title}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-accent scale-125'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Arrow Navigation */}
        <Button
          variant="ghost"
          size="lg"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-accent transition-all duration-300 ease-linear"
            style={{
              width: isPlaying ? `${((currentSlide + 1) / items.length) * 100}%` : '0%'
            }}
          />
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-6 flex justify-center">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((item, index) => (
            <button
              key={item.title}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 relative group transition-all duration-300 ${
                index === currentSlide ? 'ring-2 ring-accent' : 'hover:ring-2 hover:ring-accent/50'
              }`}
            >
              <div className="w-20 h-16 md:w-24 md:h-18 rounded-lg overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  index === currentSlide ? 'bg-accent/30' : 'bg-black/20 group-hover:bg-black/10'
                }`} />
              </div>
              <div className="absolute bottom-1 left-1 right-1">
                <p className="text-xs text-white font-medium truncate text-center drop-shadow-lg">
                  {item.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Use arrow keys to navigate • Space to play/pause</p>
      </div>
    </div>
  );
};

export default TrikalaSlideshow;


