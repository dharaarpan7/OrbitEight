"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

/* Locked component — supplied in testimonial.md. Code, structure, styling,
   and interaction are integrated verbatim. Only the data array below is
   rebranded (approved: "Rebrand copy, keep code"): placeholder SaaS copy and
   pravatar.cc avatars are replaced with Orbit Eight community voices and
   local brand-styled avatars. */

const testimonials = [
  {
    tempId: 0,
    testimonial: "I joined for the astrophotography threads. I stayed because every week someone explains something I thought I already understood.",
    by: "Maya, astrophotographer",
    imgSrc: "/avatars/maya.jpeg"
  },
  {
    tempId: 1,
    testimonial: "The night sky stopped being wallpaper. Orbit Eight taught me how to read it.",
    by: "Daniel, amateur astronomer",
    imgSrc: "/avatars/daniel.jpeg"
  },
  {
    tempId: 2,
    testimonial: "Somewhere between a lecture and a letter from a friend who loves the same thing you do.",
    by: "Priya, physics teacher",
    imgSrc: "/avatars/priya.jpeg"
  },
  {
    tempId: 3,
    testimonial: "I posted my first nebula frame here, terrified. The feedback made me a better photographer.",
    by: "Tomas, astrophotographer",
    imgSrc: "/avatars/tomas.jpeg"
  },
  {
    tempId: 4,
    testimonial: "My daughter and I watch for the space station together now. This place gave us that.",
    by: "Elena, stargazer",
    imgSrc: "/avatars/elena.jpeg"
  },
  {
    tempId: 5,
    testimonial: "It respects your intelligence and feeds your curiosity. That is a rare combination.",
    by: "Marcus, software engineer",
    imgSrc: "/avatars/marcus.jpeg"
  },
  {
    tempId: 6,
    testimonial: "I came for the black holes. I stayed for the people.",
    by: "Aiko, cosmology enthusiast",
    imgSrc: "/avatars/aiko.jpeg"
  },
  {
    tempId: 7,
    testimonial: "The explainers are so clear I sent one to my university professor. He sent it to his whole class.",
    by: "Julien, student",
    imgSrc: "/avatars/julien.jpeg"
  },
  {
    tempId: 8,
    testimonial: "A quiet room full of people looking up. That is the entire appeal.",
    by: "Sofia, designer",
    imgSrc: "/avatars/sofia.jpeg"
  },
  {
    tempId: 9,
    testimonial: "No noise, no arguing. Just wonder, shared carefully.",
    by: "Rahul, engineer",
    imgSrc: "/avatars/rahul.jpeg"
  },
  {
    tempId: 10,
    testimonial: "Ten minutes here feels like an evening at the observatory.",
    by: "Clara, writer",
    imgSrc: "/avatars/clara.jpeg"
  },
  {
    tempId: 11,
    testimonial: "The universe is overwhelming. This community makes it approachable without ever making it small.",
    by: "Ben, telescope builder",
    imgSrc: "/avatars/ben.jpeg"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize
}) => {
  const isCenter = position === 0;

  // The div is clickable (tap a card to bring it to the center), so it must
  // also be keyboard-reachable: a button role, a tab stop on the cards a
  // keyboard user can meaningfully act on (center and its neighbors), and
  // Enter/Space firing the same move. Offset cards further out stay out of
  // the tab order — they are one click away once any card moves.
  const focusable = Math.abs(position) <= 1;

  return (
    <div
      onClick={() => handleMove(position)}
      role="button"
      tabIndex={focusable ? 0 : -1}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleMove(position);
        }
      }}
      aria-label={`${testimonial.by}: ${testimonial.testimonial}`}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 bg-primary text-primary-foreground border-primary"
          : "z-0 bg-card text-card-foreground border-border hover:border-primary/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-12 bg-muted object-cover object-top"
        style={{
          boxShadow: "3px 3px 0px hsl(var(--background))"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-medium",
        isCenter ? "text-primary-foreground" : "text-foreground"
      )}>
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
        isCenter ? "text-primary-foreground/80" : "text-muted-foreground"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-muted/30"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
