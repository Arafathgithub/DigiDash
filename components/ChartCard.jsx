
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
  Area,
} from 'recharts';
import { ChartType } from '../types';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const value = item.value;
      const name = item.name || item.dataKey;
      const finalLabel = item.payload?.name || label;

      return (
        <div className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white p-3 rounded-lg border border-slate-200 dark:border-slate-600 shadow-lg">
          <p className="font-bold">{finalLabel}</p>
          <p className="text-indigo-500 dark:text-indigo-400">{`${name}: ${value}`}</p>
        </div>
      );
    }
    return null;
};

const PIE_COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff']; // indigo shades


const ChartCard = ({ data }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const gridStroke = isDark ? "#334155" : "#e2e8f0"; // slate-700 / slate-200
  const axisStroke = isDark ? "#94a3b8" : "#64748b"; // slate-400 / slate-500
  const barFill = isDark ? "#6366f1" : "#4f46e5"; // indigo-500 / indigo-600
  const lineStroke = isDark ? "#818cf8" : "#6366f1"; // indigo-400 / indigo-500
  const areaStopColor = isDark ? "#818cf8" : "#6366f1"; // indigo-400 / indigo-500
  
  // Recharts doesn't always re-render styles properly on prop change, so a key forces a full re-mount.
  const chartKey = isDark ? 'dark' : 'light';

  const renderChart = () => {
    const commonComponents = (
        <>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey={data.nameKey} stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)' }} />
            <Legend wrapperStyle={{fontSize: "14px", color: axisStroke }} />
        </>
    );

    switch (data.chartType) {
      case ChartType.Bar:
        return (
          <BarChart data={data.data}>
            {commonComponents}
            <Bar dataKey={data.dataKey} fill={barFill} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case ChartType.Line:
        return (
            <LineChart data={data.data}>
                {commonComponents}
                <Line type="monotone" dataKey={data.dataKey} stroke={lineStroke} strokeWidth={2} dot={{ r: 4, fill: barFill }} activeDot={{ r: 6, fill: barFill }} />
            </LineChart>
        );
      case ChartType.Area:
        return (
            <AreaChart data={data.data}>
                {commonComponents}
                <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={areaStopColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={areaStopColor} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey={data.dataKey} stroke={lineStroke} fillOpacity={1} fill="url(#colorArea)" />
            </AreaChart>
        );
      case ChartType.Pie:
        return (
            <PieChart>
                <Pie
                    data={data.data}
                    dataKey={data.dataKey}
                    nameKey={data.nameKey}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                >
                    {data.data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize: "14px", color: axisStroke }} />
            </PieChart>
        );
      case ChartType.Radar:
        return (
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.data}>
                <PolarGrid stroke={gridStroke} />
                <PolarAngleAxis dataKey={data.nameKey} stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke={axisStroke} axisLine={false} tick={false} />
                <Radar name={data.title} dataKey={data.dataKey} stroke={lineStroke} fill={lineStroke} fillOpacity={0.6} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize: "14px", color: axisStroke }} />
            </RadarChart>
        );
       case ChartType.Scatter:
        if (!data.yDataKey) return <div className="text-center text-red-500">Error: Y-Axis Data Key is not defined for Scatter chart.</div>;
        return (
            <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis type="number" dataKey={data.dataKey} name={data.dataKey} stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="number" dataKey={data.yDataKey} name={data.yDataKey} stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: isDark ? '#475569' : '#cbd5e1' }} />
                <Legend wrapperStyle={{fontSize: "14px", color: axisStroke }} />
                <Scatter name={data.title} data={data.data} fill={barFill} />
            </ScatterChart>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="w-full h-full" key={chartKey}>
        <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
        </ResponsiveContainer>
    </div>
  );
};

export default ChartCard;