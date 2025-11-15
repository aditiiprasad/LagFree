import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, ReferenceDot
} from 'recharts';
import Card from './ui/Card'; 

const Dashboard = ({ data }) => {
  const rebufferEvents = data.filter(d => d.event === 'rebuffer');
  const switchEvents = data.filter(d => d.event === 'switch');

  return (
    <Card className="w-full h-[400px]">
      <h3 className="text-lg font-semibold text-white mb-4">Network Simulation</h3>
      
      
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#00ff41" strokeOpacity={0.2} />
          <XAxis dataKey="time" stroke="#9CA3AF" />
          <YAxis
            yAxisId="left"
            label={{ value: 'Mbps / Sec', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            stroke="#9CA3AF"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'ms', angle: 90, position: 'insideRight', fill: '#9CA3AF' }}
            stroke="#9CA3AF"
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00ff41', borderRadius: '8px' }}
            labelStyle={{ color: '#F9FAFB' }}
          />
          <Legend wrapperStyle={{ color: '#F9FAFB' }} />

          <ReferenceLine yAxisId="left" y={3} label={{ value: 'Low BW', fill: '#EF4444' }} stroke="#EF4444" strokeDasharray="4 4" />
          <ReferenceLine yAxisId="left" y={7} label={{ value: 'High BW', fill: '#00ff41' }} stroke="#00ff41" strokeDasharray="4 4" />

          {rebufferEvents.map((event, index) => (
            <ReferenceDot
              key={`rebuffer-${event.time}-${index}`}
              x={event.time} y={event.buffer} yAxisId="left"
              r={6} fill="#EF4444" stroke="white"
              label={{ value: 'Rebuffer!', fill: '#EF4444', position: 'top' }}
            />
          ))}

          {switchEvents.map((event, index) => (
            <ReferenceDot
              key={`switch-${event.time}-${index}`}
              x={event.time} y={event.bandwidth} yAxisId="left"
              r={6} fill="#3B82F6" stroke="white"
              label={{ value: 'Switch', fill: '#3B82F6', position: 'bottom' }}
            />
          ))}

          <Line yAxisId="left" type="monotone" dataKey="bandwidth" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line yAxisId="left" type="monotone" dataKey="buffer" stroke="#00ff41" />
          <Line yAxisId="right" type="monotone" dataKey="delay" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Dashboard;