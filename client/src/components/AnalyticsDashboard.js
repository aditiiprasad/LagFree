import React from 'react';

const StatCard = ({ label, value, unit }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
    <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</div>
    <div className="text-3xl font-bold text-white mt-1">
      {value}
      {unit && <span className="text-lg ml-1">{unit}</span>}
    </div>
  </div>
);

const AnalyticsDashboard = ({ analytics }) => {
  const {
    playbackTime,
    rebufferCount,
    avgBitrate,
    qoeScore
  } = analytics;

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  

  return (
    <div className="my-6">
      <h2 className="text-2xl font-semibold text-white mb-4">Playback Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="QoE Score (MOS)" value={qoeScore.toFixed(2)} unit="/ 5" />
        <StatCard label="Avg. Bitrate" value={Math.round(avgBitrate)} unit="kbps" />
        <StatCard label="Total Rebuffers" value={rebufferCount} />
        <StatCard label="Playback Time" value={formatTime(playbackTime)} />
       
      </div>
    </div>
  );
};

export default AnalyticsDashboard;