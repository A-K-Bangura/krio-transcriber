import { Moon, Sun, FileDown, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranscriptionStore } from "@/store/transcriptionStore";
import { exportToTxt, exportToSrt, exportToJson } from "@/utils/exportUtils";
import { toast } from "sonner";
import SLlogo from "../assets/Slmap.png";

export const Navbar = () => {
  const { darkMode, toggleDarkMode, segments } = useTranscriptionStore();

  const handleExport = (format: "txt" | "srt" | "json") => {
    if (segments.length === 0) {
      toast.error("No transcript to export");
      return;
    }

    switch (format) {
      case "txt":
        exportToTxt(segments);
        break;
      case "srt":
        exportToSrt(segments);
        break;
      case "json":
        exportToJson(segments);
        break;
    }
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const handleSave = () => {
    localStorage.setItem("transcript", JSON.stringify(segments));
    toast.success("Transcript saved locally");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <div className="flex items-center pl-4 gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg">
              <img src={SLlogo} alt="logo" />
            </span>
          </div>
          <h1 className="text-xl font-bold">Krio transcriber</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleSave} variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("txt")}>
              Export as TXT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("srt")}>
              Export as SRT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("json")}>
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={toggleDarkMode}
          variant="ghost"
          size="sm"
          className="w-9 h-9 p-0"
        >
          {darkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </nav>
  );
};
