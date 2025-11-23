import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  subtitle?: string;
  className?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  subtitle,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm',
        'hover:border-gray-700 transition-colors',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-400 text-sm font-medium">{label}</div>
        <div className="text-blue-400">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      {subtitle && (
        <div className="text-gray-500 text-sm">{subtitle}</div>
      )}
    </div>
  );
}

