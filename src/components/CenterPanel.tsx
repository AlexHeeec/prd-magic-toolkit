import React, { useState, useEffect } from "react";
import TestCase, { TestCaseProps } from "./TestCase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, BarChart2, History } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Task } from "./Workspace";
import { exportTestCasesToExcel } from "@/utils/excelExport";

// Task test cases for each version
interface VersionTestCases {
  [versionId: string]: TestCaseProps[];
}

// Mock test case data for each task (base versions)
const taskTestCasesMap: { [key: string]: TestCaseProps[] } = {
  "1": [
    {
      id: "1-tc1",
      title: "Verify User Login with Valid Credentials",
      preconditions: ["User has registered an account", "User has a valid username and password"],
      steps: [
        "Navigate to the login page",
        "Enter valid username",
        "Enter valid password",
        "Click on login button"
      ],
      expectedResults: [
        "User should be logged in successfully",
        "User should be redirected to the dashboard",
        "Welcome message should be displayed"
      ],
      scenario: "Authentication",
      priority: "high"
    },
    {
      id: "1-tc2",
      title: "Check Password Reset Functionality",
      preconditions: ["User has registered an account"],
      steps: [
        "Navigate to the login page",
        "Click on 'Forgot Password' link",
        "Enter registered email",
        "Submit the form",
        "Check email for reset link",
        "Click on the reset link",
        "Enter new password",
        "Confirm new password",
        "Submit the form"
      ],
      expectedResults: [
        "Password reset email should be sent",
        "User should be able to reset password",
        "User should be able to login with new password"
      ],
      scenario: "Authentication",
      priority: "medium"
    },
    {
      id: "1-tc3",
      title: "Validate User Registration Form",
      preconditions: ["Registration page is accessible"],
      steps: [
        "Navigate to registration page",
        "Enter invalid email format",
        "Enter password less than 8 characters",
        "Submit the form"
      ],
      expectedResults: [
        "Form submission should fail",
        "Error message for invalid email should be displayed",
        "Error message for password length should be displayed"
      ],
      scenario: "Registration",
      priority: "medium"
    },
  ],
  "2": [
    {
      id: "2-tc1",
      title: "Verify Credit Card Payment",
      preconditions: ["User is logged in", "User has items in cart"],
      steps: [
        "Navigate to checkout page",
        "Select credit card payment method",
        "Enter valid credit card details",
        "Submit payment"
      ],
      expectedResults: [
        "Payment should be processed successfully",
        "Order confirmation page should be displayed",
        "Confirmation email should be sent to the user"
      ],
      scenario: "Payment",
      priority: "high"
    },
    {
      id: "2-tc2",
      title: "Handle Payment Failure",
      preconditions: ["User is logged in", "User has items in cart"],
      steps: [
        "Navigate to checkout page",
        "Select credit card payment method",
        "Enter invalid credit card details",
        "Submit payment"
      ],
      expectedResults: [
        "Payment should fail",
        "Error message should be displayed",
        "User should be able to retry payment"
      ],
      scenario: "Payment",
      priority: "high"
    },
  ],
  "3": [
    {
      id: "3-tc1",
      title: "Verify Profile Information Update",
      preconditions: ["User is logged in", "User is on the profile page"],
      steps: [
        "Click on 'Edit Profile' button",
        "Update name, email, and bio",
        "Click on 'Save Changes' button"
      ],
      expectedResults: [
        "Profile should be updated successfully",
        "Success message should be displayed",
        "Updated information should be visible on the profile page"
      ],
      scenario: "Profile Management",
      priority: "medium"
    },
  ],
  "4": [
    {
      id: "4-tc1",
      title: "Test User Logout Functionality",
      preconditions: ["User is logged in"],
      steps: [
        "Click on the user avatar",
        "Select 'Logout' option from the dropdown"
      ],
      expectedResults: [
        "User should be logged out",
        "User should be redirected to the login page",
        "Session should be invalidated"
      ],
      scenario: "Authentication",
      priority: "low"
    },
  ],
};

