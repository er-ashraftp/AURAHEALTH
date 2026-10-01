import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Bot,
  User,
  ShieldAlert,
  Loader2,
  ChevronDown,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { geminiService, ChatMessage } from '../../services/geminiService';

export const FloatingAIAssistant: React.FC = () => {
  const {
    isFloatingAIOpen,
    setIsFloatingAIOpen,
    floatingAIPrompt,
    patient,
    labResults,
    medications,
    todayActivity
  } = useHealth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: `Hello ${patient.name.split(' ')[0]} 👋 I'm your AuraHealth Clinical AI Assistant.\n\nI can explain your laboratory results, help you prepare for upcoming appointments, analyze health patterns, or clarify medical terminology.\n\n*Note: I provide evidence-based health education to support conversations with your doctor, not medical diagnoses.*`,
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Explain my recent cholesterol results',
        'Prepare me for my cardiologist visit',
        'Analyze my activity and sleep trends',
        'Explain my Atorvastatin medication'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentType, setAgentType] = useState<'general' | 'lab' | 'nutrition' | 'medication' | 'preventive'>('general');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down' | 'reported'>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-fill prompt if triggered externally
  useEffect(() => {
    if (floatingAIPrompt) {
      handleSendMessage(floatingAIPrompt);
    }
  }, [floatingAIPrompt]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Setup Web Speech Recognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting for cleaner voice output
    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const recentLdl = labResults.find(l => l.testName.includes('LDL'))?.value?.toString();
      const recentChol = labResults.find(l => l.testName.includes('Total'))?.value?.toString();
      const recentHba1c = labResults.find(l => l.testName.includes('HbA1c'))?.value?.toString();

      const contextData = {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        conditions: patient.chronicConditions,
        medications: medications.map(m => `${m.name} ${m.dosage}`),
        recentBP: `${todayActivity.systolicBP}/${todayActivity.diastolicBP} mmHg`,
        recentHR: `${todayActivity.restingHeartRate} bpm`,
        cholesterol: recentChol,
        ldl: recentLdl,
        hba1c: recentHba1c
      };

      const historyPayload = messages.map(m => ({ role: m.role, text: m.text }));

      const response = await geminiService.sendChat(query, historyPayload, contextData, agentType);

      const aiMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: response.reply,
        timestamp: 'Just now',
        agentType,
        suggestedFollowUps: getFollowUpsForQuery(query)
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: "I experienced a temporary communication hiccup. Please try again or rephrase your question.",
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFollowUpsForQuery = (q: string): string[] => {
    const lower = q.toLowerCase();
    if (lower.includes('cholesterol') || lower.includes('ldl')) {
      return [
        'What foods help lower LDL naturally?',
        'Does exercise impact my HDL levels?',
        'Should I ask my doctor about an ApoB test?'
      ];
    }
    if (lower.includes('doctor') || lower.includes('appointment')) {
      return [
        'Generate 5 specific questions for my doctor',
        'Summarize my health metrics since last visit',
        'What preventive tests are due for my age?'
      ];
    }
    return [
      'Explain this in simpler terms',
      'What lifestyle habits support this metric?',
      'When should I contact my healthcare provider?'
    ];
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      {!isFloatingAIOpen && (
        <button
          onClick={() => setIsFloatingAIOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 text-white font-semibold text-sm shadow-xl shadow-cyan-600/30 hover:scale-105 hover:shadow-cyan-600/40 transition-all group"
          aria-label="Open AI Health Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>
          <span className="hidden sm:inline">Ask AuraHealth AI</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono">
            Gemini 3.8
          </span>
        </button>
      )}

      {/* Floating Slide-over / Modal Panel */}
      {isFloatingAIOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[480px] h-[640px] max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-teal-900/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold">AuraHealth Clinical AI</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/30 text-cyan-200">
                    Live Assistant
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Patient context active: {patient.name} ({patient.age}y M)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSpeak(messages[messages.length - 1]?.text || '')}
                className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
                  isSpeaking ? 'text-cyan-400 animate-pulse' : 'text-slate-300'
                }`}
                title={isSpeaking ? 'Mute' : 'Read latest answer'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsFloatingAIOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Agent Persona Switcher Bar */}
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1">
              Mode:
            </span>
            {[
              { id: 'general', label: 'General Health' },
              { id: 'lab', label: 'Lab Specialist' },
              { id: 'nutrition', label: 'Nutrition Coach' },
              { id: 'medication', label: 'Meds & Rx' },
              { id: 'preventive', label: 'Preventive Care' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setAgentType(m.id as any)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-all ${
                  agentType === m.id
                    ? 'bg-cyan-600 text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Clinical Safety Disclaimer Bar */}
          <div className="px-3.5 py-1.5 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              Educational companion • Non-diagnostic
            </span>
            <span className="text-[10px] text-amber-700/70 dark:text-amber-400/70">
              In emergencies call 911 / 112
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  {/* Message Text with simple markdown formatting */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('### ')) {
                        return (
                          <h4 key={idx} className="font-bold text-slate-900 dark:text-white mt-2 mb-1 text-[13px]">
                            {line.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <div key={idx} className="flex items-start gap-1.5 my-0.5">
                            <span className="text-cyan-500 font-bold">•</span>
                            <span>{line.replace('- ', '')}</span>
                          </div>
                        );
                      }
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>

                  {/* Actions for AI responses */}
                  {msg.role === 'model' && (
                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFeedbackGiven({ ...feedbackGiven, [msg.id]: 'up' })}
                          className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${
                            feedbackGiven[msg.id] === 'up' ? 'text-emerald-500' : ''
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setFeedbackGiven({ ...feedbackGiven, [msg.id]: 'down' })}
                          className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${
                            feedbackGiven[msg.id] === 'down' ? 'text-red-500' : ''
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Suggested follow-up prompt chips */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(p)}
                          className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 text-slate-700 dark:text-slate-300 hover:text-cyan-700 transition-colors border border-slate-200 dark:border-slate-600/50"
                        >
                          {p} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-slate-400 p-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600" />
                  <span>Synthesizing clinical evidence & records...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Listening Audio Waves Indicator */}
          {isListening && (
            <div className="px-4 py-2 bg-cyan-500/10 border-t border-cyan-500/20 flex items-center justify-between text-xs text-cyan-700 dark:text-cyan-300">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-semibold">Listening to your voice... Speak now</span>
              </div>
              <div className="flex items-center gap-0.5">
                {[4, 10, 6, 12, 8, 14, 5].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-cyan-500 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isListening ? 'Stop listening' : 'Speak your question'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about labs, symptoms, medications, or diet..."
                className="flex-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white disabled:opacity-40 transition-all shadow-md shadow-cyan-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
