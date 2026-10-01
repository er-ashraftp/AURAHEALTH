import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
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
  ShieldCheck,
  Loader2,
  Copy,
  Check,
  Stethoscope,
  Activity,
  FileText,
  Apple,
  Pill,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { geminiService, ChatMessage } from '../../services/geminiService';
import { SafetyBanner } from '../common/SafetyBanner';

export const AIDoctorView: React.FC = () => {
  const { patient, labResults, medications, todayActivity } = useHealth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'doctor-intro-1',
      role: 'model',
      text: `Hello ${patient.name.split(' ')[0]} 👋 I am your dedicated AuraHealth Clinical AI Assistant.\n\nI am configured with your complete health profile:\n- **Recent Biomarkers**: LDL 138 mg/dL (Improving), Total Cholesterol 218 mg/dL, Fasting Glucose 94 mg/dL, HbA1c 5.6%.\n- **Cardiovascular**: Resting HR 71 bpm, Blood Pressure 124/82 mmHg.\n- **Active Medications**: Atorvastatin 10mg daily, Vitamin D3 2,000 IU.\n\nHow can I help you today? You can select any quick clinical prompt below or type your medical question.`,
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Explain my recent cholesterol & LDL numbers',
        'Prepare me for my upcoming visit with Dr. Sarah Jenkins',
        'Are my occasional tension headaches linked to my vitals?',
        'What foods support healthy arterial endothelial function?'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentType, setAgentType] = useState<'general' | 'lab' | 'nutrition' | 'medication' | 'preventive'>('general');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, string>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Setup Web Speech Recognition
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
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

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
    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 350);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customPrompt?: string) => {
    const query = customPrompt || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
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
        id: `ai-${Date.now()}`,
        role: 'model',
        text: response.reply,
        timestamp: 'Just now',
        agentType,
        suggestedFollowUps: [
          'What lifestyle modifications can I implement this week?',
          'What questions should I ask my doctor about this?',
          'How does this interact with my daily medication routine?'
        ]
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: 'Unable to reach the clinical AI service right now. Please try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header and Agent Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AuraHealth AI Clinical Intelligence
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300">
              Interactive Workspace
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time evidence-based reasoning anchored to your diagnostic records and biometrics.
          </p>
        </div>

        {/* Voice Readout Toggle */}
        <button
          onClick={() => handleSpeak(messages[messages.length - 1]?.text || '')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            isSpeaking
              ? 'bg-cyan-50 dark:bg-cyan-950 border-cyan-500 text-cyan-600 animate-pulse'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isSpeaking ? 'Stop Audio' : 'Listen to Last Answer'}</span>
        </button>
      </div>

      {/* Agent Role Pills */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-2">
          Specialty:
        </span>
        {[
          { id: 'general', label: 'Primary Care & General', icon: Stethoscope },
          { id: 'lab', label: 'Diagnostic Lab Specialist', icon: Activity },
          { id: 'nutrition', label: 'Metabolic & Nutrition', icon: Apple },
          { id: 'medication', label: 'Pharmacotherapy & Meds', icon: Pill },
          { id: 'preventive', label: 'Preventive Longevity', icon: ShieldCheck }
        ].map((agent) => {
          const Icon = agent.icon;
          const isActive = agentType === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setAgentType(agent.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{agent.label}</span>
            </button>
          );
        })}
      </div>

      {/* Safety Notice */}
      <SafetyBanner compact />

      {/* Main Chat Conversation Container */}
      <div className="h-[520px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-900/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs leading-relaxed space-y-3 shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-tl-none'
                }`}
              >
                {/* Formatted Message Body */}
                <div className="space-y-1.5 whitespace-pre-wrap font-sans">
                  {msg.text.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return (
                        <h4 key={idx} className="font-bold text-slate-900 dark:text-white mt-3 mb-1 text-[13px] first:mt-0">
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

                {/* Footer Controls for Model Answers */}
                {msg.role === 'model' && (
                  <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 font-medium"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy response
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFeedbackState({ ...feedbackState, [msg.id]: 'up' })}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          feedbackState[msg.id] === 'up' ? 'text-emerald-500' : ''
                        }`}
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFeedbackState({ ...feedbackState, [msg.id]: 'down' })}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          feedbackState[msg.id] === 'down' ? 'text-red-500' : ''
                        }`}
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
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
                        onClick={() => handleSend(p)}
                        className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 text-slate-700 dark:text-slate-300 hover:text-cyan-700 transition-colors border border-slate-200 dark:border-slate-600/50"
                      >
                        {p} →
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3.5 items-center text-xs text-slate-400 p-2">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 p-3.5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                <span>Evaluating clinical literature and personal records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Audio Wave Listening State Indicator */}
        {isListening && (
          <div className="px-5 py-2.5 bg-cyan-500/10 border-t border-cyan-500/20 flex items-center justify-between text-xs text-cyan-700 dark:text-cyan-300">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="font-semibold">Microphone active • Listening to medical inquiry...</span>
            </div>
            <div className="flex items-center gap-1">
              {[6, 14, 8, 18, 12, 20, 7, 15, 9].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className="w-1 bg-cyan-500 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Input Form Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-2xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isListening ? 'Stop listening' : 'Speak inquiry'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything: 'What does borderline LDL mean?', 'Help me prepare for my visit'..."
              className="flex-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <span>Consult</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