// Mock test case data for specific versions
const taskVersionTestCasesMap: { [key: string]: VersionTestCases } = {
  "1": {
    "1-v1": [
      {
        id: "1-tc1-v1",
        title: "Verify User Login with Valid Credentials",
        preconditions: ["User has registered an account", "User has a valid username and password"],
        steps: [
          "Navigate to the login page",
          "Enter valid username",
          "Enter valid password",
          "Click on login button"
        ],
        expectedResults: [
          "User should be logged in successfully",
          "User should be redirected to the dashboard",
          "Welcome message should be displayed"
        ],
        scenario: "Authentication",
        priority: "high"
      },
      {
        id: "1-tc2-v1",
        title: "Check Password Reset Functionality",
        preconditions: ["User has registered an account"],
        steps: [
          "Navigate to the login page",
          "Click on 'Forgot Password' link",
          "Enter registered email",
          "Submit the form"
        ],
        expectedResults: [
          "Password reset email should be sent",
          "User should receive a confirmation message"
        ],
        scenario: "Authentication",
        priority: "low"
      },
    ],
    "1-v2": [
      {
        id: "1-tc1-v2",
        title: "Verify User Login with Valid Credentials",
        preconditions: ["User has registered an account", "User has a valid username and password"],
        steps: [
          "Navigate to the login page",
          "Enter valid username",
          "Enter valid password",
          "Click on login button"
        ],
        expectedResults: [
          "User should be logged in successfully",
          "User should be redirected to the dashboard",
          "Welcome message should be displayed"
        ],
        scenario: "Authentication",
        priority: "high"
      },
      {
        id: "1-tc2-v2",
        title: "Check Password Reset Functionality",
        preconditions: ["User has registered an account"],
        steps: [
          "Navigate to the login page",
          "Click on 'Forgot Password' link",
          "Enter registered email",
          "Submit the form",
          "Check email for reset link",
          "Click on the reset link",
          "Enter new password",
          "Confirm new password",
          "Submit the form"
        ],
        expectedResults: [
          "Password reset email should be sent",
          "User should be able to reset password",
          "User should be able to login with new password"
        ],
        scenario: "Authentication",
        priority: "medium"
      },
      {
        id: "1-tc3-v2",
        title: "Validate User Registration Form",
        preconditions: ["Registration page is accessible"],
        steps: [
          "Navigate to registration page",
          "Enter invalid email format",
          "Enter password less than 8 characters",
          "Submit the form"
        ],
        expectedResults: [
          "Form submission should fail",
          "Error message for invalid email should be displayed",
          "Error message for password length should be displayed"
        ],
        scenario: "Registration",
        priority: "medium"
      },
    ]
  },
  "2": {
    "2-v1": [
      {
        id: "2-tc1-v1",
        title: "Verify Credit Card Payment",
        preconditions: ["User is logged in", "User has items in cart"],
        steps: [
          "Navigate to checkout page",
          "Select credit card payment method",
          "Enter valid credit card details",
          "Submit payment"
        ],
        expectedResults: [
          "Payment should be processed successfully",
          "Order confirmation page should be displayed"
        ],
        scenario: "Payment",
        priority: "high"
      },
    ],
    "2-v2": [
      {
        id: "2-tc1-v2",
        title: "Verify Credit Card Payment",
        preconditions: ["User is logged in", "User has items in cart"],
        steps: [
          "Navigate to checkout page",
          "Select credit card payment method",
          "Enter valid credit card details",
          "Submit payment"
        ],
        expectedResults: [
          "Payment should be processed successfully",
          "Order confirmation page should be displayed",
          "Confirmation email should be sent to the user"
        ],
        scenario: "Payment",
        priority: "high"
      },
      {
        id: "2-tc2-v2",
        title: "Handle Payment Failure",
        preconditions: ["User is logged in", "User has items in cart"],
        steps: [
          "Navigate to checkout page",
          "Select credit card payment method",
          "Enter invalid credit card details",
          "Submit payment"
        ],
        expectedResults: [
          "Payment should fail",
          "Error message should be displayed",
          "User should be able to retry payment"
        ],
        scenario: "Payment",
        priority: "high"
      },
    ]
  }
};

