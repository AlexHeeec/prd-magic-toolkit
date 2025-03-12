
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileUp,
  Link as LinkIcon,
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

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  caseCount: number;
}

// Mock history data
const mockHistory: HistoryItem[] = [
  {
    id: "1",
    title: "User Authentication Flow",
    date: "2023-09-15",
    caseCount: 12
  },
  {
    id: "2",
    title: "Payment Processing Module",
    date: "2023-09-10",
    caseCount: 18
  },
  {
    id: "3",
    title: "Dashboard Analytics",
    date: "2023-09-05",
    caseCount: 8
  },
  {
    id: "4",
    title: "Profile Management",
    date: "2023-09-01",
    caseCount: 15
  }
];

const LeftPanel: React.FC<{ onGenerate: () => void }> = ({ onGenerate }) => {
  const [prdInput, setPrdInput] = useState("");
  const [prdUrl, setPrdUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const hasContent = prdInput.length > 0 || prdUrl.length > 0 || selectedFile !== null;

  return (
    <div className="panel-transition w-full h-full p-4 flex flex-col bg-sidebar rounded-xl">
      <h2 className="text-lg font-medium mb-4">Test Case Generation</h2>
      
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="input" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>PRD Input</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="mt-0 space-y-4">
          <div className="space-y-2">
            <Tabs defaultValue="text">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="text" className="flex items-center gap-1">
                  <Text className="h-3 w-3" />
                  <span>Text</span>
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-1">
                  <FileUp className="h-3 w-3" />
                  <span>File</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" />
                  <span>URL</span>
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
              
              <TabsContent value="url" className="mt-2">
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="Enter PRD document URL"
                    value={prdUrl}
                    onChange={(e) => setPrdUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a valid URL to a PRD document
                  </p>
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
          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-3">
              {mockHistory.map((item) => (
                <Card key={item.id} className="hover:bg-accent/10 transition-colors cursor-pointer">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base truncate">{item.title}</CardTitle>
                    <CardDescription className="text-xs">{item.date}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <span className="text-xs text-muted-foreground">{item.caseCount} test cases</span>
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
