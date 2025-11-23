'use client'

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { Search, MoreVertical, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useMemo } from 'react'

export function TimeSpentSidebar() {
    // -------------------------------
    // 🔥 Proper Mocked API JSON
    // -------------------------------
    const apiResponse = useMemo(() => ({
        weeklyTime: [
            { day: 'Mon', hours: 5 },
            { day: 'Tue', hours: 7 },
            { day: 'Wed', hours: 3 },
            { day: 'Thu', hours: 6 },
            { day: 'Fri', hours: 4 },
            { day: 'Sat', hours: 2 },
            { day: 'Sun', hours: 1 },
        ]
    }), [])

    const data = apiResponse.weeklyTime
    const maxHours = Math.max(...data.map(d => d.hours), 1)

    return (
        <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-background shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <span className="font-medium text-foreground">Time Spent</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </div>


            {/* Body */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                <div className="space-y-3">

                    {/* Weekly Chart */}
                    <div className="rounded-lg bg-muted/30 p-3 border border-border/40">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">Weekly Overview</span>
                            <Clock className="h-4 w-4 text-accent" />
                        </div>

                        <div className="h-28 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                    <YAxis hide />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="hours"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        fill="#6366f144"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Daily Breakdown */}
                    {data.map((d) => (
                        <div
                            key={d.day}
                            className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50"
                        >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center 
                rounded bg-accent/10 text-accent"
                            >
                                <Clock className="h-4 w-4" />
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm text-foreground">{d.day}</span>
                                </div>

                                {/* bar */}
                                <div className="h-2 w-full rounded bg-muted/40">
                                    <div
                                        className="h-full rounded bg-primary/70"
                                        style={{ width: `${(d.hours / maxHours) * 100}%` }}
                                    />
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    {d.hours} hours
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    )
}
