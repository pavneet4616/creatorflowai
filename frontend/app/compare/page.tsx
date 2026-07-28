"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, CheckCircle2 } from "lucide-react";

export default function CompareModePage() {
  return (
    <div className="min-h-screen p-8 md:p-12 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Compare Mode (A/B Test)</h1>
          <p className="text-muted-foreground text-lg">Compare Genblaze outputs across different models side-by-side.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Option A */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card hover:border-violet-500/50 transition-all cursor-pointer h-full border-2 border-transparent">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-violet-400" /> Option A
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-mono mt-1">Nano Banana 2 (Google)</p>
                </div>
                <Badge variant="outline" className="bg-black/40">2.1s</Badge>
              </CardHeader>
              <CardContent>
                <div className="w-full aspect-video bg-zinc-900 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <span className="text-zinc-600">Generated Image A</span>
                </div>
                <Button className="w-full mt-6 bg-white text-black hover:bg-gray-200">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Select as Winner
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Option B */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card hover:border-blue-500/50 transition-all cursor-pointer h-full border-2 border-transparent">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-400" /> Option B
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-mono mt-1">Imagen 3 (Google)</p>
                </div>
                <Badge variant="outline" className="bg-black/40">3.4s</Badge>
              </CardHeader>
              <CardContent>
                <div className="w-full aspect-video bg-zinc-900 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <span className="text-zinc-600">Generated Image B</span>
                </div>
                <Button className="w-full mt-6 bg-white text-black hover:bg-gray-200">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Select as Winner
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
