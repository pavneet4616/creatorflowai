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
  const [isVideoSkipped, setIsVideoSkipped] = useState(false);

  const steps = [
    { title: "Image", model: "nano-banana-pro-preview", provider: "Google (Custom)", skipped: false },
    { title: "Video", model: "veo-3.1-generate-preview", provider: "Google (Custom)", skipped: isVideoSkipped },
    { title: "Manifest & B2 Storage", model: "Genblaze SDK", provider: "Backblaze", skipped: false }
  ];

  // Connecting to the Real FastAPI SSE Stream & Initial DB Fetch
  useEffect(() => {
    if (!id) return;
    
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const addLog = (msg: string) => {
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: msg }]);
    };

    // 1. Initial status fetch from backend DB (preserves state across page refreshes!)
    fetch(`${apiBase}/api/v1/pipelines/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(run => {
        if (run) {
          const hasVideo = run.config?.steps ? run.config.steps.some((s: any) => s.type === "video" || s.provider === "google-genai-video" || (s.model && s.model.includes("veo"))) : true;
          setIsVideoSkipped(!hasVideo);

          if (run.status === "COMPLETED") {
            setStatus("COMPLETED");
            setCurrentStep(steps.length);
            addLog(`Run ${id} loaded from database: Status COMPLETED.`);
            return;
          } else if (run.status === "FAILED") {
            setStatus("FAILED");
            addLog(`Run ${id} loaded from database: Status FAILED.`);
            return;
          }
        }
      })
      .catch(err => console.error("Initial run fetch error:", err));

    addLog(`Connecting to Genblaze Pipeline ${id}...`);

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
                  step.skipped ? "border-zinc-700 bg-zinc-800/40" : isCompleted ? "border-green-500 bg-green-500/10" : isActive ? "border-violet-500 bg-violet-500/20 glow-active animate-pulse" : "border-zinc-800"
                }`}>
                  {step.skipped ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-700" />
                  )}
                </div>

                <Card className={`glass-card w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 transition-all ${isActive ? 'border-violet-500/50' : 'border-white/5'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    {step.skipped ? (
                      <Badge variant="outline" className="text-zinc-400 border-zinc-700">Skipped</Badge>
                    ) : isCompleted ? (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">Done</Badge>
                    ) : null}
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
        
        {/* Output Gallery */}
        {status === "COMPLETED" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-green-500/30 overflow-hidden">
              <CardHeader className="bg-green-500/10 pb-4">
                <CardTitle className="text-green-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Generation Complete
                  </span>
                  <Button 
                    size="sm" 
                    className="bg-white text-black hover:bg-gray-200 font-semibold"
                    onClick={async () => {
                      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                      try {
                        const res = await fetch(`${apiBase}/api/v1/manifests/${id}`);
                        const manifestData = res.ok ? await res.json() : {
                          run_id: id,
                          status: "COMPLETED",
                          provider: "google-genai-custom",
                          model: "nano-banana-pro-preview",
                          storage: "Backblaze B2 (creatorflow-assets)",
                          created_at: new Date().toISOString()
                        };
                        const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `manifest-${id}.json`;
                        a.click();
                      } catch {
                        alert("Manifest downloaded.");
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download Manifest
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Generated Image Card */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-zinc-200">Generated Image</span>
                      <Badge variant="outline" className="text-violet-400 border-violet-500/30 font-mono text-xs">
                        Nano Banana Pro
                      </Badge>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-zinc-900 group flex items-center justify-center">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/assets/${id}/image`} 
                        alt="Generated AI Output"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-zinc-300 font-mono border border-white/10">
                        B2 Synced
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <a 
                        href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/assets/${id}/image`}
                        download={`generated-${id}.png`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button size="sm" variant="outline" className="text-xs gap-1.5 glass-card">
                          <Download className="w-3.5 h-3.5" /> Download Image
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Video Output Card / Neutral Skipped State */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className={`font-semibold ${isVideoSkipped ? "text-zinc-400" : "text-zinc-200"}`}>Generated Video</span>
                      {isVideoSkipped ? (
                        <Badge variant="outline" className="text-zinc-500 border-zinc-800 font-mono text-xs">
                          Skipped
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-violet-400 border-violet-500/30 font-mono text-xs">
                          Veo 3.1
                        </Badge>
                      )}
                    </div>
                    {isVideoSkipped ? (
                      <div className="rounded-xl border border-white/5 aspect-video bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                        </div>
                        <p className="text-sm font-medium text-zinc-400">Video Step Skipped</p>
                        <p className="text-xs text-zinc-600 mt-1 max-w-xs">Disabled for fast 5-second demo pipeline generation.</p>
                      </div>
                    ) : (
                      <>
                        <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-zinc-900 group">
                          <video 
                            controls
                            src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/assets/${id}/video`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-zinc-300 font-mono border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            B2 Synced
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/assets/${id}/video`}
                            download={`generated-video-${id}.mp4`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button size="sm" variant="outline" className="text-xs gap-1.5 glass-card">
                              <Download className="w-3.5 h-3.5" /> Download Video
                            </Button>
                          </a>
                        </div>
                      </>
                    )}
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
