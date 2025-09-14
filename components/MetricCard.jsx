import React from 'react';

const ArrowUpIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
  );
  
  const ArrowDownIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );

const MetricCard = ({ data }) => {
  const trendColor = data.trendDirection === 'up' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  const TrendIcon = data.trendDirection === 'up' ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white truncate">
          {data.value}
          {data.unit && <span className="text-2xl text-slate-500 dark:text-slate-400 ml-2">{data.unit}</span>}
        </div>
      </div>
      {data.trend && (
        <div className={`flex items-center text-lg font-semibold ${trendColor}`}>
          <TrendIcon className="h-5 w-5 mr-1" />
          <span>{data.trend}</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;