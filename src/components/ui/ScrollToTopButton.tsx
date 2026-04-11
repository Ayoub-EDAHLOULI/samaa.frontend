"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [toggleVisibility]);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed z-100 flex items-center justify-center rounded-full border-none 
         text-white shadow-lg transition-all duration-300 
        /* Mobile sizing (default) */
        bottom-4 right-4 h-10 w-10 p-2
        /* Tablet/Desktop sizing */
        md:bottom-6 md:right-6 md:h-12 md:w-12
        /* Fade in/out logic */
        ${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}
      `}
      style={{
        backgroundColor: "var(--primary)",
      }}
    >
      <ArrowUp className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
    </button>
  );
}
