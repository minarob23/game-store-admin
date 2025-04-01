// VG Sales data utility

import { Game } from '@shared/schema';

// Define the structure of VG Sales data rows
export interface VGSalesRow {
  Rank: number;
  Name: string;
  Platform: string;
  Year: string | number;
  Genre: string;
  Publisher: string;
  Price?: number; // Virtual price not in original data
}

// Parse CSV data (first few hundred rows for demo purposes)
export const parseVGSalesData = (csvData: string): VGSalesRow[] => {
  const rows = csvData.trim().split('\n');
  const headers = rows[0].split(',');
  
  const data: VGSalesRow[] = [];
  
  // Process only a subset of the data (for performance in demo)
  const MAX_ROWS = 150; // Limit to 150 games
  
  for (let i = 1; i < Math.min(rows.length, MAX_ROWS + 1); i++) {
    const columns = rows[i].split(',');
    
    // Ensure we have enough columns
    if (columns.length >= 6) {
      // Generate a virtual price between $9.99 and $59.99 based on rank
      // Lower rank (more popular games) tend to have higher prices
      const basePrice = 59.99;
      const rank = parseInt(columns[0]);
      let virtualPrice = basePrice;
      
      if (rank > 10) virtualPrice = 49.99;
      if (rank > 30) virtualPrice = 39.99;
      if (rank > 50) virtualPrice = 29.99;
      if (rank > 80) virtualPrice = 19.99;
      if (rank > 120) virtualPrice = 9.99;
      
      data.push({
        Rank: parseInt(columns[0]),
        Name: columns[1],
        Platform: columns[2],
        Year: columns[3] === 'N/A' ? 'Unknown' : parseInt(columns[3]),
        Genre: columns[4],
        Publisher: columns[5],
        Price: virtualPrice
      });
    }
  }
  
  return data;
};

// Convert VG Sales data to our application Game format
export const convertToGameFormat = (vgData: VGSalesRow[]): Game[] => {
  return vgData.map((vgGame, index) => {
    // Map platforms from VG Sales to our platform format
    const platformMapping: Record<string, { pc?: boolean, ps5?: boolean, xsx?: boolean, switch?: boolean }> = {
      'PS3': { ps5: true },
      'PS4': { ps5: true },
      'PS2': { ps5: true },
      'PS': { ps5: true },
      'X360': { xsx: true },
      'XB': { xsx: true },
      'XOne': { xsx: true },
      'Wii': { switch: true },
      'WiiU': { switch: true },
      'DS': { switch: true },
      'GBA': { switch: true },
      '3DS': { switch: true },
      'PC': { pc: true },
      'SNES': { switch: true },
      'NES': { switch: true },
      'N64': { switch: true },
      'GC': { switch: true },
      'GB': { switch: true },
      'GEN': { pc: true },
      '2600': { pc: true }
      // Other platforms can default to PC for simplicity
    };
    
    // Get platform object or default to PC if unknown
    const platforms = platformMapping[vgGame.Platform] || { pc: true };
    
    // Create description combining genre, platform, and publisher
    const description = `${vgGame.Name} is a ${vgGame.Genre} game originally released for ${vgGame.Platform} in ${vgGame.Year} by ${vgGame.Publisher}.`;
    
    // Convert release year to a date string
    const releaseYear = typeof vgGame.Year === 'number' ? vgGame.Year : 2000;
    const releaseDate = `${releaseYear}-01-01`;
    
    // Create stock value between 0-100 based on rank (higher rank = lower stock)
    const stock = Math.max(0, Math.min(100, Math.floor(100 - vgGame.Rank / 2)));
    
    return {
      id: index + 1,
      title: vgGame.Name,
      platforms,
      description,
      releaseDate,
      genre: vgGame.Genre,
      developer: vgGame.Publisher, // Use publisher as developer since we don't have developer data
      publisher: vgGame.Publisher,
      price: vgGame.Price || 19.99,
      stock,
      imageUrl: null,
      createdAt: new Date()
    };
  });
};