
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTask?.messages]);

  // Debug logs for messages
  useEffect(() => {
    if (activeTask?.messages) {
      console.log("Current messages:", activeTask.messages);
    }
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
    if (newMessage.trim() === "" || !activeTask || !onAddMessage) {
      console.log("Cannot send message: empty message or missing task/callback");
      return;
    }
    
    console.log("Sending message:", newMessage);
    
    // Create user message object and add to message list
    const userMessage: Omit<Message, 'id'> = {
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    // Add user message to message list
    onAddMessage(userMessage);
    
    // Clear input and set typing state
    setNewMessage("");
    setIsTyping(true);

    // Notify AI is processing changes
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

      // Add AI response to message list
      onAddMessage(aiMessage);
      setIsTyping(false);

      // If message suggests a modification, add new version
      if (userMessage.content.toLowerCase().match(/add|delete|remove|modify|update|change|priority/)) {
        const newVersionId = `${activeTask.id}-v${versions.length + 1}`;
        const newVersion: Version = {
          id: newVersionId,
          name: `Updated based on user feedback`,
          timestamp: new Date(),
          changes: `Modified test cases based on: "${userMessage.content.substring(0, 40)}${userMessage.content.length > 40 ? '...' : ''}"`
        };

        // Select new version
        if (onVersionSelect) {
          onVersionSelect(newVersionId);
        }

        toast({
          title: "Test cases updated",
          description: "Changes have been applied based on your request",
          duration: 3000,
        });
      }

      // Notify AI has completed modifications
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

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-blue-500/20 shadow-sm overflow-hidden transition-all duration-300 ease-in-out">
      <style>
        {`
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
      <div className="w-full h-full flex flex-col">
        <div className="grid mx-auto my-4">
          <div className="flex items-center gap-1 font-medium">
            <MessageCircle className="h-4 w-4" />
            <span>AI Chat</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 pt-0 overflow-hidden">
          {activeTask ? (
            <>
              <div className="message-list flex-1 overflow-y-auto">
                <div className="space-y-4" data-testid="message-container">
                  {activeTask.messages && activeTask.messages.length > 0 ? (
                    activeTask.messages.map((message, index) => (
                      <div
                        key={message.id || `msg-${index}`}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        data-testid={`message-${message.sender}-${index}`}
                      >
                        <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                            {message.sender === 'ai' ? (
                              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <Bot className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200/50 flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-3 text-sm ${
                              message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-500/10'
                            }`}
                          >
                            {message.content}
                            <div
                              className={`text-xs mt-1 ${
                                message.sender === 'user'
                                  ? 'text-white/70'
                                  : 'text-gray-500'
                              }`}
                            >
                              {formatTime(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500">
                      No messages yet. Start the conversation!
                    </div>
                  )}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex flex-row">
                        <div className="flex-shrink-0 mr-2">
                          <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <Bot className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="rounded-lg p-3 bg-blue-500/10">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-gray-400/40 animate-pulse"></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400/40 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400/40 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="input-area mt-4">
                <div className="relative">
                  <Textarea
                    placeholder="Ask AI to modify test cases..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[80px] pr-10 resize-none shadow-lg"
                  />
                  <button
                    className={`absolute right-2 bottom-2 p-2 rounded-md ${
                      newMessage.trim() === "" || isTyping
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={handleSendMessage}
                    disabled={newMessage.trim() === "" || isTyping}
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a task to view chat history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
