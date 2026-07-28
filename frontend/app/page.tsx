"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <main className="z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-6">
            Build complete AI <br /> media pipelines.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-xl md:text-2xl text-muted-foreground mb-12"
        >
          Generate. Store. Verify. Download.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-10"
        >
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-violet-500/25 transition-all">
              Go to Dashboard
            </Button>
          </Link>

          {/* Powered By Trust Row */}
          <div className="pt-8 flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-500 font-mono border-t border-white/5">
            <span>Powered by</span>
            <span className="text-zinc-300 font-semibold">Genblaze SDK</span>
            <span>•</span>
            <span className="text-zinc-300 font-semibold">Google AI</span>
            <span>•</span>
            <span className="text-zinc-300 font-semibold">Backblaze B2</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
