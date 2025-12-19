import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import heroImage1 from "@/assets/hero-blockchain.png";
import heroImage2 from "@/assets/hero-crypto-network.png";
import heroImage3 from "@/assets/hero-wallet.png";
import heroImage4 from "@/assets/hero-smart-contract.png";

const heroSlides = [
  { image: heroImage1, alt: "Blockchain Technology" },
  { image: heroImage2, alt: "Crypto Network" },
  { image: heroImage3, alt: "Digital Wallet" },
  { image: heroImage4, alt: "Smart Contracts" },
];

const HeroSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className="relative min-h-screen gradient-hero flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container px-4 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up">
          Blockchain<br />
          <span className="text-primary">Charity Foundation</span>
        </h1>
        
        <p className="text-gold-light text-lg md:text-xl font-medium tracking-wider uppercase mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          The Ethereum<br />Foundation's Vision
        </p>
        
        {/* Carousel */}
        <div className="relative w-full max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 px-4"
                >
                  <img 
                    src={slide.image} 
                    alt={slide.alt} 
                    className="w-full h-auto rounded-lg glow-gold transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Carousel dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button 
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'bg-primary scale-125' 
                : 'bg-muted hover:bg-muted-foreground'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
