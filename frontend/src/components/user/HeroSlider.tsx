"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const heroSlides = [
  { id: 1, image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3, image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 4, image: "/images/electronics_sale.png" },
  { id: 5, image: "/images/fashion_sale.png" },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        // If we are at the end, jump back to start
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
          setCurrentSlide(0);
        } else {
          // Scroll forward by one card width approximately
          const cardWidth = container.clientWidth * 0.45;
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Update active dot on manual scroll
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;

      if (maxScroll > 0) {
        const slideIndex = Math.round((scrollLeft / maxScroll) * (heroSlides.length - 1));
        setCurrentSlide(Math.min(slideIndex, heroSlides.length - 1));
      }
    }
  };

  const scrollToSlide = (idx: number) => {
    setCurrentSlide(idx);
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const targetScroll = (idx / (heroSlides.length - 1)) * maxScroll;
      scrollRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <section className="py-6 md:py-8 bg-white overflow-hidden">
      <div className="container-custom">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory"
        >
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="relative shrink-0 snap-center w-[85%] md:w-[45%] lg:w-[32%] h-[160px] sm:h-[200px] md:h-[240px] rounded-2xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100"
            >
              <Image
                src={slide.image}
                alt={`Promotional Offer ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 32vw"
                priority={idx < 2}
              />
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <div className="flex justify-center gap-1.5 mt-5">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              className={cn(
                "h-[6px] rounded-full transition-all duration-300",
                currentSlide === idx ? "w-6 bg-gray-600" : "w-1.5 bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
