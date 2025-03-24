import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Copy, Trash, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TableRow, TableCell } from "@/components/ui/table";

export interface TestCaseProps {
  id: string;
  title: string;
  preconditions: string[];
  steps: string[];
  expectedResults: string[];
  scenario: string;
  priority: "high" | "medium" | "low";
  viewType?: "card" | "list";
  onUpdate?: (id: string, updatedTestCase: Partial<TestCaseProps>) => void;
}

const TestCase: React.FC<TestCaseProps> = ({
  id,
  title,
  preconditions,
  steps,
  expectedResults,
  scenario,
  priority,
  viewType = "card",
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  // Edit state
  const [editTitle, setEditTitle] = useState(title);
  const [editPreconditions, setEditPreconditions] = useState(preconditions.join('\n'));
  const [editSteps, setEditSteps] = useState(steps.join('\n'));
  const [editExpectedResults, setEditExpectedResults] = useState(expectedResults.join('\n'));
  const [editPriority, setEditPriority] = useState<"high" | "medium" | "low">(priority);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset form values to current values when opening the dialog
    setEditTitle(title);
    setEditPreconditions(preconditions.join('\n'));
    setEditSteps(steps.join('\n'));
    setEditExpectedResults(expectedResults.join('\n'));
    setEditPriority(priority);
    
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (onUpdate) {
      const updatedTestCase = {
        title: editTitle,
        preconditions: editPreconditions.split('\n').filter(line => line.trim() !== ''),
        steps: editSteps.split('\n').filter(line => line.trim() !== ''),
        expectedResults: editExpectedResults.split('\n').filter(line => line.trim() !== ''),
        priority: editPriority,
      };
      
      onUpdate(id, updatedTestCase);
      
      toast({
        title: "Test case updated",
        description: "The test case has been updated successfully.",
      });
    }
    
    setShowEditDialog(false);
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

  // Render as a list item
  if (viewType === "list") {
    return (
      <>
        <TableRow className={`transition-all duration-300 ${isDeleting ? 'opacity-0' : 'opacity-100'}`}>
          <TableCell>
            <div className="font-medium max-w-[380px] truncate">{title}</div>
          </TableCell>
          <TableCell>
            <Badge variant={priorityColor[priority] as any} className="whitespace-nowrap">
              {priority === "high" ? (
                <AlertCircle className="h-3 w-3 mr-1" />
              ) : priority === "low" ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : null}
              {priority}
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-primary hover:bg-primary/10"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-primary hover:bg-primary/10">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>
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
          </TableCell>
        </TableRow>
        {isOpen && (
          <TableRow>
            <TableCell colSpan={3} className="pb-4">
              <div className="bg-muted/20 rounded-md p-3 mt-2 space-y-3 border border-border/50">
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
            </TableCell>
          </TableRow>
        )}

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

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Test Case</DialogTitle>
              <DialogDescription>
                Make changes to the test case details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={editPriority} 
                  onValueChange={(value: "high" | "medium" | "low") => setEditPriority(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="preconditions">Preconditions (one per line)</Label>
                <Textarea
                  id="preconditions"
                  value={editPreconditions}
                  onChange={(e) => setEditPreconditions(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="steps">Steps (one per line)</Label>
                <Textarea
                  id="steps"
                  value={editSteps}
                  onChange={(e) => setEditSteps(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="expected-results">Expected Results (one per line)</Label>
                <Textarea
                  id="expected-results"
                  value={editExpectedResults}
                  onChange={(e) => setEditExpectedResults(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Render as a card (original view)
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
                    <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Test Case</DialogTitle>
            <DialogDescription>
              Make changes to the test case details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={editPriority} 
                onValueChange={(value: "high" | "medium" | "low") => setEditPriority(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="preconditions">Preconditions (one per line)</Label>
              <Textarea
                id="preconditions"
                value={editPreconditions}
                onChange={(e) => setEditPreconditions(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="steps">Steps (one per line)</Label>
              <Textarea
                id="steps"
                value={editSteps}
                onChange={(e) => setEditSteps(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="expected-results">Expected Results (one per line)</Label>
              <Textarea
                id="expected-results"
                value={editExpectedResults}
                onChange={(e) => setEditExpectedResults(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestCase;
