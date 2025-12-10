import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';
import { fetchLonelinessTrends } from '../services/geminiService';
import { Info, TrendingUp, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const trends = await fetchLonelinessTrends();
      setData(trends);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded mb-4"></div>
        <div className="h-64 w-full max-w-2xl bg-slate-100 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">The State of Connection</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Loneliness is now considered a public health priority. Understanding the trends helps us realize we are not alone in feeling alone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Users size={24} />
            <h3 className="font-semibold">Impact</h3>
          </div>
          <p className="text-slate-600 text-sm">Comparable health impact to smoking 15 cigarettes a day.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <TrendingUp size={24} />
            <h3 className="font-semibold">Trend</h3>
          </div>
          <p className="text-slate-600 text-sm">Young adults (18-24) are reporting the highest rates of social isolation.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <Info size={24} />
            <h3 className="font-semibold">Cause</h3>
          </div>
          <p className="text-slate-600 text-sm">Digital saturation often replaces deep, meaningful connection.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
        <h3 className="text-lg font-semibold mb-6 text-slate-800">Self-Reported Loneliness Index (2018-2024)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b'}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b'}}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
