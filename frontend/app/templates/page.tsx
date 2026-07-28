"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clapperboard, MonitorPlay, Megaphone, Smartphone } from "lucide-react";
import Link from "next/link";

const templates = [
  { title: "Marketing Video", desc: "Short, punchy video with voiceover and background music.", icon: Megaphone, color: "text-blue-400" },
  { title: "Product Ad", desc: "High quality product showcase with 3D transitions.", icon: MonitorPlay, color: "text-violet-400" },
  { title: "Movie Trailer", desc: "Cinematic generation pipeline optimized for Veo 3.1.", icon: Clapperboard, color: "text-amber-400" },
  { title: "Social Media Post", desc: "Vertical video optimized for engagement.", icon: Smartphone, color: "text-pink-400" },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen p-8 md:p-12 bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Pipeline Templates</h1>
          <p className="text-muted-foreground text-lg">Pre-configured Genblaze workflows for rapid media generation.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((tpl, i) => {
            const Icon = tpl.icon;
            return (
              <motion.div key={tpl.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-card hover:border-white/20 transition-all flex flex-col h-full">
                  <CardHeader className="flex-1">
                    <Icon className={`w-8 h-8 mb-4 ${tpl.color}`} />
                    <CardTitle className="text-2xl">{tpl.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{tpl.desc}</CardDescription>
                  </CardHeader>
                  <div className="p-6 pt-0 mt-auto">
                    <Link href={`/projects/new?template=${tpl.title.toLowerCase().replace(" ", "-")}`}>
                      <Button className="w-full bg-white text-black hover:bg-gray-200 gap-2">
                        <Play className="w-4 h-4" /> Use Template
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
