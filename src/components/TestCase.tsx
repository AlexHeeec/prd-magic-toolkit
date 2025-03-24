
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Copy, Trash, CheckCircle, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export interface TestCaseProps {
  id: string;
  title: string;
  preconditions: string[];
  steps: string[];
  expectedResults: string[];
  scenario: string;
  priority: "high" | "medium" | "low";
}

const TestCase: React.FC<TestCaseProps> = ({
  id,
  title,
  preconditions,
  steps,
  expectedResults,
  scenario,
  priority,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsVisible(false);
      toast({
        title: "Test case deleted",
        description: `"${title}" has been deleted successfully.`,
      });
    }, 300);
  };

  if (!isVisible) return null;

  const priorityColor = {
    high: "destructive",
    medium: "default",
    low: "secondary",
  };

  return (
    <>
      <Card className={`w-full transition-all duration-300 overflow-hidden ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} hover:shadow-md border-primary/10`}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="p-4 pb-2 bg-white">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">{title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={priorityColor[priority] as any}>
                    {priority === "high" ? (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    ) : priority === "low" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : null}
                    {priority}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-1">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-primary hover:bg-primary/10">
                    {isOpen ? (
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-primary hover:bg-primary/10">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="h-4 w-4 mr-2" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Copy className="h-4 w-4 mr-2" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleDeleteClick}>
                      <Trash className="h-4 w-4 mr-2" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-primary mb-1">Preconditions</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {preconditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-primary mb-1">Steps</h4>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    {steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-primary mb-1">Expected Results</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {expectedResults.map((result, index) => (
                      <li key={index}>{result}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test Case</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TestCase;
