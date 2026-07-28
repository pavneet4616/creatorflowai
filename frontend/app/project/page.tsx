"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Loader2, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogEvent {
  time: string;
  message: string;
}

function PipelineInspector() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  
  const [status, setStatus] = useState("IN_PROGRESS");
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<LogEvent[]>([]);

  const steps = [
    { title: "Image", model: "nano-banana-pro-preview", provider: "Google (Custom)" },
    { title: "Video", model: "veo-3.1-generate-preview", provider: "Google (Custom)" },
    { title: "Manifest & B2 Storage", model: "Genblaze SDK", provider: "Backblaze" }
  ];

  // Connecting to the Real FastAPI SSE Stream
  useEffect(() => {
    if (!id) return;
    
    const addLog = (msg: string) => {
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: msg }]);
    };

    addLog(`Connecting to Genblaze Pipeline ${id}...`);

    // Using the FastAPI backend URL directly for the hackathon local dev
    // In production, we should ideally use NEXT_PUBLIC_API_URL, but keeping as is for now
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const es = new EventSource(`${apiBase}/api/v1/pipelines/${id}/stream`);

    es.addEventListener("pipeline.started", (e) => {
      addLog(`Pipeline started.`);
    });

    es.addEventListener("step.started", (e) => {
      try {
        const data = JSON.parse(e.data);
        addLog(`Started step ${data.step_type || 'generation'}...`);
      } catch {
        addLog(`Started step...`);
      }
    });

    es.addEventListener("step.completed", (e) => {
      addLog(`✓ Step completed.`);
      setCurrentStep(prev => prev + 1);
    });
    
    es.addEventListener("step.failed", (e) => {
      try {
        const data = JSON.parse(e.data);
        addLog(`❌ Step failed: ${data.error || 'Unknown error'}`);
      } catch {
        addLog(`❌ Step failed.`);
      }
      setStatus("FAILED");
      es.close();
    });

    es.addEventListener("pipeline.completed", (e) => {
      setStatus("COMPLETED");
      setCurrentStep(steps.length);
      addLog(`Run Completed. Manifest synced to B2.`);
      es.close();
    });

    es.addEventListener("error", (e) => {
      console.error("SSE Error:", e);
      addLog("Stream connection closed or pipeline completed.");
      setStatus(prev => prev === "IN_PROGRESS" ? "COMPLETED" : prev);
      setCurrentStep(steps.length);
      es.close();
    });

    return () => es.close();
  }, [id]);

  if (!id) {
    return <div className="p-12 text-center text-red-500">No Pipeline ID provided.</div>;
  }

  return (
    <div className="min-h-screen p-8 md:p-12 bg-background flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
      {/* Sidebar Timeline */}
      <div className="w-full md:w-1/3 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Pipeline Inspector</h2>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isActive = currentStep === index && status !== "COMPLETED";

            return (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-colors ${
                  isCompleted ? "border-green-500 bg-green-500/10" : isActive ? "border-violet-500 bg-violet-500/20 glow-active animate-pulse" : "border-zinc-800"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : isActive ? <Loader2 className="w-5 h-5 text-violet-500 animate-spin" /> : <Circle className="w-5 h-5 text-zinc-700" />}
                </div>

                <Card className={`glass-card w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 transition-all ${isActive ? 'border-violet-500/50' : 'border-white/5'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    {isCompleted && <Badge variant="secondary" className="bg-green-500/20 text-green-300">Done</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">{step.model}</p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-2/3 flex flex-col gap-6 pt-[72px]">
        
        {/* Output Gallery (Mocked) */}
        {status === "COMPLETED" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-green-500/30 overflow-hidden">
              <CardHeader className="bg-green-500/10 pb-4">
                <CardTitle className="text-green-400 flex items-center justify-between">
                  Generation Complete
                  <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                    <Download className="w-4 h-4 mr-2" /> Download Manifest
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-48 bg-zinc-900 rounded-lg border border-white/10 flex items-center justify-center text-zinc-600">
                    Image Output
                  </div>
                  <div className="h-48 bg-zinc-900 rounded-lg border border-white/10 flex items-center justify-center text-zinc-600">
                    Video Output
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Live Logs */}
        <Card className="glass-card flex-1 min-h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              Execution Logs <Badge variant="outline" className="ml-2 font-mono">{id}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border border-white/5 bg-black/40 p-4 font-mono text-sm">
              {logs.map((log, i) => (
                <div key={i} className="mb-2 text-zinc-400">
                  <span className="text-violet-400">[{log.time}]</span> {log.message}
                </div>
              ))}
              {status !== "COMPLETED" && (
                <div className="flex items-center gap-2 text-zinc-500 mt-4">
                  <Loader2 className="w-4 h-4 animate-spin" /> Awaiting next event...
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default function PipelineInspectorPage() {
  return (
    <Suspense fallback={<div className="p-12">Loading Inspector...</div>}>
      <PipelineInspector />
    </Suspense>
  );
}
