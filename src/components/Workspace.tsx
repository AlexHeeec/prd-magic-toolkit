
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

export interface Version {
  id: string;
  name: string;
  timestamp: Date;
  changes: string;
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

// Mock versions data for each task
export const taskVersionsMap: { [key: string]: Version[] } = {
  "1": [
    {
      id: "1-v1",
      name: "Initial Version",
      timestamp: new Date(Date.now() - 3600000),
      changes: "Generated 12 test cases for authentication flow"
    },
    {
      id: "1-v2",
      name: "Added Registration Tests",
      timestamp: new Date(Date.now() - 2400000),
      changes: "Added 3 test cases for user registration"
    }
  ],
  "2": [
    {
      id: "2-v1",
      name: "Initial Version",
      timestamp: new Date(Date.now() - 4800000),
      changes: "Generated 15 test cases for payment processing"
    },
    {
      id: "2-v2",
      name: "Added Payment Failure Tests",
      timestamp: new Date(Date.now() - 3600000),
      changes: "Added 3 test cases for payment failures"
    }
  ],
  "3": [
    {
      id: "3-v1",
      name: "Initial Version",
      timestamp: new Date(Date.now() - 5600000),
      changes: "Generated 15 test cases for profile management"
    }
  ],
  "4": [
    {
      id: "4-v1",
      name: "Initial Version",
      timestamp: new Date(Date.now() - 6000000),
      changes: "Generated 8 test cases for dashboard analytics"
    }
  ]
};

const Workspace: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiModifying, setIsAiModifying] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    if (!activeTask && tasks.length > 0) {
      setActiveTask(tasks[0]);
    }
  }, [tasks, activeTask]);

  useEffect(() => {
    if (activeTask) {
      const taskVersions = taskVersionsMap[activeTask.id] || [];
      setVersions(taskVersions);
      if (taskVersions.length > 0) {
        setActiveVersionId(taskVersions[taskVersions.length - 1].id);
      } else {
        setActiveVersionId(undefined);
      }
    } else {
      setVersions([]);
      setActiveVersionId(undefined);
    }
  }, [activeTask]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (tasks.length > 0) {
        setActiveTask(tasks[0]);
      }
    }, 2000);
  };

  const handleAiAction = () => {
    setIsAiModifying(true);
    setTimeout(() => {
      setIsAiModifying(false);
    }, 1500);
  };

  const handleTaskSelect = (taskId: string) => {
    const selectedTask = tasks.find(task => task.id === taskId);
    setActiveTask(selectedTask);
  };

  const handleVersionSelect = (versionId: string) => {
    setActiveVersionId(versionId);
  };

  const handleAddMessage = (message: Omit<Message, 'id'>) => {
    if (!activeTask) return;
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex(task => task.id === activeTask.id);
    if (taskIndex === -1) return;
    const newMessage = {
      ...message,
      id: `${activeTask.id}-${Date.now()}`
    };
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      messages: [...updatedTasks[taskIndex].messages, newMessage]
    };
    setTasks(updatedTasks);
    setActiveTask(updatedTasks[taskIndex]);
  };

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    if (activeTask && activeTask.id === taskId) {
      setActiveTask(updatedTasks.length > 0 ? updatedTasks[0] : undefined);
    }
  };

  return (
    <div className="flex h-screen w-full gap-4 p-4 overflow-hidden">
      <div className="w-1/4 min-w-[300px] max-w-[400px] h-full overflow-hidden">
        <LeftPanel
          onGenerate={handleGenerate}
          tasks={tasks}
          activeTaskId={activeTask?.id}
          onTaskSelect={handleTaskSelect}
          onTaskDelete={handleTaskDelete}
        />
      </div>
      <div className="flex-1 h-full overflow-hidden">
        <CenterPanel
          isGenerating={isGenerating}
          isAiModifying={isAiModifying}
          activeTask={activeTask}
          activeVersionId={activeVersionId}
        />
      </div>
      <div className="w-1/4 min-w-[300px] max-w-[400px] h-full overflow-hidden">
        <RightPanel
          isGenerating={isGenerating}
          onAiModifying={handleAiAction}
          activeTask={activeTask}
          onAddMessage={handleAddMessage}
          versions={versions}
          activeVersionId={activeVersionId}
          onVersionSelect={handleVersionSelect}
        />
      </div>
    </div>
  );
};

export default Workspace;
