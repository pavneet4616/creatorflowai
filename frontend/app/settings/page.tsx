"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-8 md:p-12 pb-24 bg-background">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your API keys and storage providers.</p>
        </header>

        <div className="space-y-6">
          {/* Google AI Provider */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-2xl">Google AI</CardTitle>
                <CardDescription className="mt-1">Active Models: Nano Banana Pro • Veo 3.1 Preview</CardDescription>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">API Key</label>
                <Input type="password" placeholder="AIzaSy..." className="bg-black/20 border-white/10" defaultValue="••••••••••••••••" />
              </div>
            </CardContent>
          </Card>

          {/* Backblaze Storage Provider */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-2xl">Backblaze Storage</CardTitle>
                <CardDescription className="mt-1">Target Bucket: creatorflow-assets</CardDescription>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Key ID</label>
                  <Input type="text" placeholder="Your Application Key ID" className="bg-black/20 border-white/10" defaultValue="0056d21bf7..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Application Key</label>
                  <Input type="password" placeholder="Your Application Key" className="bg-black/20 border-white/10" defaultValue="••••••••••••••••" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Bucket Name</label>
                <Input type="text" placeholder="creatorflow-bucket" className="bg-black/20 border-white/10" defaultValue="creatorflow-assets" />
              </div>
            </CardContent>
          </Card>

          {/* Save Action */}
          <div className="flex justify-end pt-4">
            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-violet-500/20 transition-all px-8">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
