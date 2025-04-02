import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, BarChart3, FileDown } from "lucide-react";
import { generateDashboardPDF, generateAnalyticsPDF } from "@/lib/reports";

interface QuickActionsProps {
  onAddGame: () => void;
  onExportInventory?: () => void;
  onGenerateReport?: () => void;
}

export default function QuickActions({ 
  onAddGame, 
  onExportInventory = () => {}, 
  onGenerateReport = () => {} 
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full bg-primary hover:bg-secondary"
          onClick={onAddGame}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Game
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={onExportInventory}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Inventory
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={onGenerateReport}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Generate Report
        </Button>

        <Button 
          variant="outline"
          className="w-full"
          onClick={() => generateDashboardPDF()}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Save Dashboard as PDF
        </Button>

        <Button 
          variant="outline"
          className="w-full"
          onClick={() => generateAnalyticsPDF()}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Save Analytics as PDF
        </Button>
      </CardContent>
    </Card>
  );
}
