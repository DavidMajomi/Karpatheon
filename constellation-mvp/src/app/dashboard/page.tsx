'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import RadarSkillChart from '@/components/dashboard/RadarSkillChart';
import ActivityHeatmap from '@/components/dashboard/ActivityHeatmap';
import StatCard from '@/components/dashboard/StatCard';
import { Trophy, Flame, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { userStats, initialize } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Player Card
        </h1>
        <p className="text-gray-400">Your knowledge journey at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Trophy className="w-6 h-6" />}
          label="Level"
          value={userStats.level}
          subtitle="Knowledge Master"
        />
        <StatCard
          icon={<Flame className="w-6 h-6" />}
          label="Streak"
          value={userStats.streak}
          subtitle="days active"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Total Nodes"
          value={55}
          subtitle="knowledge stars"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Skill Distribution</h2>
          <RadarSkillChart data={userStats.skillDistribution} />
        </div>

        {/* Activity Heatmap */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Activity Heatmap</h2>
          <ActivityHeatmap />
        </div>
      </div>
    </div>
  );
}

