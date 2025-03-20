import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, History, Send, Bot, User, Trash, RotateCcw, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Task, Message } from "./Workspace";

interface Version {
  id: string;
  name: string;
  timestamp: Date;
  changes: string;
}
// Mock versions data for each task
const taskVersionsMap: { [key: string]: Version[] } = {
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

// Sample AI responses based on user input
const getAIResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  if (input.includes("add") && (input.includes("test") || input.includes("case"))) {
    return "I've added new test cases based on your request. You can see them in the test case panel.";
  } else if (input.includes("delete") || input.includes("remove")) {
    return "I've removed the specified test cases from the list. Is there anything else you'd like me to modify?";
  } else if (input.includes("modify") || input.includes("update") || input.includes("change")) {
    return "I've updated the test cases according to your specifications. The changes are now reflected in the test case panel.";
  } else if (input.includes("priority")) {
    return "I've adjusted the priority levels for the test cases you mentioned. You can filter by priority to see the changes.";
  } else {
    return "I understand your request. I'll analyze and process it to modify the test cases accordingly. Is there anything specific you'd like me to focus on?";
  }
};

interface RightPanelProps {
  isGenerating?: boolean;
  onAiModifying?: (isModifying: boolean) => void;
  activeTask?: Task;
  onAddMessage?: (message: Omit<Message, 'id'>) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ 
  isGenerating = false, 
  onAiModifying,
  activeTask,
  onAddMessage
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Update versions when activeTask changes
  useEffect(() => {
    if (activeTask) {
      setVersions(taskVersionsMap[activeTask.id] || []);
    } else {
      setVersions([]);
    }
  }, [activeTask]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeTask?.messages]);

  // Show loading state when test cases are being generated
  useEffect(() => {
    if (isGenerating && activeTask && onAddMessage) {
      const generatingMessage: Omit<Message, 'id'> = {
        content: "Generating test cases based on the provided input...",
        sender: "ai",
        timestamp: new Date(),
      };
      
      onAddMessage(generatingMessage);
      setIsTyping(true);
      
      // Reset typing indicator when generation is complete
      return () => {
        setIsTyping(false);
      };
    }
  }, [isGenerating, activeTask, onAddMessage]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !activeTask || !onAddMessage) return;
    
    const userMessage: Omit<Message, 'id'> = {
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    onAddMessage(userMessage);
    setNewMessage("");
    setIsTyping(true);
    
    // Call the onAiModifying callback to indicate AI is processing changes
    if (onAiModifying) {
      onAiModifying(true);
    }
    
    // Simulate AI processing and response
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage.content);
      
      const aiMessage: Omit<Message, 'id'> = {
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      
      onAddMessage(aiMessage);
      setIsTyping(false);
      
      // Add a new version if the message suggests modifications were made
      if (userMessage.content.toLowerCase().match(/add|delete|remove|modify|update|change|priority/)) {
        const newVersion: Version = {
          id: `${activeTask.id}-v${versions.length + 1}`,
          name: `Updated based on user feedback`,
          timestamp: new Date(),
          changes: `Modified test cases based on: "${userMessage.content.substring(0, 40)}${userMessage.content.length > 40 ? '...' : ''}"`
        };
        
        setVersions((prev) => [...prev, newVersion]);
        
        toast({
          title: "Test cases updated",
          description: "Changes have been applied based on your request",
          duration: 3000,
        });
      }
      
      // Notify that AI has finished modifying
      if (onAiModifying) {
        onAiModifying(false);
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleRestoreVersion = (version: Version) => {
    // Indicate that AI is modifying test cases
    if (onAiModifying) {
      onAiModifying(true);
    }
    
    // Simulate restoration time
    setTimeout(() => {
      toast({
        title: `Restored to "${version.name}"`,
        description: "The test cases have been reverted to this version",
        duration: 3000,
      });
      
      // Notify that AI has finished modifying
      if (onAiModifying) {
        onAiModifying(false);
      }
    }, 1000);
  };

  return (
    <div className="panel-transition w-full h-full flex flex-col bg-white rounded-xl border border-primary/20 shadow-sm">
      <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
        <TabsList className="grid grid-cols-2 m-4 mb-0">
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>AI Chat</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span>Versions</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col p-4 pt-0 h-full">
          {activeTask ? (
            <>
              <ScrollArea className="flex-1 pr-4 py-4">
                <div className="space-y-4">
                  {activeTask.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                          {message.sender === 'ai' ? (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-secondary/50">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <div 
                          className={`rounded-lg p-3 text-sm ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-accent/50'
                          }`}
                        >
                          {message.content}
                          <div 
                            className={`text-xs mt-1 ${
                              message.sender === 'user' 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex flex-row">
                        <div className="flex-shrink-0 mr-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="rounded-lg p-3 bg-accent/50">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse"></div>
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="pt-3 relative">
                <Textarea
                  placeholder="Ask AI to modify test cases..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[80px] pr-10 resize-none"
                />
                <Button
                  size="icon"
                  className="absolute right-2 bottom-2"
                  onClick={handleSendMessage}
                  disabled={newMessage.trim() === "" || isTyping}
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a task to view chat history
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="versions" className="flex-1 flex flex-col p-4 pt-0 h-full">
          {activeTask ? (
            <ScrollArea className="flex-1 pr-4 py-4">
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <Card 
                    key={version.id}
                    className={`p-3 hover:bg-accent/10 transition-colors cursor-pointer ${index === versions.length - 1 ? 'border-primary/30 bg-primary/5' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium">{version.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(version.timestamp)} at {formatTime(version.timestamp)}</p>
                        <p className="text-xs mt-2">{version.changes}</p>
                      </div>
                      <div className="flex space-x-1">
                        {index === versions.length - 1 && (
                          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">Current</Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleRestoreVersion(version)}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span className="sr-only">Restore</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a task to view versions
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPanel;
