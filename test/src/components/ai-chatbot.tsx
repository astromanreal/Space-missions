// Ensure this component is still a client component
'use client';

import React, { useRef, useEffect, useTransition, useState } from 'react'; // Keep useState for messages
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { spaceMissionQuery, SpaceMissionQueryInput, SpaceMissionQueryOutput } from '@/ai/flows/space-mission-query';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isThinking?: boolean;
}

// Accept isOpen and setIsOpen via props
interface AIChatbotProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AIChatbot({ isOpen, setIsOpen }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasGreeted, setHasGreeted] = useState(false); // Track if initial greeting happened

  // Handle closing the chat from the 'X' button
  const handleClose = () => {
    setIsOpen(false);
  };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessageContent = input.trim();
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: userMessageContent };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const thinkingMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: thinkingMessageId, role: 'assistant', content: 'Thinking...', isThinking: true }]);


    startTransition(async () => {
      try {
        const queryInput: SpaceMissionQueryInput = { query: userMessageContent };
        const result: SpaceMissionQueryOutput = await spaceMissionQuery(queryInput);
        const assistantMessage: Message = { id: (Date.now() + 2).toString(), role: 'assistant', content: result.answer };
        setMessages((prev) => prev.map(msg => msg.id === thinkingMessageId ? assistantMessage : msg));
      } catch (error: any) {
        console.error('AI query failed:', error);
        let description = 'Sorry, I couldn\'t process that request. Please try again.';
        if (error.message?.includes('API key') || error.message?.includes('quota') || error.message?.includes('permission')) {
            description = 'Could not connect to the AI service. Please check the API key configuration and server status.';
        } else if (error.message?.includes('Mission') && error.message?.includes('not found')) {
             description = `Sorry, I couldn't find information about the mission mentioned.`;
        }
        toast.error(description);
        setMessages((prev) => prev.filter(msg => msg.id !== thinkingMessageId));
      }
    });
  };

   // Effect for initial greeting and focusing input when chat opens
   useEffect(() => {
    if (isOpen) {
      // Add initial greeting if chat is empty and hasn't greeted yet
      if (messages.length === 0 && !hasGreeted) {
        setMessages([
          { id: 'greeting', role: 'assistant', content: 'Hello! Ask me anything about space missions or technology.' }
        ]);
        setHasGreeted(true); // Mark as greeted
      }
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 100);
    }
   }, [isOpen, messages.length, hasGreeted]); // Depend on isOpen

  // Scroll to bottom when messages change or chatbot opens
  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        setTimeout(() => {
           scrollElement.scrollTop = scrollElement.scrollHeight;
        }, 0);
      }
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Chat Window - Visibility controlled by isOpen prop */}
       <Card
        className={cn(
          'fixed bottom-6 right-6 w-[90vw] max-w-md h-[70vh] max-h-[600px] z-50 flex flex-col shadow-2xl transition-all duration-300 ease-out origin-bottom-right',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none', // Control visibility via isOpen
          'bg-card/90 backdrop-blur-lg border border-border/60'
        )}
      >
         <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bot className="text-primary" /> AI Assistant
          </CardTitle>
          {/* Use handleClose for the X button */}
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close chat</span>
          </Button>
        </CardHeader>

         <CardContent className="flex-grow p-0 overflow-hidden">
           <ScrollArea className="h-full">
             <div className="space-y-4 p-4" ref={scrollAreaRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />}
                  <div
                    className={cn(
                      'p-3 rounded-lg max-w-[80%]',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-muted-foreground rounded-bl-none',
                       message.isThinking && 'italic text-muted-foreground/70'
                    )}
                  >
                    {message.isThinking ? (
                      <div className="flex items-center gap-2">
                         <Loader2 className="h-4 w-4 animate-spin" />
                         <span>Thinking...</span>
                      </div>
                    ) : (
                       message.content.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
                        const match = part.match(/\[(.*?)\]\((.*?)\)/);
                        if (match) {
                          return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:opacity-80">{match[1]}</a>;
                        }
                        return part.split('\n').map((line, lineIndex) => (
                           <React.Fragment key={`${i}-${lineIndex}`}>
                             {line}
                             {lineIndex < part.split('\n').length - 1 && <br />}
                           </React.Fragment>
                         ));
                      })
                    )}
                  </div>
                  {message.role === 'user' && <User className="h-5 w-5 text-accent mt-1 flex-shrink-0" />}
                </div>
              ))}
               <div style={{ height: '1px' }} />
             </div>
          </ScrollArea>
        </CardContent>

         <CardFooter className="p-4 border-t border-border/50">
          <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about missions..."
              className="flex-grow bg-background/70 focus:ring-accent"
              disabled={isPending}
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={isPending || !input.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90 flex-shrink-0">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
