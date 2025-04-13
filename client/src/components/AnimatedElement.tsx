import { ReactNode, useEffect, useState, useRef } from "react";

interface AnimatedElementProps {
  children: ReactNode;
  animation: string;
  duration?: number;
  delay?: number;
  triggerOnce?: boolean;
  className?: string;
}

export default function AnimatedElement({
  children,
  animation,
  duration = 1,
  delay = 0,
  triggerOnce = true,
  className = "",
}: AnimatedElementProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [triggerOnce]);

  const animationClass = isVisible
    ? `animate__animated animate__${animation}`
    : "";
  const style = {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  };

  return (
    <div
      ref={elementRef}
      className={`${animationClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
