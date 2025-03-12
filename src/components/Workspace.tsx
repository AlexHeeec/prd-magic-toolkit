
import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Workspace: React.FC = () => {
  const isMobile = useIsMobile();
  const [activePanel, setActivePanel] = useState<'left' | 'center' | 'right'>(isMobile ? 'center' : 'center');
  const [isGenerating, setIsGenerating] = useState(false);
  const [leftVisible, setLeftVisible] = useState(!isMobile);
  const [rightVisible, setRightVisible] = useState(!isMobile);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="w-full h-[calc(100vh-5.5rem)] flex overflow-hidden">
      {isMobile ? (
        <>
          {activePanel === 'left' && (
            <div className="animate-slide-in-left absolute inset-0 z-10 bg-background">
              <LeftPanel onGenerate={handleGenerate} />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 z-20"
                onClick={() => setActivePanel('center')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {activePanel === 'center' && (
            <div className="w-full animate-fade-in">
              <CenterPanel isGenerating={isGenerating} />
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shadow-md"
                  onClick={() => setActivePanel('left')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shadow-md"
                  onClick={() => setActivePanel('right')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {activePanel === 'right' && (
            <div className="animate-slide-in-right absolute inset-0 z-10 bg-background">
              <RightPanel />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 left-4 z-20"
                onClick={() => setActivePanel('center')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <div 
            className={`panel-transition ${
              leftVisible ? 'w-1/3 opacity-100' : 'w-0 opacity-0'
            }`}
          >
            {leftVisible && <LeftPanel onGenerate={handleGenerate} />}
          </div>
          
          <div className={`panel-transition flex-1 flex ${!leftVisible && !rightVisible ? 'mx-auto max-w-4xl' : ''}`}>
            <div className="relative w-full">
              <CenterPanel isGenerating={isGenerating} />
              
              {!leftVisible && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 left-4 opacity-60 hover:opacity-100"
                  onClick={() => setLeftVisible(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              
              {!rightVisible && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 opacity-60 hover:opacity-100"
                  onClick={() => setRightVisible(true)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div 
            className={`panel-transition ${
              rightVisible ? 'w-1/3 opacity-100' : 'w-0 opacity-0'
            }`}
          >
            {rightVisible && <RightPanel />}
          </div>
        </>
      )}
    </div>
  );
};

export default Workspace;
