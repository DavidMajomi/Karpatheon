'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface SkillData {
  subject: string;
  A: number;
  fullMark: number;
}

interface RadarSkillChartProps {
  data: SkillData[];
}

export default function RadarSkillChart({ data }: RadarSkillChartProps) {
  // Transform data for Recharts
  const chartData = data.map((item) => ({
    subject: item.subject,
    score: item.A,
    fullMark: item.fullMark,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="#404040" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            className="text-gray-400"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 150]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
          />
          <Radar
            name="Skills"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

