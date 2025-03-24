
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
  const [messageHistory, setMessageHistory] = useState<string[]>([]);

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

    // Add message to history
    setMessageHistory(prev => [...prev, newMessage]);

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
      <style>
        {`
          .panel-transition {
            display: flex;
            flex-direction: column;
            min-height: 0; /* 修复Safari浏览器滚动问题 */
          }
          .TabsContent {
            contain: strict; /* 优化渲染性能 */
            overscroll-behavior: contain; /* 防止滚动穿透 */
          }
          .message-list {
            flex: 1;
            overflow-y: auto;
            overscroll-behavior: contain;
          }
          .input-area {
            position: sticky;
            bottom: 0;
            background-color: white;
            padding: 1rem;
            box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
        <TabsList className="grid grid-cols-2 mx-auto my-4 w-48">
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>AI Chat</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col p-4 pt-0 overflow-hidden TabsContent">
          {activeTask ? (
            <>
              <ScrollArea className="message-list flex-1">
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

              <div className="input-area mt-4">
                <div className="relative">
                  <Textarea
                    placeholder="Ask AI to modify test cases..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[80px] pr-10 resize-none shadow-lg"
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a task to view chat history
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="flex-1 flex flex-col p-4 pt-0 overflow-hidden TabsContent">
          <ScrollArea className="flex-1">
            {messageHistory.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-medium text-sm mb-4">Your Message History</h3>
                {messageHistory.map((message, index) => (
                  <Card key={index} className="p-3 text-sm">
                    <div className="flex gap-2 items-start">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-secondary/50 text-xs">
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        {message}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                No message history yet
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPanel;
