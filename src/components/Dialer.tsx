import type { CallStatus } from './Softphone';

interface DialerProps {
  phoneNumber: string;
  onDigit: (digit: string) => void;
  onCall: () => void;
  onClear: () => void;
  onBackspace: () => void;
  isReady: boolean;
  callStatus: CallStatus;
}

const DIAL_PAD = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
];

export default function Dialer({
  phoneNumber,
  onDigit,
  onCall,
  onClear,
  onBackspace,
  isReady,
  callStatus,
}: DialerProps) {
  // Format phone number for display
  const formatPhoneDisplay = (number: string): string => {
    // Remove non-digits except +
    const cleaned = number.replace(/[^\d+]/g, '');
    
    // Format US numbers
    if (cleaned.startsWith('+1') && cleaned.length > 2) {
      const rest = cleaned.slice(2);
      if (rest.length <= 3) return `+1 (${rest}`;
      if (rest.length <= 6) return `+1 (${rest.slice(0, 3)}) ${rest.slice(3)}`;
      return `+1 (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6, 10)}`;
    }
    
    // Format French numbers
    if (cleaned.startsWith('+33') && cleaned.length > 3) {
      const rest = cleaned.slice(3);
      return `+33 ${rest.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}`.trim();
    }
    
    return cleaned;
  };

  const handleKeyPress = (digit: string) => {
    // Play DTMF sound
    playDTMF(digit);
    onDigit(digit);
  };

  const playDTMF = (digit: string) => {
    // Optional: Add DTMF sound feedback
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gainNode = audio.createGain();
    
    const frequencies: Record<string, [number, number]> = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '*': [941, 1209], '0': [941, 1336], '#': [941, 1477],
    };

    if (frequencies[digit]) {
      oscillator.frequency.value = frequencies[digit][0];
      gainNode.gain.value = 0.1;
      oscillator.connect(gainNode);
      gainNode.connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + 0.1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Phone Number Display */}
      <div className="relative">
        <div className="bg-slate-900/50 rounded-2xl p-4 min-h-[80px] flex items-center justify-center">
          <input
            type="text"
            value={formatPhoneDisplay(phoneNumber)}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d+]/g, '');
              onClear();
              value.split('').forEach(onDigit);
            }}
            placeholder="Enter number"
            className="w-full text-center text-2xl font-light text-white bg-transparent outline-none placeholder-slate-600"
          />
        </div>
        
        {/* Backspace button */}
        {phoneNumber && (
          <button
            onClick={onBackspace}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
        )}
      </div>

      {/* Quick Dial Buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => {
            onClear();
            '+1'.split('').forEach(onDigit);
          }}
          className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-full transition-colors"
        >
          +1 US
        </button>
        <button
          onClick={() => {
            onClear();
            '+33'.split('').forEach(onDigit);
          }}
          className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-full transition-colors"
        >
          +33 FR
        </button>
        <button
          onClick={() => {
            onClear();
            '+86'.split('').forEach(onDigit);
          }}
          className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-full transition-colors"
        >
          +86 CN
        </button>
      </div>

      {/* Dial Pad */}
      <div className="grid grid-cols-3 gap-3">
        {DIAL_PAD.map(({ digit, letters }) => (
          <button
            key={digit}
            onClick={() => handleKeyPress(digit)}
            className="group relative h-16 bg-slate-700/30 hover:bg-slate-600/50 active:bg-slate-500/50 rounded-2xl transition-all duration-150 active:scale-95"
          >
            <span className="text-2xl font-medium text-white">{digit}</span>
            {letters && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 tracking-widest">
                {letters}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Call Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onCall}
          disabled={!isReady || !phoneNumber || phoneNumber.length < 6}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200
            ${isReady && phoneNumber.length >= 6
              ? 'bg-green-500 hover:bg-green-400 active:scale-95 shadow-lg shadow-green-500/25'
              : 'bg-slate-600 cursor-not-allowed opacity-50'
            }
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
      </div>

      {/* Status */}
      <div className="text-center">
        <span className={`text-sm ${isReady ? 'text-green-400' : 'text-amber-400'}`}>
          {callStatus === 'ended' ? '📞 Call ended' : isReady ? '✓ Ready to call' : '⏳ Connecting...'}
        </span>
      </div>
    </div>
  );
}
