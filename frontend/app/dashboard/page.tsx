"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, LayoutGrid, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8 md:p-12 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto z-10 relative">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back to CreatorFlow AI.</p>
          </div>
          <Link href="/projects/new">
            <Button className="glass hover:bg-white/10 gap-2">
              <Plus className="w-4 h-4" /> New Project
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link href="/projects">
              <Card className="glass-card hover:border-white/20 transition-all cursor-pointer h-full">
                <CardHeader>
                  <LayoutGrid className="w-8 h-8 mb-4 text-violet-400" />
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>View and manage your active media pipelines.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link href="/history">
              <Card className="glass-card hover:border-white/20 transition-all cursor-pointer h-full">
                <CardHeader>
                  <Clock className="w-8 h-8 mb-4 text-blue-400" />
                  <CardTitle>History</CardTitle>
                  <CardDescription>Review past runs and download manifests.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link href="/settings">
              <Card className="glass-card hover:border-white/20 transition-all cursor-pointer h-full">
                <CardHeader>
                  <Settings className="w-8 h-8 mb-4 text-zinc-400" />
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure API keys and user preferences.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          <Card className="glass-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              No recent pipeline runs. Create a new project to get started!
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
