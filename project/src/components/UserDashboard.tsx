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
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EnergyData, Alert, UserPoints, PriorityRequest } from '../types';
import ChatbotWidget from './ChatbotWidget';
import PointsLeaderboard from './PointsLeaderboard';

const UserDashboard: React.FC = () => {
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
      message: 'Battery 90% full → discharge recommended',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'info',
      message: 'Shift HVAC to 2 PM → solar surplus expected',
      timestamp: new Date(),
      read: false
    }
  ]);

  const [batteryReserve, setBatteryReserve] = useState(20);
  const [alertThreshold, setAlertThreshold] = useState(85);

  // New state for enhanced features
  const [userPoints, setUserPoints] = useState<UserPoints>({
    userId: user?.id || '1',
    userName: user?.name || 'John Smith',
    campus: user?.campus || 'Main Campus',
    points: 1250,
    renewableUsage: 245.5,
    rank: 2
  });

  const [leaderboard, setLeaderboard] = useState<UserPoints[]>([
    {
      userId: '1',
      userName: 'Sarah Johnson',
      campus: 'Main Campus',
      points: 1450,
      renewableUsage: 289.2,
      rank: 1
    },
    {
      userId: '2',
      userName: user?.name || 'John Smith',
      campus: user?.campus || 'Main Campus',
      points: 1250,
      renewableUsage: 245.5,
      rank: 2
    },
    {
      userId: '3',
      userName: 'Mike Chen',
      campus: 'North Campus',
      points: 980,
      renewableUsage: 198.7,
      rank: 3
    }
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
      occupancy: 85,
      active: true
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
      active: false
    }
  ]);

  const [demandData, setDemandData] = useState([
    { time: '06:00', demand: 120, expected: 135 },
    { time: '09:00', demand: 180, expected: 195 },
    { time: '12:00', demand: 220, expected: 240 },
    { time: '15:00', demand: 195, expected: 210 },
    { time: '18:00', demand: 165, expected: 180 },
    { time: '21:00', demand: 140, expected: 155 }
  ]);

  useEffect(() => {
    // Simulate real-time data updates
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Campus Energy Monitor</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
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
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Energy Flow Visualization */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Live Energy Flow</h2>
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-yellow-100 p-6 rounded-2xl">
                <Sun className="h-12 w-12 text-yellow-600" />
              </div>
              <span className="font-semibold text-gray-700">Solar</span>
              <span className="text-lg font-bold text-yellow-600">{energyData.solar.toFixed(0)} kWh</span>
            </div>
            
            <ArrowRight className="h-8 w-8 text-gray-400 animate-pulse" />
            
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
              <span className="font-semibold text-gray-700">Campus Load</span>
              <span className="text-lg font-bold text-blue-600">{energyData.load.toFixed(0)} kWh</span>
            </div>
            
            <ArrowRight className="h-8 w-8 text-gray-400" />
            
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-purple-100 p-6 rounded-2xl">
                <Zap className="h-12 w-12 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-700">Grid</span>
              <span className="text-lg font-bold text-purple-600">
                {energyData.grid > 0 ? `${energyData.grid.toFixed(0)} kWh` : 'Standby'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Battery & Load Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Battery Status */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Gauge className="h-5 w-5" />
                <span>Battery Management</span>
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {energyData.battery.charge.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Charge Level</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {energyData.battery.health}%
                  </div>
                  <div className="text-sm text-gray-600">Health</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {energyData.battery.cycles}
                  </div>
                  <div className="text-sm text-gray-600">Cycles</div>
                </div>
              </div>

              {/* Battery Gauge */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${energyData.battery.charge}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Battery className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Load Priority */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Load Priority Management</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="font-medium text-green-800">🔬 Research Labs</span>
                  <span className="text-sm text-green-600">Priority 1 - Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-medium text-blue-800">🏠 Student Hostels</span>
                  <span className="text-sm text-blue-600">Priority 2 - Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-medium text-gray-800">🏢 Administrative Offices</span>
                  <span className="text-sm text-gray-600">Priority 3 - Standby</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts & Controls */}
          <div className="space-y-6">
            {/* Alerts Panel */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Active Alerts</span>
              </h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${getAlertBgColor(alert.type)}`}
                  >
                    <div className="flex items-start space-x-2">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Sliders className="h-5 w-5" />
                <span>System Controls</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Battery Reserve: {batteryReserve}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={batteryReserve}
                    onChange={(e) => setBatteryReserve(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alert Threshold: {alertThreshold}%
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="95"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Enhanced Sections */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Points & Leaderboard */}
          <div className="space-y-6">
            {/* User Points Display */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Your Renewable Points</span>
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{userPoints.points}</div>
                <div className="text-sm text-gray-600 mb-4">Total Points Earned</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-blue-600">#{userPoints.rank}</div>
                    <div className="text-gray-500">Current Rank</div>
                  </div>
                  <div>
                    <div className="font-medium text-yellow-600">{userPoints.renewableUsage.toFixed(1)} kWh</div>
                    <div className="text-gray-500">Renewable Usage</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Points Leaderboard */}
            <PointsLeaderboard leaderboard={leaderboard} currentUserId={user?.id} />
          </div>

          {/* Demand Graph & Priority Management */}
          <div className="space-y-6">
            {/* Expected Demand Graph */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Expected Demand Forecast</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demandData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="demand"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Current Demand"
                    />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Expected Demand"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Enhanced Load Priority */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Request-Based Priorities</h3>
              <div className="space-y-3">
                {priorities.map((priority) => {
                  const getTypeLabel = (type: PriorityRequest['type']) => {
                    switch (type) {
                      case 'exam_center': return '🏫 Exam Center';
                      case 'classroom': return '📚 Classroom';
                      case 'hostel': return '🏠 Hostel';
                      case 'lab': return '🔬 Research Lab';
                      case 'office': return '🏢 Administrative Office';
                    }
                  };

                  const getPriorityColor = (priority: PriorityRequest['priority']) => {
                    switch (priority) {
                      case 'grid': return 'bg-purple-50 border-purple-200';
                      case 'solar': return 'bg-yellow-50 border-yellow-200';
                      case 'wind': return 'bg-blue-50 border-blue-200';
                      case 'solar+wind': return 'bg-green-50 border-green-200';
                      case 'solar+wind+grid': return 'bg-gray-50 border-gray-200';
                    }
                  };

                  return (
                    <div
                      key={priority.id}
                      className={`p-3 rounded-lg border ${getPriorityColor(priority.priority)} ${
                        priority.active ? 'opacity-100' : 'opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{getTypeLabel(priority.type)}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                            {priority.priority.replace('+', ' + ')}
                          </span>
                          {priority.active && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                      </div>
                      {priority.type === 'hostel' && priority.occupancy && (
                        <div className="text-xs text-gray-600 mt-1">
                          Occupancy: {priority.occupancy}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="space-y-6">
            {/* Rajasthan EB & PM Schemes Contacts */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Support Contacts</span>
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Rajasthan Electricity Board</span>
                  </div>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <span>1800-123-4567</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <span>support@reb.rajasthan.gov.in</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sun className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">PM Surya Ghar Scheme</span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <span>1800-987-6543</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="h-3 w-3" />
                      <a href="https://www.pmsuryaghar.gov.in" className="hover:underline">
                        pmsuryaghar.gov.in
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Solar Rooftop Subsidy</span>
                  </div>
                  <div className="text-sm text-yellow-700">
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="h-3 w-3" />
                      <a href="https://solarrooftop.gov.in" className="hover:underline">
                        solarrooftop.gov.in
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot Widget */}
        <ChatbotWidget />
      </div>
    </div>
  );
};

export default UserDashboard;
