
import React, { useState } from "react";
import CenterPanel from "./CenterPanel";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

const Workspace: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiModifying, setIsAiModifying] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<string | undefined>(undefined);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API delay
    setTimeout(() => {
      setIsGenerating(false);
      // After generating, select the first history item
      setSelectedHistoryItem("1");
    }, 2000);
  };

  const handleAiAction = () => {
    setIsAiModifying(true);
    // Simulate AI modification delay
    setTimeout(() => {
      setIsAiModifying(false);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full gap-4 p-4">
      <div className="w-1/4 min-w-[300px] max-w-[400px]">
        <LeftPanel 
          onGenerate={handleGenerate} 
          selectedHistoryItem={selectedHistoryItem}
          onHistoryItemSelect={setSelectedHistoryItem}
        />
      </div>
      <div className="flex-1">
        <CenterPanel 
          isGenerating={isGenerating} 
          isAiModifying={isAiModifying} 
          selectedHistoryItem={selectedHistoryItem}
          onHistoryItemChange={setSelectedHistoryItem}
        />
      </div>
      <div className="w-1/4 min-w-[300px] max-w-[400px]">
        <RightPanel 
          isGenerating={isGenerating}
          isAiModifying={isAiModifying}
        />
      </div>
    </div>
  );
};

export default Workspace;
