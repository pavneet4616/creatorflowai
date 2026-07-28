"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, LayoutGrid, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiBase}/api/v1/pipelines`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setRuns(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-violet-500/20 transition-all gap-2 px-5">
              <Plus className="w-4 h-4" /> New Project
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link href="/history">
              <Card className="glass-card hover:border-white/20 transition-all cursor-pointer h-full">
                <CardHeader>
                  <LayoutGrid className="w-8 h-8 mb-4 text-violet-400" />
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>View and manage your active media pipelines.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
          {runs.length > 0 ? (
            <div className="space-y-4">
              {runs.slice(0, 3).map((run) => (
                <Card key={run.id} className="glass-card hover:border-white/20 transition-all p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-violet-400">{run.id}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400">{run.status || "COMPLETED"}</Badge>
                      </div>
                      <p className="text-sm font-medium text-zinc-200">{run.prompt}</p>
                    </div>
                    <Link href={`/project?id=${run.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-card border-dashed border-white/10">
              <CardContent className="p-12 text-center flex flex-col items-center justify-center gap-4">
                <p className="text-lg text-zinc-300 font-medium">No workflows yet.</p>
                <p className="text-sm text-muted-foreground max-w-sm">Create your first AI pipeline to generate media and track outputs.</p>
                <Link href="/projects/new" className="mt-2">
                  <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-violet-500/20 transition-all gap-2 px-6">
                    <Plus className="w-4 h-4" /> Create First Workflow
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
