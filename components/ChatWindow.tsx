
import React, { useState, useRef, useEffect } from 'react';
import { Message, User, Role } from '../types';
import PushToTalk from './PushToTalk';

interface ChatWindowProps {
  messages: Message[];
  onSend: (content?: string, audioData?: string) => void;
  currentUser: User;
  selectedChannel: Role | 'ALL';
  onChannelChange: (channel: Role | 'ALL') => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  onSend, 
  currentUser, 
  selectedChannel, 
  onChannelChange 
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredMessages = messages.filter(m => {
    if (selectedChannel === 'ALL') return m.to === 'ALL' || m.type === 'ALERT';
    return m.to === selectedChannel || m.fromRole === selectedChannel;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex overflow-x-auto p-2 bg-slate-950 border-b border-slate-800 no-scrollbar sticky top-0 z-10">
        <button 
          onClick={() => onChannelChange('ALL')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap mr-2 transition-colors ${selectedChannel === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          Broadcast
        </button>
        {Object.values(Role).map(role => (
          <button 
            key={role}
            onClick={() => onChannelChange(role)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap mr-2 transition-colors ${selectedChannel === role ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            {role}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 md:pb-4">
        {filteredMessages.map((msg) => {
          const isMe = msg.from === currentUser.username;
          const isAudio = msg.type === 'AUDIO';

          if (msg.type === 'SYSTEM') {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-[10px] text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full uppercase font-bold">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 px-1">{msg.fromRole} • {msg.from}</span>
              <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${
                msg.type === 'ALERT' ? 'bg-red-600 text-white animate-pulse' : 
                isMe ? 'bg-blue-600 text-white rounded-tr-none' : 
                'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
              }`}>
                {isAudio ? (
                  <div className="flex items-center space-x-3 py-1">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <audio controls src={msg.audioData} className="h-8 w-40 md:w-48 brightness-90 contrast-125" />
                  </div>
                ) : (
                  <p className="text-sm font-medium">{msg.content}</p>
                )}
                <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800 sticky bottom-0 z-20">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <PushToTalk 
            onAudioReady={(audio) => onSend(undefined, audio)} 
            isDisabled={false}
          />
          <form onSubmit={handleSubmit} className="flex-1 flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 bg-slate-800 border-none rounded-2xl px-5 py-3.5 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={`Type a message...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-900/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
