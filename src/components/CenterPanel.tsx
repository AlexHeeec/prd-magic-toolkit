
import React, { useState, useEffect } from "react";
import TestCase, { TestCaseProps } from "./TestCase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Filter, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock test case data
const mockTestCases: TestCaseProps[] = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
  {
    id: "4",
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
  {
    id: "5",
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
  }
];

interface CenterPanelProps {
  isGenerating?: boolean;
  isAiModifying?: boolean;
}

const CenterPanel: React.FC<CenterPanelProps> = ({ isGenerating = false, isAiModifying = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scenario, setScenario] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [testCases, setTestCases] = useState<TestCaseProps[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating || isAiModifying) {
      if (isGenerating) {
        setTestCases([]);
      }
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTestCases(mockTestCases);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setTestCases(mockTestCases);
      setProgress(100);
    }
  }, [isGenerating, isAiModifying]);

  const filteredTestCases = testCases.filter((testCase) => {
    const matchesSearch = searchTerm === "" || 
      testCase.title.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesScenario = scenario === "" || 
      testCase.scenario === scenario;
      
    const matchesPriority = priority === "" || 
      testCase.priority === priority;
      
    return matchesSearch && matchesScenario && matchesPriority;
  });
  
  const scenarios = Array.from(new Set(testCases.map(tc => tc.scenario)));
  
  return (
    <div className="panel-transition w-full h-full p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Test Cases</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
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
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger className="h-8 w-[180px]">
                <div className="flex items-center">
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  <SelectValue placeholder="Scenario" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Scenarios</SelectItem>
                {scenarios.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-8 w-[180px]">
                <div className="flex items-center">
                  <BarChart2 className="h-3.5 w-3.5 mr-1" />
                  <SelectValue placeholder="Priority" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
                  <span className="font-medium">{scenarios.length}</span>
                  <span className="text-muted-foreground ml-1">scenarios</span>
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
              <p className="text-muted-foreground">No test cases found matching your filters.</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => {
                  setSearchTerm("");
                  setScenario("");
                  setPriority("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CenterPanel;
