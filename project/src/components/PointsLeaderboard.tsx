import React from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { UserPoints } from '../types';

interface PointsLeaderboardProps {
  leaderboard: UserPoints[];
  currentUserId?: string;
}

const PointsLeaderboard: React.FC<PointsLeaderboardProps> = ({ leaderboard, currentUserId }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3: return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <Trophy className="h-5 w-5" />
        <span>Renewable Energy Points Leaderboard</span>
      </h3>

      <div className="space-y-3">
        {leaderboard.map((user) => (
          <div
            key={user.userId}
            className={`p-4 rounded-lg border-2 transition-all ${
              getRankBgColor(user.rank)
            } ${
              user.userId === currentUserId ? 'ring-2 ring-blue-500 shadow-md' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(user.rank)}
                </div>
                <div>
                  <div className="font-medium text-gray-800 flex items-center space-x-2">
                    <span>{user.userName}</span>
                    {user.userId === currentUserId && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{user.campus}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-green-600">{user.points}</div>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{user.renewableUsage.toFixed(1)} kWh</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Points System Explanation */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-800 mb-2 flex items-center space-x-2">
          <Award className="h-4 w-4" />
          <span>How Points are Earned</span>
        </h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• 1 point per 10 kWh of renewable energy used</li>
          <li>• Bonus points for consistent usage (streak)</li>
          <li>• Extra points for peak hour renewable usage</li>
          <li>• Campus competition encourages efficiency</li>
        </ul>
      </div>

      {/* Current User Stats */}
      {currentUserId && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Your Progress</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-blue-600 font-medium">
                {leaderboard.find(u => u.userId === currentUserId)?.points || 0}
              </div>
              <div className="text-blue-700">Total Points</div>
            </div>
            <div>
              <div className="text-blue-600 font-medium">
                {leaderboard.find(u => u.userId === currentUserId)?.rank || 'N/A'}
              </div>
              <div className="text-blue-700">Current Rank</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsLeaderboard;
