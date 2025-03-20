
import React, { useState, useEffect } from "react";
import CenterPanel from "./CenterPanel";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

export interface Task {
  id: string;
  title: string;
  date: string;
  caseCount: number;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

// Mock tasks data with associated test cases and chat messages
const mockTasks: Task[] = [
  {
    id: "1",
    title: "User Authentication Flow",
    date: "2023-09-15",
    caseCount: 12,
    messages: [
      {
        id: "1-1",
        content: "I've analyzed your PRD and generated test cases focusing on the authentication flow.",
        sender: "ai",
        timestamp: new Date(Date.now() - 120000),
      },
      {
        id: "1-2",
        content: "Can you add more test cases for user registration?",
        sender: "user",
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: "1-3",
        content: "I've added 3 new test cases covering the user registration scenarios.",
        sender: "ai",
        timestamp: new Date(Date.now() - 30000),
      }
    ]
  },
  {
    id: "2",
    title: "Payment Processing Module",
    date: "2023-09-10",
    caseCount: 18,
    messages: [
      {
        id: "2-1",
        content: "I've generated test cases for the payment processing module based on your requirements.",
        sender: "ai",
        timestamp: new Date(Date.now() - 360000),
      },
      {
        id: "2-2",
        content: "Please add test cases for payment failures and refunds.",
        sender: "user",
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: "2-3",
        content: "I've added 5 new test cases covering payment failures and refund scenarios.",
        sender: "ai",
        timestamp: new Date(Date.now() - 240000),
      }
    ]
  },
  {
    id: "3",
    title: "Profile Management",
    date: "2023-09-01",
    caseCount: 15,
    messages: [
      {
        id: "3-1",
        content: "I've created test cases for the profile management functionality.",
        sender: "ai",
        timestamp: new Date(Date.now() - 500000),
      }
    ]
  },
  {
    id: "4",
    title: "Dashboard Analytics",
    date: "2023-09-05",
    caseCount: 8,
    messages: [
      {
        id: "4-1",
        content: "I've generated test cases for the dashboard analytics features.",
        sender: "ai",
        timestamp: new Date(Date.now() - 700000),
      }
    ]
  }
];

const Workspace: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiModifying, setIsAiModifying] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  useEffect(() => {
    // Initialize with the first task if there's no active task
    if (!activeTask && tasks.length > 0) {
      setActiveTask(tasks[0]);
    }
  }, [tasks, activeTask]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API delay
    setTimeout(() => {
      setIsGenerating(false);
      // After generating, select the first task
      if (tasks.length > 0) {
        setActiveTask(tasks[0]);
      }
    }, 2000);
  };

  const handleAiAction = () => {
    setIsAiModifying(true);
    // Simulate AI modification delay
    setTimeout(() => {
      setIsAiModifying(false);
    }, 1500);
  };

  const handleTaskSelect = (taskId: string) => {
    const selectedTask = tasks.find(task => task.id === taskId);
    setActiveTask(selectedTask);
  };

  const handleAddMessage = (message: Omit<Message, 'id'>) => {
    if (!activeTask) return;
    
    // Create a copy of the tasks array
    const updatedTasks = [...tasks];
    
    // Find the index of the active task
    const taskIndex = updatedTasks.findIndex(task => task.id === activeTask.id);
    
    if (taskIndex === -1) return;
    
    // Create a new message with a unique ID
    const newMessage = {
      ...message,
      id: `${activeTask.id}-${Date.now()}`
    };
    
    // Add the message to the active task's messages
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      messages: [...updatedTasks[taskIndex].messages, newMessage]
    };
    
    // Update the tasks state and active task
    setTasks(updatedTasks);
    setActiveTask(updatedTasks[taskIndex]);
  };

  return (
    <div className="flex h-full w-full gap-4 p-4">
      <div className="w-1/4 min-w-[300px] max-w-[400px]">
        <LeftPanel 
          onGenerate={handleGenerate} 
          tasks={tasks}
          activeTaskId={activeTask?.id}
          onTaskSelect={handleTaskSelect}
        />
      </div>
      <div className="flex-1">
        <CenterPanel 
          isGenerating={isGenerating} 
          isAiModifying={isAiModifying} 
          activeTask={activeTask}
        />
      </div>
      <div className="w-1/4 min-w-[300px] max-w-[400px]">
        <RightPanel 
          isGenerating={isGenerating}
          onAiModifying={handleAiAction}
          activeTask={activeTask}
          onAddMessage={handleAddMessage}
        />
      </div>
    </div>
  );
};

export default Workspace;
