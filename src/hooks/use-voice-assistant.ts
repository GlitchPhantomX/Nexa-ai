'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface UseVoiceAssistantProps {
  agentId?: string;
}

export const useVoiceAssistant = ({ agentId }: UseVoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        await handleSend(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
        console.warn('Speech Recognition API not supported in this browser.');
    }
  }, []);

  const speak = (text: string) => {
    if (typeof window === 'undefined') return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: customize voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        // Try to find a nice female voice or just use default
        utterance.voice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0];
    }

    window.speechSynthesis.speak(utterance);
  };

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isProcessing) {
      // Stop synthesis if it's speaking
      window.speechSynthesis.cancel();
      
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  }, [isListening, isProcessing]);

  const handleSend = async (text: string) => {
    if (!text || isProcessing || !agentId) return;

    setIsProcessing(true);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, agentId }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: 'ai', content: data.response }]);
        speak(data.response);
      } else if (data.error) {
          console.error('AI Error:', data.error);
          setMessages((prev) => [...prev, { role: 'ai', content: `Error: ${data.error}` }]);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isListening,
    isProcessing,
    transcript,
    messages,
    startListening,
    speak,
  };
};
