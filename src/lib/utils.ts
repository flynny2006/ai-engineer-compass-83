
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Check if device is touch-capable
export function isTouchDevice() {
  return typeof window !== "undefined" && 
    (('ontouchstart' in window) || 
     (navigator.maxTouchPoints > 0) || 
     (navigator.msMaxTouchPoints > 0))
}

// Format credit number with abbreviation for large numbers
export function formatCredits(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

// Calculate responsive font size based on viewport width
export function getResponsiveFontSize(baseSize: number, minSize: number, maxSize: number): string {
  return `clamp(${minSize}px, ${baseSize}vw, ${maxSize}px)`;
}
