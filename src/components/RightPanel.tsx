
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, History, Send, Bot, User, Trash, RotateCcw } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Version {
  id: string;
  name: string;
  timestamp: Date;
  changes: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    content: "I've analyzed your PRD and generated test cases focusing on the authentication and profile management scenarios.",
    sender: "ai",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "2",
    content: "Can you add more test cases for the payment processing flow?",
    sender: "user",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: "3",
    content: "I've added 5 new test cases covering the payment processing flow, including credit card validation, payment confirmation, and error handling scenarios.",
    sender: "ai",
    timestamp: new Date(Date.now() - 30000),
  }
];

const mockVersions: Version[] = [
  {
    id: "1",
    name: "Initial Version",
    timestamp: new Date(Date.now() - 3600000),
    changes: "Generated 25 test cases from PRD"
  },
  {
    id: "2",
    name: "Added Authentication Tests",
    timestamp: new Date(Date.now() - 2400000),
    changes: "Added 5 test cases for authentication flows"
  },
  {
    id: "3",
    name: "Payment Processing Tests",
    timestamp: new Date(Date.now() - 1200000),
    changes: "Added 5 test cases for payment processing"
  }
];

const RightPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [versions, setVersions] = useState<Version[]>(mockVersions);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm analyzing your request. I'll update the test cases accordingly.",
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
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

  return (
    <div className="panel-transition w-full h-full flex flex-col bg-sidebar rounded-xl">
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
          <ScrollArea className="flex-1 pr-4 py-4">
            <div className="space-y-4">
              {messages.map((message) => (
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
              disabled={newMessage.trim() === ""}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="versions" className="flex-1 flex flex-col p-4 pt-0 h-full">
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
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span className="sr-only">Restore</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPanel;
