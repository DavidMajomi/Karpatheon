'use client'

import { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Good evening. I'm your Karpatheon knowledge assistant. I have deep context on your 127 explored topics and understand your learning patterns. What would you like to explore today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput('')

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Based on your previous explorations in machine learning and your preference for technical depth, I can help you understand this concept through the lens of neural network architectures you've already mastered. Would you like me to draw connections to your existing knowledge graph?",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-10 w-10 border border-primary/20 bg-primary/10">
                  <AvatarFallback className="bg-transparent">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                    ? 'bg-primary/10 text-foreground border border-primary/20'
                    : 'bg-muted/50 text-foreground border border-border/50'
                  }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="mt-2 block text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {message.role === 'user' && (
                <Avatar className="h-10 w-10 border border-border/50 bg-muted/50">
                  <AvatarFallback className="bg-transparent text-xs font-semibold text-foreground">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-background/50 p-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask me anything about your knowledge domains..."
              className="min-h-[60px] resize-none border-border/50 bg-background/50 focus-visible:ring-primary/20"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="h-[60px] w-[60px] shrink-0 bg-primary text-background hover:bg-primary/90"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
