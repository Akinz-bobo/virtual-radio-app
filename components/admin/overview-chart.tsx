"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for the chart
const mockData = [
  { name: "Jan", users: 400, podcasts: 24, audiobooks: 18 },
  { name: "Feb", users: 450, podcasts: 28, audiobooks: 20 },
  { name: "Mar", users: 520, podcasts: 32, audiobooks: 22 },
  { name: "Apr", users: 590, podcasts: 38, audiobooks: 24 },
  { name: "May", users: 680, podcasts: 42, audiobooks: 28 },
  { name: "Jun", users: 750, podcasts: 48, audiobooks: 30 },
  { name: "Jul", users: 890, podcasts: 52, audiobooks: 34 },
  { name: "Aug", users: 980, podcasts: 58, audiobooks: 36 },
  { name: "Sep", users: 1100, podcasts: 62, audiobooks: 38 },
  { name: "Oct", users: 1200, podcasts: 68, audiobooks: 40 },
  { name: "Nov", users: 1280, podcasts: 72, audiobooks: 42 },
  { name: "Dec", users: 1350, podcasts: 78, audiobooks: 44 },
];

export default function OverviewChart() {
  const [data, setData] = useState(mockData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // In a real app, fetch data from API
    // For now, we'll use the mock data
    setData(mockData);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        Loading chart...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderColor: "#e2e8f0",
            borderRadius: "0.375rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          labelStyle={{ color: "#334155", fontWeight: 600 }}
        />
        <Bar
          dataKey="users"
          fill="rgba(0, 105, 105, 0.8)"
          radius={[4, 4, 0, 0]}
          name="Users"
        />
        <Bar
          dataKey="podcasts"
          fill="rgba(0, 84, 84, 0.7)"
          radius={[4, 4, 0, 0]}
          name="Podcasts"
        />
        <Bar
          dataKey="audiobooks"
          fill="rgba(0, 64, 64, 0.6)"
          radius={[4, 4, 0, 0]}
          name="Audiobooks"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
