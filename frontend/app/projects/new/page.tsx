"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Image as ImageIcon, Video, Music } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default config matching the actual Genblaze SDK Google Provider capabilities
  const [config, setConfig] = useState([
    { type: "image", enabled: true, provider: "google-genai", model: "Nano Banana Pro", icon: ImageIcon },
    { type: "video", enabled: true, provider: "google-genai", model: "Veo 3.1 Preview", icon: Video },
  ]);

  const toggleStep = (index: number) => {
    const newConfig = [...config];
    newConfig[index].enabled = !newConfig[index].enabled;
    setConfig(newConfig);
  };

  const handleStart = async () => {
    if (!prompt) return;
    setIsSubmitting(true);
    
    // In a real app, this would POST to /api/projects, then /api/pipelines/run
    // For MVP frontend demo, we mock the transition to the pipeline inspector
    setTimeout(() => {
      // Mock run ID
      const mockRunId = "run-" + Math.random().toString(36).substr(2, 9);
      router.push(`/project?id=${mockRunId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-8 md:p-12 relative overflow-hidden bg-background flex flex-col items-center justify-center">
      <div className="absolute top-10 left-10 w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl z-10"
      >
        <Card className="glass-card p-2 border-white/10">
          <CardHeader>
            <CardTitle className="text-3xl">New Workflow</CardTitle>
            <CardDescription className="text-lg">Describe what you want to create.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <Input 
                placeholder="A futuristic cyber-city at sunset..." 
                className="h-16 text-lg bg-black/20 border-white/10 focus-visible:ring-violet-500 rounded-xl"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">PIPELINE CONFIGURATION</h3>
              <div className="flex flex-col md:flex-row gap-4">
                {config.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div 
                      key={step.type}
                      onClick={() => toggleStep(idx)}
                      className={`flex-1 p-4 rounded-xl cursor-pointer transition-all border ${
                        step.enabled 
                          ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                          : 'bg-black/20 border-white/5 opacity-50 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-5 h-5 ${step.enabled ? 'text-violet-400' : 'text-zinc-500'}`} />
                        <span className="font-semibold capitalize">{step.type}</span>
                      </div>
                      <div className="text-xs text-zinc-300 font-medium">
                        {step.model}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-4 border-t border-white/5">
            <Button 
              size="lg" 
              className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-violet-500/25 transition-all px-8 h-12 text-base"
              onClick={handleStart}
              disabled={isSubmitting || !prompt}
            >
              {isSubmitting ? "Starting Pipeline..." : (
                <>
                  <Play className="w-4 h-4 mr-2" fill="currentColor" /> Generate
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
