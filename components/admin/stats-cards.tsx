"use client";

import { Users, Headphones, BookOpen, Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatsCardsProps {
  stats: {
    users: number;
    podcasts: number;
    audiobooks: number;
    broadcasts: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Users
                  </h3>
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                    +12%
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.users.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  +152 this month
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 flex items-center justify-center w-24">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Podcasts
                  </h3>
                  <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-1.5 py-0.5 rounded-full">
                    +4
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.podcasts}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  +4 new this week
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 flex items-center justify-center w-24">
                <Headphones className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Audiobooks
                  </h3>
                  <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                    +2
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.audiobooks}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  +2 new this week
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/30 flex items-center justify-center w-24">
                <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Active Broadcasts
                  </h3>
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.broadcasts}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  3 live now
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 flex items-center justify-center w-24">
                <Radio className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
