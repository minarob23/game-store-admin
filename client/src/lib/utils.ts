import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable string (e.g., "Dec 10, 2020")
export function formatDate(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format currency with $ symbol
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format platforms object to string (e.g., "PC, PS5, XSX")
export function formatPlatforms(platforms: Record<string, boolean>): string {
  const platformMap: Record<string, string> = {
    pc: 'PC',
    ps5: 'PS5',
    xsx: 'XSX',
    switch: 'Switch',
  };
  
  return Object.entries(platforms)
    .filter(([_, isAvailable]) => isAvailable)
    .map(([platform, _]) => platformMap[platform] || platform)
    .join(', ');
}

// Determine stock status label and color
export function getStockStatus(stock: number): { label: string; className: string } {
  if (stock <= 0) {
    return { label: 'Out of Stock', className: 'bg-red-500/20 text-red-500' };
  } 
  if (stock < 10) {
    return { label: `Low Stock (${stock})`, className: 'bg-amber-500/20 text-amber-500' };
  }
  return { label: `In Stock (${stock})`, className: 'bg-green-500/20 text-green-500' };
}

// Platform options for select dropdowns
export const platformOptions = [
  { value: '', label: 'All Platforms' },
  { value: 'pc', label: 'PC' },
  { value: 'ps5', label: 'PlayStation 5' },
  { value: 'xsx', label: 'Xbox Series X' },
  { value: 'switch', label: 'Nintendo Switch' },
];

// Genre options for select dropdowns
export const genreOptions = [
  { value: '', label: 'Select Genre' },
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'action-adventure', label: 'Action Adventure' },
  { value: 'rpg', label: 'RPG' },
  { value: 'action-rpg', label: 'Action RPG' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'simulation', label: 'Simulation' },
  { value: 'sports', label: 'Sports' },
  { value: 'racing', label: 'Racing' },
  { value: 'shooter', label: 'Shooter' },
  { value: 'puzzle', label: 'Puzzle' },
  { value: 'indie', label: 'Indie' },
];
