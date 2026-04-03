import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';

const SUGGESTED = [
  "What's a good morning routine for better health?",
  "How many steps should I walk daily?",
  "What foods help reduce inflammation?",
  "Tips for better sleep quality?",
  "How to manage stress naturally?",
  "What vitamins should I take daily?",
];

const SYSTEM_PROMPT = `You are VitaBot, a friendly and knowledgeable AI health assistant inside the VitaCare health app. 
You help users with:
- General health tips and wellness advice
- Nutrition and diet questions
- Exercise and activity guidance
- Sleep and recovery tips
- Medication reminders and general info (not medical advice)
- Stress management and mental wellness

Keep responses concise (2-4 sentences max unless detail is needed), warm, encouraging, and actionable.
Always add a disclaimer for medical questions. Use friendly emojis occasionally. Never diagnose conditions.`;

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm VitaBot 🌿 — your AI health companion. Ask me anything about wellness, nutrition, exercise, sleep, or general health tips! I'm here to help you stay healthy and motivated. 💪"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm sorry, I couldn't process that. Please try again!";

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! I'm having trouble connecting right now. Please check your connection and try again. 🔄"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const reset = () => {
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm VitaBot 🌿 — your AI health companion. Ask me anything about wellness, nutrition, exercise, sleep, or general health tips! I'm here to help you stay healthy and motivated. 💪"
    }]);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, height:'100%' }}>
      {/* Header */}
      <div className="section-header fade-up">
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{
            width:52, height:52, borderRadius:16,
            background:'linear-gradient(135deg, var(--green-deep), var(--green-soft))',
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            <Bot size={26} color="white" />
          </div>
          <div>
            <div className="section-title" style={{ fontSize:20 }}>VitaBot AI <Sparkles size={18} color="var(--accent-amber)" style={{ verticalAlign:'middle' }} /></div>
            <div className="section-sub">Powered by Claude · Your health questions answered</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={reset} title="New conversation">
          <RefreshCw size={16} /> Reset
        </button>
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="fade-up">
          <div style={{ fontSize:12, fontWeight:700, color:'var(--slate-light)', marginBottom:10, textTransform:'uppercase', letterSpacing:1 }}>
            Suggested Questions
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {SUGGESTED.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                style={{
                  background:'var(--white)', border:'1.5px solid var(--slate-pale)',
                  borderRadius:99, padding:'8px 14px', fontSize:12, fontWeight:500,
                  color:'var(--slate-mid)', cursor:'pointer', transition:'all 0.2s',
                }}
                onMouseOver={e => { e.target.style.borderColor = 'var(--green-soft)'; e.target.style.color = 'var(--green-deep)'; }}
                onMouseOut={e => { e.target.style.borderColor = 'var(--slate-pale)'; e.target.style.color = 'var(--slate-mid)'; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat window */}
      <div className="card" style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, padding:0, overflow:'hidden' }}>
        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 8px' }}>
          <div className="chat-container" style={{ maxHeight:'none' }}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : ''}`}>
                <div className={`chat-avatar ${m.role === 'user' ? 'user-av' : 'bot'}`}>
                  {m.role === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="var(--green-mid)" />}
                </div>
                <div className={`chat-bubble ${m.role === 'user' ? 'user' : 'bot'}`} style={{ whiteSpace:'pre-wrap' }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg">
                <div className="chat-avatar bot"><Bot size={16} color="var(--green-mid)" /></div>
                <div className="chat-bubble bot">
                  <div className="chat-typing">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--slate-pale)', display:'flex', gap:10, alignItems:'flex-end' }}>
          <textarea
            className="form-input"
            style={{ resize:'none', minHeight:44, maxHeight:120, flex:1, lineHeight:1.5 }}
            placeholder="Ask VitaBot about health, diet, exercise..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            className="btn btn-primary"
            style={{ width:44, height:44, padding:0, borderRadius:12, flexShrink:0 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div style={{ fontSize:11, color:'var(--slate-light)', textAlign:'center' }}>
        ⚕️ VitaBot provides general wellness information, not medical advice. Consult your doctor for medical concerns.
      </div>
    </div>
  );
}
