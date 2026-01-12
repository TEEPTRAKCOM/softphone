import { useState } from 'react';
import type { CallStatus } from './Softphone';

interface CallPanelProps {
  phoneNumber: string;
  callStatus: CallStatus;
  callDuration: number;
  isMuted: boolean;
  onEndCall: () => void;
  onToggleMute: () => void;
  onDigit: (digit: string) => void;
}

export default function CallPanel({
  phoneNumber,
  callStatus,
  callDuration,
  isMuted,
  onEndCall,
  onToggleMute,
  onDigit,
}: CallPanelProps) {
  const [showKeypad, setShowKeypad] = useState(false);

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get status display
  const getStatusDisplay = (): { text: string; color: string } => {
    switch (callStatus) {
      case 'dialing':
        return { text: 'Dialing...', color: 'text-amber-400' };
      case 'ringing':
        return { text: 'Ringing...', color: 'text-amber-400' };
      case 'connected':
        return { text: formatDuration(callDuration), color: 'text-green-400' };
      default:
        return { text: 'Unknown', color: 'text-slate-400' };
    }
  };

  const status = getStatusDisplay();

  const DTMF_PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="space-y-8">
      {/* Call Info */}
      <div className="text-center space-y-4">
        {/* Animated rings for dialing/ringing */}
        {(callStatus === 'dialing' || callStatus === 'ringing') && (
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-green-500/30 animate-ping animation-delay-200" />
            <div className="absolute inset-4 rounded-full bg-green-500/40 animate-ping animation-delay-400" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
        )}

        {/* Connected state */}
        {callStatus === 'connected' && (
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        )}

        {/* Phone Number */}
        <div>
          <h2 className="text-2xl font-light text-white">{phoneNumber}</h2>
          <p className={`text-lg font-medium ${status.color} mt-1`}>
            {status.text}
          </p>
        </div>
      </div>

      {/* DTMF Keypad (for IVR navigation) */}
      {showKeypad && callStatus === 'connected' && (
        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          {DTMF_PAD.map((digit) => (
            <button
              key={digit}
              onClick={() => onDigit(digit)}
              className="h-12 bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-500/50 rounded-xl text-white text-lg font-medium transition-all active:scale-95"
            >
              {digit}
            </button>
          ))}
        </div>
      )}

      {/* Call Controls */}
      <div className="flex items-center justify-center gap-6">
        {/* Mute Button */}
        <button
          onClick={onToggleMute}
          disabled={callStatus !== 'connected'}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all
            ${callStatus === 'connected'
              ? isMuted
                ? 'bg-red-500 hover:bg-red-400'
                : 'bg-slate-700 hover:bg-slate-600'
              : 'bg-slate-800 opacity-50 cursor-not-allowed'
            }
          `}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="w-16 h-16 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-red-500/25"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white rotate-[135deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>

        {/* Keypad Toggle Button */}
        <button
          onClick={() => setShowKeypad(!showKeypad)}
          disabled={callStatus !== 'connected'}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all
            ${callStatus === 'connected'
              ? showKeypad
                ? 'bg-blue-500 hover:bg-blue-400'
                : 'bg-slate-700 hover:bg-slate-600'
              : 'bg-slate-800 opacity-50 cursor-not-allowed'
            }
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
