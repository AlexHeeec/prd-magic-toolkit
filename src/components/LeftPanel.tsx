import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogAction, DialogCancel } from "@/components/ui/dialog";

interface LeftPanelProps {
  onGenerate: () => void;
  tasks: Task[];
  activeTaskId?: string;
  onTaskSelect: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void; // 新增的删除任务回调
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  onGenerate,
  tasks,
  activeTaskId,
  onTaskSelect,
  onTaskDelete
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      onTaskDelete(taskToDelete);
      toast({
        title: "successful",
        description: "The task has been deleted successfully.",
        duration: 3000
      });
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <Button onClick={onGenerate}>Generate Test Cases</Button>
      <div className="flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className={`p-3 hover:bg-accent/10 transition-colors cursor-pointer ${
              task.id === activeTaskId ? "border-primary/30 bg-primary/5" : ""
            }`}
            onClick={() => onTaskSelect(task.id)}
          >
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>{task.date}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>Are you sure you want to delete this task?</DialogDescription>
          <div className="flex justify-end space-x-2">
            <DialogCancel>Cancel</DialogCancel>
            <DialogAction onClick={confirmDeleteTask}>Delete</DialogAction>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeftPanel;
