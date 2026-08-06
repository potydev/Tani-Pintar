import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, Send } from "lucide-react";
import { QUICK_CHAT_PROMPTS } from "../../data/mockData";

export function AIAssistantChatPanel({ name }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hai ${name}! 👋 Saya siap membantu Anda mengambil keputusan penjualan yang paling menguntungkan.`
    }
  ]);
  const [input, setInput] = useState("");
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const newMessages = [...messages, { sender: "user", text }];
    setMessages(newMessages);
    setInput("");

    // Simulate AI Smart Response
    setTimeout(() => {
      let replyText = "Berdasarkan analisis data real-time Bapanas & TaniPintar hari ini, pengiriman Cabai Merah ke Bandung memberikan profit bersih tertinggi (+9.2%) dibanding opsi pasar lainnya.";
      if (text.toLowerCase().includes("kapan")) {
        replyText = "Prediksi harga menunjukkan kenaikan sekitar 6.2% dalam 3 hari ke depan. Waktu terbaik untuk menjual adalah antara Kamis & Jumat minggu ini.";
      } else if (text.toLowerCase().includes("harga")) {
        replyText = "Harga pasaran rekomendasi AI di Bandung saat ini adalah Rp 41.500 /kg. Jangan lepas di bawah Rp 39.500 /kg.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
    }, 700);
  };

  return (
    <div className="tp-card p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-heading font-bold text-slate-900 text-sm">AI Assistant (TaniBot)</h4>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  Beta
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Tanya apa saja tentang penjualan hasil panen Anda.</div>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="space-y-3 max-h-64 overflow-y-auto tp-scrollbar pr-1 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={12} />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white font-medium rounded-br-none'
                    : 'bg-emerald-50 text-slate-800 border border-emerald-100 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Prompts */}
        <div className="space-y-1.5 mb-4">
          {QUICK_CHAT_PROMPTS.slice(0, 4).map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(promptText)}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors flex items-center justify-between"
            >
              <span>{promptText}</span>
              <ArrowRight size={12} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div>
        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-xl focus-within:border-emerald-600 shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik pertanyaan Anda..."
            className="w-full px-2 py-1.5 text-xs text-slate-800 outline-none bg-transparent"
          />
          <button
            onClick={() => handleSend()}
            className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-colors shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
        <div className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
          <span>Powered by Google Gemini</span>
          <Sparkles size={10} className="text-purple-500" />
        </div>
      </div>
    </div>
  );
}
