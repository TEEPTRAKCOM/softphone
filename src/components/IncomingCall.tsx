interface IncomingCallProps {
  callerNumber: string;
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCall({ callerNumber, onAccept, onReject }: IncomingCallProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 animate-pulse-slow">
        {/* Animated Avatar */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-green-500/30 animate-ping animation-delay-200" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Caller Info */}
        <div className="text-center mb-8">
          <p className="text-slate-400 text-sm mb-1">Incoming Call</p>
          <h2 className="text-2xl font-medium text-white">{callerNumber}</h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-8">
          {/* Reject */}
          <button
            onClick={onReject}
            className="w-16 h-16 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-red-500/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white rotate-[135deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>

          {/* Accept */}
          <button
            onClick={onAccept}
            className="w-16 h-16 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-green-500/25 animate-bounce"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
