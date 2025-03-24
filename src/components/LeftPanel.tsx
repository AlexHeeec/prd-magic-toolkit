
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileUp,
  Text,
  FileText,
  Play,
  History,
  Trash2
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Task } from "./Workspace";

interface LeftPanelProps {
  onGenerate: () => void;
  tasks: Task[];
  activeTaskId?: string;
  onTaskSelect: (taskId: string) => void;
  onDeleteTask: (taskId: string, event?: React.MouseEvent) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ 
  onGenerate, 
  tasks,
  activeTaskId,
  onTaskSelect,
  onDeleteTask
}) => {
  const [prdInput, setPrdInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API delay
    setTimeout(() => {
      setIsGenerating(false);
      onGenerate();
    }, 1500);
  };

  // If a task is selected but we're not on the history tab, switch to it
  useEffect(() => {
    if (activeTaskId && activeTab !== "history") {
      setActiveTab("history");
    }
  }, [activeTaskId]);

  const handleTaskClick = (taskId: string) => {
    onTaskSelect(taskId);
  };

  const hasContent = prdInput.length > 0 || selectedFile !== null;

  return (
    <div className="panel-transition w-full h-full p-4 flex flex-col bg-white rounded-xl border border-primary/20 shadow-sm overflow-hidden">
      <h2 className="text-lg font-medium mb-4">Test Case Generation</h2>
      <div className="w-full">
        <div className="grid grid-cols-2 mb-4">
          <button 
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${
              activeTab === "input" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("input")}
          >
            <FileText className="h-4 w-4" />
            <span>PRD Input</span>
          </button>
          <button 
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${
              activeTab === "history" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("history")}
          >
            <History className="h-4 w-4" />
            <span>Tasks</span>
          </button>
        </div>
        
        <div className={`mt-0 space-y-4 ${activeTab !== "input" ? "hidden" : ""}`}>
          {/* Input content */}
          <div className="space-y-2">
            <div>
              <div className="grid grid-cols-2 inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500">
                <button 
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
                    activeTab === "text" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("text")}
                >
                  <Text className="h-3 w-3 mr-1" />
                  <span>Text</span>
                </button>
                <button 
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
                    activeTab === "file" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("file")}
                >
                  <FileUp className="h-3 w-3 mr-1" />
                  <span>File</span>
                </button>
              </div>
              
              <div className={`mt-2 ${activeTab !== "text" && activeTab !== "input" ? "hidden" : ""}`}>
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Paste your PRD content here..."
                    className="min-h-[300px] resize-none"
                    value={prdInput}
                    onChange={(e) => setPrdInput(e.target.value)}
                  />
                </div>
              </div>
              
              <div className={`mt-2 ${activeTab !== "file" ? "hidden" : ""}`}>
                <div className="space-y-2">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <FileUp className="mx-auto h-8 w-8 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium">Upload PRD document</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                    <Input
                      type="file"
                      className="hidden"
                      id="prd-file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("prd-file")?.click()}
                      className="mt-4"
                    >
                      Select File
                    </Button>
                    {selectedFile && (
                      <div className="mt-4 text-sm">
                        Selected: {selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={!hasContent || isGenerating}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Test Cases...</span>
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                <span>Generate Test Cases</span>
              </>
            )}
          </Button>
        </div>
        
        <div className={`mt-0 ${activeTab !== "history" ? "hidden" : ""}`}>
          {/* History content with scrollable area */}
          <ScrollArea className="h-full max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card 
                  key={task.id} 
                  className={`hover:bg-accent/10 transition-colors cursor-pointer ${
                    activeTaskId === task.id ? "bg-accent/20 ring-1 ring-accent" : ""
                  }`}
                  onClick={() => handleTaskClick(task.id)}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base truncate">{task.title}</CardTitle>
                    <CardDescription className="text-xs">{task.date}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <span className="text-xs text-muted-foreground">{task.caseCount} test cases</span>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={(e) => onDeleteTask(task.id, e)}
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
