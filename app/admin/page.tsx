"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/notifications-context";
import StatsCards from "@/components/admin/stats-cards";
import OverviewChart from "@/components/admin/overview-chart";
import RecentActivityList from "@/components/admin/recent-activity-list";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { addNotification } = useNotifications();

  // Mock stats data
  const stats = {
    users: 1254,
    podcasts: 87,
    audiobooks: 42,
    broadcasts: 16,
  };

  const handleTestNotification = () => {
    addNotification({
      title: "Test Notification",
      message: "This is a test notification from the admin dashboard.",
      type: "info",
    });
  };

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: "1",
      title: "Live Podcast Recording",
      date: "Oct 15, 2023",
      time: "6:00 PM",
    },
    {
      id: "2",
      title: "Meet & Greet with Hosts",
      date: "Oct 22, 2023",
      time: "3:00 PM",
    },
    {
      id: "3",
      title: "Audiobook Launch Event",
      date: "Nov 5, 2023",
      time: "7:00 PM",
    },
  ];

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
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome to the WaveStream admin dashboard.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <Button
            onClick={handleTestNotification}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Test Notification
          </Button>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <StatsCards stats={stats} />
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-8">
        <motion.div variants={itemVariants}>
          <TabsList className="bg-slate-100 dark:bg-slate-800/60">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="bg-white dark:bg-slate-800 pb-2">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                    Platform Activity
                  </CardTitle>
                  <CardDescription>
                    User engagement and content metrics for the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <OverviewChart />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 dark:border-slate-700 shadow-sm h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                      Upcoming Events
                    </CardTitle>
                    <Link
                      href="/admin/events"
                      className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center"
                    >
                      View all
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                  <CardDescription>
                    Events scheduled for the next 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60"
                      >
                        <div className="mr-4 rounded-md bg-purple-100 dark:bg-purple-900/30 p-2 text-purple-600 dark:text-purple-400">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {event.title}
                          </h4>
                          <div className="flex items-center mt-1 text-sm text-slate-500 dark:text-slate-400">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>{event.date}</span>
                            <Clock className="ml-3 mr-1 h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule New Event
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                    Recent Activity
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    Refresh
                  </Button>
                </div>
                <CardDescription>
                  Latest actions across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivityList />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics">
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                  Analytics
                </CardTitle>
                <CardDescription>
                  Detailed analytics and insights about your platform
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Analytics Dashboard Coming Soon
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  We're working on a comprehensive analytics dashboard to help
                  you track and analyze your platform's performance.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="reports">
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                  Reports
                </CardTitle>
                <CardDescription>
                  Generate and view detailed reports
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Reports Dashboard Coming Soon
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  We're building a powerful reporting system to help you
                  generate and analyze custom reports for your business needs.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
