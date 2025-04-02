
import { Game } from "@shared/schema";

export function generateInventoryCSV(games: Game[]) {
  const headers = ['Title', 'Genre', 'Release Date', 'Price', 'Stock', 'Platforms'];
  const rows = games.map(game => [
    game.title,
    game.genre,
    game.releaseDate,
    game.price.toString(),
    game.stock.toString(),
    Object.entries(game.platforms)
      .filter(([_, enabled]) => enabled)
      .map(([platform]) => platform)
      .join(', ')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

export async function generateInventoryReport(games: Game[]) {
  try {
    const totalGames = games.length;
    const totalValue = games.reduce((sum, game) => sum + (game.price * game.stock), 0);
    const lowStock = games.filter(game => game.stock < 10).length;
    const outOfStock = games.filter(game => game.stock === 0).length;

    const report = `
GameStore Inventory Report
Generated on: ${new Date().toLocaleDateString()}

Summary:
- Total Games: ${totalGames}
- Total Inventory Value: $${totalValue.toFixed(2)}
- Low Stock Items (<10): ${lowStock}
- Out of Stock Items: ${outOfStock}

===================
Detailed Inventory:
===================
${games.map(game => `
${game.title}
- Genre: ${game.genre}
- Price: $${game.price}
- Stock: ${game.stock}
- Platforms: ${Object.entries(game.platforms)
    .filter(([_, enabled]) => enabled)
    .map(([platform]) => platform.toUpperCase())
    .join(', ')}
`).join('\n')}
`;

    // Create blob and trigger download
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-report-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Failed to generate report');
  }
}

export async function generateDashboardPDF() {
  return await generatePDF('dashboard-content', 'dashboard-report.pdf');
}

export async function generateAnalyticsPDF() {
  return await generatePDF('analytics-content', 'analytics-report.pdf');
}
