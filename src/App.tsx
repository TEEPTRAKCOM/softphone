import { useState, useEffect } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import Softphone from './components/Softphone';
import Login from './components/Login';

// Configuration
const CONFIG = {
  TOKEN_URL: import.meta.env.VITE_TOKEN_URL || 'https://n8n.teeptrak.com/webhook/softphone/token',
};

export interface User {
  id: string;
  name: string;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Twilio Device when user logs in
  useEffect(() => {
    if (!user) return;

    const initializeDevice = async () => {
      try {
        // Fetch token from n8n
        const response = await fetch(CONFIG.TOKEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identity: user.email,
            userId: user.id,
            userName: user.name,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch token');
        }

        const data = await response.json();
        const token = data.token;

        // Create and register device
        const newDevice = new Device(token, {
          codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
          enableImprovedSignalingErrorPrecision: true,
        });

        // Device event handlers
        newDevice.on('registered', () => {
          console.log('✅ Twilio Device registered');
          setIsReady(true);
          setError(null);
        });

        newDevice.on('error', (err) => {
          console.error('❌ Twilio Device error:', err);
          setError(err.message);
        });

        newDevice.on('unregistered', () => {
          console.log('📴 Twilio Device unregistered');
          setIsReady(false);
        });

        newDevice.on('tokenWillExpire', async () => {
          console.log('🔄 Token expiring, refreshing...');
          try {
            const refreshResponse = await fetch(CONFIG.TOKEN_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                identity: user.email,
                userId: user.id,
                userName: user.name,
              }),
            });
            const refreshData = await refreshResponse.json();
            newDevice.updateToken(refreshData.token);
          } catch (err) {
            console.error('Failed to refresh token:', err);
          }
        });

        // Register the device
        await newDevice.register();
        setDevice(newDevice);

      } catch (err) {
        console.error('Failed to initialize device:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    initializeDevice();

    // Cleanup on unmount
    return () => {
      if (device) {
        device.destroy();
      }
    };
  }, [user]);

  // Handle login
  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('softphone_user', JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    if (device) {
      device.destroy();
    }
    setDevice(null);
    setUser(null);
    setIsReady(false);
    localStorage.removeItem('softphone_user');
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('softphone_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('softphone_user');
      }
    }
  }, []);

  // Show login if no user
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">TeepTrak Softphone</h1>
          <p className="text-slate-400 text-sm">
            {user.name} • {isReady ? '🟢 Connected' : '🔴 Connecting...'}
          </p>
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
        </div>

        {/* Softphone Component */}
        <Softphone 
          device={device} 
          isReady={isReady} 
          user={user}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}

export default App;
