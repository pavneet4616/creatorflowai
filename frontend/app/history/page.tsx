"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mockHistory = [
  { id: "run-9x8f7d", prompt: "A futuristic cyber-city at sunset...", status: "COMPLETED", date: "Today, 10:42 AM" },
  { id: "run-3k4m2p", prompt: "Cinematic establishing shot of a mountain...", status: "COMPLETED", date: "Yesterday, 3:15 PM" },
  { id: "run-1m2n3b", prompt: "Marketing video for a new sneaker drop...", status: "FAILED", date: "Aug 12, 1:20 PM" },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen p-8 md:p-12 bg-background">
      <div className="max-w-4xl mx-auto z-10 relative">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Run History</h1>
          <p className="text-muted-foreground mt-2">View past generations, pipelines, and manifests.</p>
        </header>

        <Card className="glass-card">
          <CardContent className="p-0">
            <ScrollArea className="h-[600px] w-full">
              {mockHistory.map((run, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={run.id}
                  className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-violet-400">{run.id}</span>
                      <Badge variant={run.status === "COMPLETED" ? "default" : "destructive"} 
                             className={run.status === "COMPLETED" ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : ""}>
                        {run.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{run.date}</span>
                    </div>
                    <p className="font-medium text-zinc-300 truncate max-w-md">{run.prompt}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="glass-card">
                      <Download className="w-4 h-4 mr-2" /> Manifest
                    </Button>
                    <Link href={`/project?id=${run.id}`}>
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        View Results <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
