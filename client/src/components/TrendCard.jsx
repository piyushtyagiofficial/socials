import React from 'react';
import { TrendData } from './TrendData';

const TrendCard = () => {
  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 pl-8 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Trends For You</h3>
      {TrendData.map((trend, index) => {
        return (
          <div key={index} className="flex flex-col gap-2">
            <span className="font-bold text-gray-900 dark:text-gray-200">#{trend.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">#{trend.shares}k shares</span>
          </div>
        );
      })}
    </div>
  );
};

export default TrendCard;
