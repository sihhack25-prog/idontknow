import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Sun,
  Wind,
  Battery,
  Building2,
  Zap,
  ArrowRight,
  Bell,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  Gauge,
  Sliders,
  Phone,
  Mail,
  ExternalLink,
  BarChart3,
  Mic,
  Brain,
  MapPin,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { EnergyData, Alert, UserPoints, PriorityRequest, Region } from '../types';
import ChatbotWidget from './ChatbotWidget';
import EnergyMap from './EnergyMap';
import PriorityManager from './PriorityManager';
import PointsLeaderboard from './PointsLeaderboard';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [energyData, setEnergyData] = useState<EnergyData>({
    solar: 245,
    wind: 85,
    battery: { charge: 85, health: 92, cycles: 1247 },
    load: 180,
    grid: 0,
    timestamp: new Date()
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'High demand in North Campus - optimize load',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'info',
      message: 'ML model ready for deployment',
      timestamp: new Date(),
      read: false
    }
  ]);

  const [currentMode, setCurrentMode] = useState<'manual' | 'voice' | 'ml'>('manual');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMLRunning, setIsMLRunning] = useState(false);
  const [outputSource, setOutputSource] = useState<'solar' | 'wind' | 'grid' | 'battery'>('solar');

  // Region-wise data
  const [regionData, setRegionData] = useState<Region[]>([
    {
      id: 'north',
      name: 'North Campus',
      solar: 120,
      wind: 45,
      load: 90,
      points: 850
    },
    {
      id: 'main',
      name: 'Main Campus',
      solar: 245,
      wind: 85,
      load: 180,
      points: 1250
    },
    {
      id: 'south',
      name: 'South Campus',
      solar: 180,
      wind: 60,
      load: 140,
      points: 950
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<UserPoints[]>([
    {
      userId: '1',
      userName: 'Admin User',
      campus: 'Main Campus',
      points: 2000,
      renewableUsage: 350.2,
      rank: 1
    },
    // Add more as needed
  ]);

  const [priorities, setPriorities] = useState<PriorityRequest[]>([
    {
      id: '1',
      type: 'exam_center',
      priority: 'grid',
      active: true
    },
    {
      id: '2',
      type: 'classroom',
      priority: 'solar',
      active: true
    },
    {
      id: '3',
      type: 'hostel',
      priority: 'grid',
      active: false,
      occupancy: 75
    },
    {
      id: '4',
      type: 'lab',
      priority: 'solar+wind',
      active: true
    },
    {
      id: '5',
      type: 'office',
      priority: 'grid',
      active: true
    }
  ]);

  const handleUpdatePriority = (id: string, updates: Partial<PriorityRequest>) => {
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setEnergyData(prev => ({
        ...prev,
        solar: Math.max(0, prev.solar + (Math.random() - 0.5) * 20),
        wind: Math.max(0, prev.wind + (Math.random() - 0.5) * 10),
        battery: {
          ...prev.battery,
          charge: Math.max(0, Math.min(100, prev.battery.charge + (Math.random() - 0.5) * 2))
        },
        load: Math.max(0, prev.load + (Math.random() - 0.5) * 15),
        timestamp: new Date()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertBgColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      // Start voice recognition
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        console.log('Voice command:', transcript);
        // Integrate with Gemini via ChatbotWidget or API
      };
      recognition.start();
    }
  };

  const handleMLRun = () => {
    setIsMLRunning(true);
    // Simulate ML model with 10-second sleep
    setTimeout(() => {
      setIsMLRunning(false);
      // Update energy data or alerts based on "ML prediction"
      setAlerts(prev => [...prev, {
        id: Date.now().toString(),
        type: 'info',
        message: 'ML model optimized load distribution',
        timestamp: new Date(),
        read: false
      }]);
    }, 10000);
  };

  const handleOutputSwitch = (source: 'solar' | 'wind' | 'grid' | 'battery') => {
    setOutputSource(source);
    // Simulate switching
    console.log('Switched to', source);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Energy Control Panel</h1>
              <p className="text-gray-600">System-wide management, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                {alerts.filter(a => !a.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {alerts.filter(a => !a.read).length}
                  </span>
                )}
              </div>
              <button onClick={logout} className="text-gray-600 hover:text-gray-800 font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Mode Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Control Modes</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentMode('manual')}
              className={`p-4 rounded-lg border-2 ${currentMode === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            >
              <Sliders className="h-6 w-6 mx-auto mb-2" />
              <span className="font-medium">Manual Mode</span>
            </button>
            <button
              onClick={handleVoiceToggle}
              className={`p-4 rounded-lg border-2 ${currentMode === 'voice' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
            >
              <Mic className={`h-6 w-6 mx-auto mb-2 ${isVoiceActive ? 'text-green-600' : 'text-gray-600'}`} />
              <span className="font-medium">Voice Mode {isVoiceActive && '(Active)'}</span>
            </button>
            <button
              onClick={handleMLRun}
              disabled={isMLRunning}
              className={`p-4 rounded-lg border-2 ${currentMode === 'ml' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'} ${isMLRunning ? 'opacity-50' : ''}`}
            >
              <Brain className={`h-6 w-6 mx-auto mb-2 ${isMLRunning ? 'animate-spin' : 'text-gray-600'}`} />
              <span className="font-medium">ML Mode {isMLRunning && '(Running...)'}</span>
            </button>
          </div>
        </div>

        {/* Manual Output Switching */}
        {currentMode === 'manual' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Manual Output Controls</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <button
                onClick={() => handleOutputSwitch('solar')}
                className={`p-4 rounded-lg border-2 ${outputSource === 'solar' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}
              >
                <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <span className="font-medium">Solar</span>
              </button>
              <button
                onClick={() => handleOutputSwitch('wind')}
                className={`p-4 rounded-lg border-2 ${outputSource === 'wind' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              >
                <Wind className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <span className="font-medium">Wind</span>
              </button>
              <button
                onClick={() => handleOutputSwitch('grid')}
                className={`p-4 rounded-lg border-2 ${outputSource === 'grid' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
              >
                <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <span className="font-medium">Grid</span>
              </button>
              <button
                onClick={() => handleOutputSwitch('battery')}
                className={`p-4 rounded-lg border-2 ${outputSource === 'battery' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <Battery className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <span className="font-medium">Battery</span>
              </button>
            </div>
          </div>
        )}

        {/* Energy Flow - Admin View */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">System-Wide Energy Flow</h2>
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {/* Similar to UserDashboard but with admin totals */}
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-yellow-100 p-6 rounded-2xl">
                <Sun className="h-12 w-12 text-yellow-600" />
              </div>
              <span className="font-semibold text-gray-700">Total Solar</span>
              <span className="text-lg font-bold text-yellow-600">{energyData.solar.toFixed(0)} kWh</span>
            </div>
            <ArrowRight className="h-8 w-8 text-gray-400 animate-pulse" />
            {/* Add more for wind, battery, load, grid */}
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-green-100 p-6 rounded-2xl">
                <Battery className="h-12 w-12 text-green-600" />
              </div>
              <span className="font-semibold text-gray-700">Battery</span>
              <span className="text-lg font-bold text-green-600">{energyData.battery.charge.toFixed(0)}%</span>
            </div>
            <ArrowRight className="h-8 w-8 text-gray-400 animate-pulse" />
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-blue-100 p-6 rounded-2xl">
                <Building2 className="h-12 w-12 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-700">Total Load</span>
              <span className="text-lg font-bold text-blue-600">{energyData.load.toFixed(0)} kWh</span>
            </div>
            <ArrowRight className="h-8 w-8 text-gray-400" />
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-purple-100 p-6 rounded-2xl">
                <Zap className="h-12 w-12 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-700">Grid Backup</span>
              <span className="text-lg font-bold text-purple-600">
                {energyData.grid > 0 ? `${energyData.grid.toFixed(0)} kWh` : 'Standby'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Alerts */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>System Alerts</span>
              </h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertBgColor(alert.type)}`}>
                    <div className="flex items-start space-x-2">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Manager */}
            <PriorityManager priorities={priorities} onUpdatePriority={handleUpdatePriority} />
          </div>

          {/* Analytics & Leaderboard */}
          <div className="space-y-6">
            {/* Region-wise Analytics */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Region Analytics</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="solar" fill="#fbbf24" name="Solar" />
                  <Bar dataKey="wind" fill="#10b981" name="Wind" />
                  <Bar dataKey="load" fill="#3b82f6" name="Load" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Points Leaderboard */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Admin Leaderboard</span>
              </h3>
              <PointsLeaderboard leaderboard={leaderboard} currentUserId={user?.id} />
            </div>
          </div>
        </div>

        {/* Energy Map */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Campus Energy Map</h3>
          <EnergyMap regions={regionData} />
        </div>

        {/* Chatbot for Voice/Gemini Integration */}
        <ChatbotWidget />
      </div>
    </div>
  );
};

export default AdminDashboard;
