import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // all, week, month

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeFilter]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/leaderboard?timeFilter=${timeFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaderboardData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏆';
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  const getPointsColor = (points) => {
    if (points > 0) return 'text-green-600';
    if (points < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPointsIcon = (points) => {
    if (points > 0) return '📈';
    if (points < 0) return '📉';
    return '➖';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">
            Top contributors making a difference in food waste reduction
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-2 shadow-lg">
            {[
              { key: 'all', label: 'All Time', icon: '📅' },
              { key: 'month', label: 'This Month', icon: '📆' },
              { key: 'week', label: 'This Week', icon: '📊' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setTimeFilter(filter.key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  timeFilter === filter.key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Cards */}
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <div
              key={entry._id}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-purple-200 transition-all duration-300 transform hover:scale-105 ${
                index < 3 ? 'ring-2 ring-purple-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Position and User Info */}
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getPositionColor(index + 1)} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                    {getMedalIcon(index + 1)}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {entry.user?.name || 'Anonymous User'}
                    </h3>
                    <p className="text-gray-600">
                      {entry.user?.email || 'No email provided'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {entry.user?.role || 'User'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points and Reason */}
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getPointsColor(entry.pointsChange)} flex items-center justify-end space-x-2`}>
                    <span>{getPointsIcon(entry.pointsChange)}</span>
                    <span>{entry.pointsChange > 0 ? '+' : ''}{entry.pointsChange}</span>
                  </div>
                  <p className="text-gray-600 mt-1 max-w-xs">
                    {entry.reason}
                  </p>
                </div>
              </div>

              {/* Progress Bar for Top 3 */}
              {index < 3 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getPositionColor(index + 1)} transition-all duration-1000`}
                      style={{ width: `${Math.max(10, 100 - (index * 20))}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {leaderboardData.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Data Yet</h3>
            <p className="text-gray-600">
              Be the first to contribute and appear on the leaderboard!
            </p>
          </div>
        )}

        {/* Stats Summary */}
        {leaderboardData.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">
                {leaderboardData.length}
              </div>
              <div className="text-gray-600">Total Entries</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">
                {leaderboardData.reduce((sum, entry) => sum + Math.max(0, entry.pointsChange), 0)}
              </div>
              <div className="text-gray-600">Total Positive Points</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">
                {leaderboardData.filter(entry => entry.pointsChange > 0).length}
              </div>
              <div className="text-gray-600">Positive Actions</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 