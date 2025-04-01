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
    // PlayStation Family
    ps5: 'PS5',
    ps4: 'PS4',
    ps3: 'PS3',
    ps2: 'PS2',
    ps: 'PlayStation',
    // Xbox Family
    xsx: 'Xbox Series X',
    xone: 'Xbox One',
    x360: 'Xbox 360',
    xbox: 'Xbox',
    // Nintendo Family
    switch: 'Switch',
    wiiu: 'Wii U',
    wii: 'Wii',
    '3ds': '3DS',
    ds: 'DS',
    // Other platforms
    psp: 'PSP',
    vita: 'PS Vita',
    gc: 'GameCube',
    n64: 'N64',
    gb: 'Game Boy',
    gba: 'GBA',
    snes: 'SNES',
    nes: 'NES',
    sega: 'Sega',
    mobile: 'Mobile',
    other: 'Other',
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
  { value: 'all', label: 'All Platforms' },
  // PC
  { value: 'pc', label: 'PC' },
  // PlayStation Family
  { value: 'ps5', label: 'PS5' },
  { value: 'ps4', label: 'PS4' },
  { value: 'ps3', label: 'PS3' },
  { value: 'ps2', label: 'PS2' },
  { value: 'ps', label: 'PlayStation' },
  { value: 'psp', label: 'PSP' },
  { value: 'vita', label: 'PS Vita' },
  // Xbox Family
  { value: 'xsx', label: 'Xbox Series X' },
  { value: 'xone', label: 'Xbox One' },
  { value: 'x360', label: 'Xbox 360' },
  { value: 'xbox', label: 'Xbox' },
  // Nintendo Family
  { value: 'switch', label: 'Nintendo Switch' },
  { value: 'wiiu', label: 'Wii U' },
  { value: 'wii', label: 'Wii' },
  { value: '3ds', label: '3DS' },
  { value: 'ds', label: 'DS' },
  { value: 'gc', label: 'GameCube' },
  { value: 'n64', label: 'Nintendo 64' },
  { value: 'snes', label: 'Super Nintendo' },
  { value: 'nes', label: 'NES' },
  { value: 'gba', label: 'Game Boy Advance' },
  { value: 'gb', label: 'Game Boy' },
  // Other
  { value: 'sega', label: 'Sega' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'other', label: 'Other' },
];

// Genre options for select dropdowns
export const genreOptions = [
  { value: 'none', label: 'Select Genre' },
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'fighting', label: 'Fighting' },
  { value: 'platform', label: 'Platform' },
  { value: 'puzzle', label: 'Puzzle' },
  { value: 'racing', label: 'Racing' },
  { value: 'role-playing', label: 'Role-Playing' },
  { value: 'shooter', label: 'Shooter' },
  { value: 'simulation', label: 'Simulation' },
  { value: 'sports', label: 'Sports' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'misc', label: 'Miscellaneous' },
];