interface CenterPanelProps {
  isGenerating?: boolean;
  isAiModifying?: boolean;
  activeTask?: Task;
  activeVersionId?: string;
}

const CenterPanel: React.FC<CenterPanelProps> = ({ 
  isGenerating = false, 
  isAiModifying = false,
  activeTask,
  activeVersionId
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priority, setPriority] = useState<string>("all");
  const [testCases, setTestCases] = useState<TestCaseProps[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating || isAiModifying) {
      setTestCases([]);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            if (activeTask) {
              // Load the most recent test cases when generating or modifying
              setTestCases(taskTestCasesMap[activeTask.id] || []);
            }
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      if (activeTask) {
        if (activeVersionId) {
          // If a version is selected, use the test cases for that version
          const versionTestCases = 
            taskVersionTestCasesMap[activeTask.id]?.[activeVersionId] || 
            taskTestCasesMap[activeTask.id] || [];
          setTestCases(versionTestCases);
        } else {
          // Otherwise, use the most recent test cases
          setTestCases(taskTestCasesMap[activeTask.id] || []);
        }
      } else {
        setTestCases([]);
      }
      setProgress(100);
    }
  }, [isGenerating, isAiModifying, activeTask, activeVersionId]);

  const filteredTestCases = testCases.filter((testCase) => {
    const matchesSearch = searchTerm === "" || 
      testCase.title.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesPriority = priority === "all" || 
      testCase.priority === priority;
      
    return matchesSearch && matchesPriority;
  });

  const handleExport = () => {
    if (filteredTestCases.length === 0) return;
    
    const versionSuffix = activeVersionId ? `-${activeVersionId}` : '';
    const filename = `test-cases-${activeTask?.title || 'all'}${versionSuffix}-${new Date().toISOString().split('T')[0]}.xlsx`;
    exportTestCasesToExcel(filteredTestCases, filename);
  };
  
  return (
    <div className="panel-transition w-full h-full p-4 flex flex-col white-panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">
          {activeTask ? (
            <div className="flex items-center">
              <span>{`Test Cases: ${activeTask.title}`}</span>
              {activeVersionId && (
                <Badge variant="outline" className="ml-2 bg-primary/5 border-primary/20">
                  <History className="h-3 w-3 mr-1" />
                  Version: {activeVersionId.split('-v')[1] || activeVersionId}
                </Badge>
              )}
            </div>
          ) : 'Test Cases'}
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-primary/30 hover:bg-primary/10 text-primary"
            onClick={handleExport}
            disabled={filteredTestCases.length === 0}
          >
            <FileDown className="h-4 w-4 mr-1" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {(isGenerating || isAiModifying || progress < 100) ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-full max-w-xs">
            <Progress value={progress} className="h-2" />
          </div>
          <p className="text-muted-foreground">
            {isGenerating ? "Generating test cases..." : "Updating test cases..."}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search test cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-8 w-[180px]">
                <div className="flex items-center">
                  <BarChart2 className="h-3.5 w-3.5 mr-1" />
                  <SelectValue placeholder="Priority" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {activeVersionId && (
            <div className="rounded-md border bg-primary/5 px-4 py-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <History className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary">Viewing Historical Version</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Version ID: {activeVersionId}
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md border bg-muted/10 px-4 py-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Summary:</span>
              </div>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <span className="font-medium">{testCases.length}</span>
                  <span className="text-muted-foreground ml-1">total cases</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{testCases.filter(tc => tc.priority === 'high').length}</span>
                  <span className="text-muted-foreground ml-1">high priority</span>
                </div>
              </div>
            </div>
          </div>
          
          {filteredTestCases.length > 0 ? (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3 pb-4">
                {filteredTestCases.map((testCase) => (
                  <TestCase key={testCase.id} {...testCase} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <p className="text-muted-foreground">
                {activeTask ? 'No test cases found matching your filters.' : 'Select a task to view test cases.'}
              </p>
              {activeTask && (
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => {
                    setSearchTerm("");
                    setPriority("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CenterPanel;
