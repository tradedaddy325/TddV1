"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey trader 👋 I'm Trade Daddy AI — your personal trading assistant. Ask me about market analysis, trade setups, risk management, or anything trading-related. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.content || "Sorry, I had trouble with that.", timestamp: new Date() },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, something went wrong. Please try again.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "#080809",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{ fontSize: 24 }}>🤖</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#e0e0e0" }}>
            <span style={{ color: "#00ff88" }}>TRADE DADDY</span> CHATBOT
          </div>
          <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.08em" }}>AI TRADING ASSISTANT</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#00ff88" }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: "rgba(0,255,136,0.1)",
                border: "1px solid rgba(0,255,136,0.2)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 14, flexShrink: 0,
              }}>
                🤖
              </div>
            )}
            <div style={{
              maxWidth: "70%",
              background: msg.role === "user"
                ? "rgba(0,255,136,0.1)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${msg.role === "user" ? "rgba(0,255,136,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              padding: "10px 14px",
            }}>
              <div style={{ fontSize: 13, color: "#d0d0d0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {msg.content}
              </div>
              <div style={{ fontSize: 10, color: "#333", marginTop: 4, textAlign: "right" }}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px 12px 12px 2px", padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 0.15, 0.3].map((delay, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", animation: `bounce 1s ${delay}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "16px 24px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        gap: 12,
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask about setups, risk, market analysis..."
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#e0e0e0",
            padding: "10px 14px",
            fontSize: 13,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 20px",
            background: loading || !input.trim() ? "rgba(0,255,136,0.05)" : "rgba(0,255,136,0.15)",
            border: "1px solid rgba(0,255,136,0.3)",
            borderRadius: 8,
            color: "#00ff88",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "inherit",
          }}
        >
          SEND
        </button>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
        @keyframes bounce { 0%,80%,100% { transform:scale(0); } 40% { transform:scale(1); } }
      `}</style>
    </div>
  );
}