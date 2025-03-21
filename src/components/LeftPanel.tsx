import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileUp,
  Text,
  FileText,
  Play,
  History
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
}

const LeftPanel: React.FC<LeftPanelProps> = ({ 
  onGenerate, 
  tasks,
  activeTaskId,
  onTaskSelect 
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
    <div className="panel-transition w-full h-full p-4 flex flex-col bg-white rounded-xl border border-primary/20 overflow-hidden">
      <h2 className="text-lg font-medium mb-4">Test Case Generation</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="input" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>PRD Input</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="mt-0 space-y-4">
          {/* Input content */}
          <div className="space-y-2">
            <Tabs defaultValue="text">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="text" className="flex items-center gap-1">
                  <Text className="h-3 w-3" />
                  <span>Text</span>
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-1">
                  <FileUp className="h-3 w-3" />
                  <span>File</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="mt-2">
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Paste your PRD content here..."
                    className="min-h-[300px] resize-none"
                    value={prdInput}
                    onChange={(e) => setPrdInput(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="file" className="mt-2">
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
              </TabsContent>
            </Tabs>
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
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
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
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="sr-only">View</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeftPanel;
