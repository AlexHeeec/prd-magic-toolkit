import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, History, Send, Bot, User, Trash, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Task, Message, Version } from "./Workspace";

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
  versions?: Version[];
  activeVersionId?: string;
  onVersionSelect?: (versionId: string) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  isGenerating = false,
  onAiModifying,
  activeTask,
  onAddMessage,
  versions = [],
  activeVersionId,
  onVersionSelect
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
        const newVersionId = `${activeTask.id}-v${versions.length + 1}`;
        const newVersion: Version = {
          id: newVersionId,
          name: `Updated based on user feedback`,
          timestamp: new Date(),
          changes: `Modified test cases based on: "${userMessage.content.substring(0, 40)}${userMessage.content.length > 40 ? '...' : ''}"`
        };

        // Select the new version if onVersionSelect is provided
        if (onVersionSelect) {
          onVersionSelect(newVersionId);
        }

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

  const handleVersionClick = (versionId: string) => {
    if (onVersionSelect) {
      onVersionSelect(versionId);
    }
  };

  return (
    <div className="panel-transition w-full h-full flex flex-col bg-white rounded-xl border border-primary/20 shadow-sm overflow-hidden">
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

        <TabsContent value="chat" className="flex-1 flex flex-col p-4 pt-0 h-full overflow-hidden">
          {activeTask ? (
            <div className="flex flex-col h-full">
              {/* 聊天内容区域，可滚动 */}
              <div className="flex-1 overflow-y-auto pr-4 py-4">
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
              </div>
              {/* 输入框和发送按钮区域，固定在底部 */}
              <div className="pt-3 relative flex-shrink-0">
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
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a task to view chat history
            </div>
          )}
        </TabsContent>

        <TabsContent value="versions" className="flex-1 flex flex-col p-4 pt-0 h-full overflow-hidden">
          {activeTask ? (
            <ScrollArea className="h-[calc(100vh-200px)] pr-4 py-4">
              <div className="space-y-3">
                {versions.map((version) => (
                  <Card
                    key={version.id}
                    className={`p-3 hover:bg-accent/10 transition-colors cursor-pointer ${version.id === activeVersionId ? 'border-primary/30 bg-primary/5' : ''}`}
                    onClick={() => handleVersionClick(version.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium">{version.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(version.timestamp)} at {formatTime(version.timestamp)}</p>
                        <p className="text-xs mt-2">{version.changes}</p>
                      </div>
                      <div className="flex space-x-1">
                        {version.id === activeVersionId && (
                          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">Current</Badge>
                        )}
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
