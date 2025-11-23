'use client';

import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { mockActivityData } from '@/lib/mockData';

export default function ActivityHeatmap() {
  const [activityData, setActivityData] = useState<Array<{ date: string; count: number }>>([]);

  useEffect(() => {
    setActivityData(mockActivityData);
  }, []);

  // Custom class for heatmap styling
  const getClassForValue = (value: { count: number } | null) => {
    if (!value || value.count === 0) {
      return 'color-empty';
    }
    if (value.count <= 1) {
      return 'color-scale-1';
    }
    if (value.count <= 2) {
      return 'color-scale-2';
    }
    if (value.count <= 3) {
      return 'color-scale-3';
    }
    return 'color-scale-4';
  };

  // Transform data for react-calendar-heatmap
  const heatmapData = activityData.map((item) => ({
    date: item.date,
    count: item.count,
  }));

  return (
    <div className="w-full">
      <style jsx global>{`
        .react-calendar-heatmap {
          font-family: var(--font-geist-sans);
        }
        .react-calendar-heatmap .color-empty {
          fill: #1a1a1a;
        }
        .react-calendar-heatmap .color-scale-1 {
          fill: #1e3a8a;
        }
        .react-calendar-heatmap .color-scale-2 {
          fill: #1e40af;
        }
        .react-calendar-heatmap .color-scale-3 {
          fill: #2563eb;
        }
        .react-calendar-heatmap .color-scale-4 {
          fill: #3b82f6;
        }
        .react-calendar-heatmap text {
          fill: #9ca3af;
          font-size: 10px;
        }
        .react-calendar-heatmap .react-calendar-heatmap-small-text {
          font-size: 8px;
        }
      `}</style>
      <CalendarHeatmap
        startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
        endDate={new Date()}
        values={heatmapData}
        classForValue={getClassForValue}
        tooltipDataAttrs={(value: { date: string; count: number } | null) => {
          if (!value) return {};
          return {
            'data-tip': `${value.date}: ${value.count} activities`,
          };
        }}
      />
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-[#1a1a1a] rounded"></div>
          <div className="w-3 h-3 bg-[#1e3a8a] rounded"></div>
          <div className="w-3 h-3 bg-[#1e40af] rounded"></div>
          <div className="w-3 h-3 bg-[#2563eb] rounded"></div>
          <div className="w-3 h-3 bg-[#3b82f6] rounded"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

