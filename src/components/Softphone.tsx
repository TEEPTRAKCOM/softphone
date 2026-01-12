import { useState, useEffect, useCallback } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import Dialer from './Dialer';
import CallPanel from './CallPanel';
import IncomingCall from './IncomingCall';
import type { User } from '../App';

interface SoftphoneProps {
  device: Device | null;
  isReady: boolean;
  user: User;
  onLogout: () => void;
}

export type CallStatus = 'idle' | 'dialing' | 'ringing' | 'connected' | 'ended';

export default function Softphone({ device, isReady, user, onLogout }: SoftphoneProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [incomingCall, setIncomingCall] = useState<Call | null>(null);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);

  // Handle incoming calls
  useEffect(() => {
    if (!device) return;

    const handleIncoming = (call: Call) => {
      console.log('📞 Incoming call from:', call.parameters.From);
      setIncomingCall(call);
      
      call.on('cancel', () => {
        setIncomingCall(null);
      });

      call.on('disconnect', () => {
        setIncomingCall(null);
        setCurrentCall(null);
        setCallStatus('ended');
      });
    };

    device.on('incoming', handleIncoming);

    return () => {
      device.off('incoming', handleIncoming);
    };
  }, [device]);

  // Call duration timer
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (callStatus === 'connected' && callStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - callStartTime.getTime()) / 1000);
        setCallDuration(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus, callStartTime]);

  // Make outbound call
  const makeCall = useCallback(async () => {
    if (!device || !phoneNumber || !isReady) return;

    try {
      setCallStatus('dialing');
      
      const call = await device.connect({
        params: {
          To: phoneNumber,
          CallerId: user.email,
          UserName: user.name,
          UserId: user.id,
        },
      });

      setCurrentCall(call);

      call.on('ringing', () => {
        console.log('🔔 Ringing...');
        setCallStatus('ringing');
      });

      call.on('accept', () => {
        console.log('✅ Call connected');
        setCallStatus('connected');
        setCallStartTime(new Date());
      });

      call.on('disconnect', () => {
        console.log('📴 Call ended');
        setCallStatus('ended');
        setCurrentCall(null);
        setCallStartTime(null);
        setTimeout(() => setCallStatus('idle'), 2000);
      });

      call.on('error', (error) => {
        console.error('❌ Call error:', error);
        setCallStatus('ended');
        setCurrentCall(null);
      });

      call.on('cancel', () => {
        console.log('🚫 Call cancelled');
        setCallStatus('idle');
        setCurrentCall(null);
      });

    } catch (error) {
      console.error('Failed to make call:', error);
      setCallStatus('idle');
    }
  }, [device, phoneNumber, isReady, user]);

  // End call
  const endCall = useCallback(() => {
    if (currentCall) {
      currentCall.disconnect();
    }
  }, [currentCall]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (currentCall) {
      if (isMuted) {
        currentCall.mute(false);
      } else {
        currentCall.mute(true);
      }
      setIsMuted(!isMuted);
    }
  }, [currentCall, isMuted]);

  // Accept incoming call
  const acceptIncoming = useCallback(() => {
    if (incomingCall) {
      incomingCall.accept();
      setCurrentCall(incomingCall);
      setIncomingCall(null);
      setCallStatus('connected');
      setCallStartTime(new Date());
    }
  }, [incomingCall]);

  // Reject incoming call
  const rejectIncoming = useCallback(() => {
    if (incomingCall) {
      incomingCall.reject();
      setIncomingCall(null);
    }
  }, [incomingCall]);

  // Handle digit press (for DTMF during call)
  const handleDigit = useCallback((digit: string) => {
    if (callStatus === 'connected' && currentCall) {
      currentCall.sendDigits(digit);
    } else {
      setPhoneNumber(prev => prev + digit);
    }
  }, [callStatus, currentCall]);

  // Clear phone number
  const handleClear = useCallback(() => {
    setPhoneNumber('');
  }, []);

  // Backspace
  const handleBackspace = useCallback(() => {
    setPhoneNumber(prev => prev.slice(0, -1));
  }, []);

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
      {/* Incoming Call Modal */}
      {incomingCall && (
        <IncomingCall
          callerNumber={incomingCall.parameters.From || 'Unknown'}
          onAccept={acceptIncoming}
          onReject={rejectIncoming}
        />
      )}

      {/* Main Content */}
      <div className="p-6">
        {callStatus === 'idle' || callStatus === 'ended' ? (
          /* Dialer View */
          <Dialer
            phoneNumber={phoneNumber}
            onDigit={handleDigit}
            onCall={makeCall}
            onClear={handleClear}
            onBackspace={handleBackspace}
            isReady={isReady}
            callStatus={callStatus}
          />
        ) : (
          /* Active Call View */
          <CallPanel
            phoneNumber={phoneNumber}
            callStatus={callStatus}
            callDuration={callDuration}
            isMuted={isMuted}
            onEndCall={endCall}
            onToggleMute={toggleMute}
            onDigit={handleDigit}
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>TeepTrak v1.0</span>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
