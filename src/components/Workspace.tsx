import React, { useState, useEffect } from "react";
import CenterPanel from "./CenterPanel";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

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
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    // Initialize with the first task if there's no active task
    if (!activeTask && tasks.length > 0) {
      setActiveTask(tasks[0]);
    }
  }, [tasks, activeTask]);

  useEffect(() => {
    // When active task changes, update versions and set the latest version as active
    if (activeTask) {
      const taskVersions = taskVersionsMap[activeTask.id] || [];
      setVersions(taskVersions);
      
      // Set the latest version as active by default
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
    // Simulate API delay
    setTimeout(() => {
      setIsGenerating(false);
      // After generating, select the first task
      if (tasks.length > 0) {
        setActiveTask(tasks[0]);
      }
    }, 2000);
  };

  const handleAiAction = (isModifying: boolean) => {
    setIsAiModifying(isModifying);
  };

  const handleTaskSelect = (taskId: string) => {
    const selectedTask = tasks.find(task => task.id === taskId);
    setActiveTask(selectedTask);
  };

  const handleVersionSelect = (versionId: string) => {
    setActiveVersionId(versionId);
    
    // Add version to version history
    if (activeTask) {
      // Check if version already exists
      const existingVersions = taskVersionsMap[activeTask.id] || [];
      const versionExists = existingVersions.some(v => v.id === versionId);
      
      if (!versionExists) {
        // If version doesn't exist, add it
        const newVersions = [...existingVersions, {
          id: versionId,
          name: `Version ${existingVersions.length + 1}`,
          timestamp: new Date(),
          changes: `Updated version ${versionId}`
        }];
        
        // Update version map
        const updatedVersionsMap = {...taskVersionsMap};
        updatedVersionsMap[activeTask.id] = newVersions;
        
        // Update versions state
        setVersions(newVersions);
      } else {
        // If version exists, just update active version ID
        setActiveVersionId(versionId);
      }
    }
  };

  const handleAddMessage = (message: Omit<Message, 'id'>) => {
    if (!activeTask) {
      console.error("No active task to add message to");
      return;
    }
    
    // Create a deep copy of the tasks array
    const updatedTasks = [...tasks];
    
    // Find the index of the active task
    const taskIndex = updatedTasks.findIndex(task => task.id === activeTask.id);
    
    if (taskIndex === -1) {
      console.error("Active task not found in tasks array");
      return;
    }
    
    // Create a new message with a unique ID
    const newMessage = {
      ...message,
      id: `${activeTask.id}-${Date.now()}`
    };
    
    console.log("Message added:", newMessage);
    
    // Make a deep copy of the task to modify
    const updatedTask = {
      ...updatedTasks[taskIndex],
      messages: [...updatedTasks[taskIndex].messages, newMessage]
    };

    updatedTasks[taskIndex] = updatedTask;
    
    // Debug logging to verify the message was added
    console.log("Updated active task messages:", updatedTask.messages);
    
    // Update the tasks state
    setTasks(updatedTasks);
    
    // Update the active task reference
    setActiveTask(updatedTask);
  };

  const handleDeleteTask = (taskId: string, event?: React.MouseEvent) => {
    // Prevent task selection when clicking delete icon
    if (event) {
      event.stopPropagation();
    }
    
    // Find task to delete
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
      setIsConfirmDialogOpen(true);
    }
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    
    const updatedTasks = tasks.filter(task => task.id !== taskToDelete.id);
    setTasks(updatedTasks);
    
    // If the active task is being deleted, set a new active task
    if (activeTask && activeTask.id === taskToDelete.id) {
      setActiveTask(updatedTasks.length > 0 ? updatedTasks[0] : undefined);
    }
    
    toast({
      title: "Task deleted",
      description: `"${taskToDelete.title}" has been removed.`,
    });
    
    // Close the dialog and reset taskToDelete
    setIsConfirmDialogOpen(false);
    setTaskToDelete(null);
  };

  const cancelDeleteTask = () => {
    setIsConfirmDialogOpen(false);
    setTaskToDelete(null);
  };

  return (
    <div className="flex h-screen w-full gap-4 p-4 overflow-hidden">
      <div className="w-1/4 min-w-[300px] max-w-[400px] h-full overflow-hidden">
        <LeftPanel 
          onGenerate={handleGenerate} 
          tasks={tasks}
          activeTaskId={activeTask?.id}
          onTaskSelect={handleTaskSelect}
          onDeleteTask={handleDeleteTask}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{taskToDelete?.title}" and remove all associated test cases and messages.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteTask}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Workspace;
