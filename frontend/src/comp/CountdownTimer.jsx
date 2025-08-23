import React, { useState, useEffect } from 'react';
import { countdownUtils } from '../services/shelfLifeService';

const CountdownTimer = ({ expiresAt, remainingHours, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState(
    countdownUtils.calculateRemainingTime(expiresAt)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = countdownUtils.calculateRemainingTime(expiresAt);
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.expired && onExpired) {
        onExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  const riskLevelColor = countdownUtils.getRiskLevelColor(remainingHours);
  const riskLevelText = countdownUtils.getRiskLevelText(remainingHours);

  if (timeLeft.expired) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-bold">⚠️ EXPIRED</span>
          <span className="text-sm">Food is no longer safe to eat</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg`}>
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2">Safe to eat for:</div>
        
        <div className="flex justify-center space-x-4 mb-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {countdownUtils.formatTime(timeLeft.hours)}
            </div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {countdownUtils.formatTime(timeLeft.minutes)}
            </div>
            <div className="text-xs text-gray-500">Minutes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {countdownUtils.formatTime(timeLeft.seconds)}
            </div>
            <div className="text-xs text-gray-500">Seconds</div>
          </div>
        </div>

        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${riskLevelColor} bg-opacity-10`}>
          Risk Level: {riskLevelText}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer; 