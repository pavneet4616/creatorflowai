"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-8 md:p-12 bg-background">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your API keys and workflow preferences.</p>
        </header>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Google AI Configuration</CardTitle>
              <CardDescription>Required for Nano Banana, Veo, and Lyria.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">API Key</label>
                <Input type="password" placeholder="AIzaSy..." className="bg-black/20 border-white/10" defaultValue="••••••••••••••••" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Backblaze B2 (Genblaze Sink)</CardTitle>
              <CardDescription>Where your assets and manifests are stored.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Key ID</label>
                  <Input type="text" placeholder="Your Application Key ID" className="bg-black/20 border-white/10" defaultValue="003e83..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Application Key</label>
                  <Input type="password" placeholder="Your Application Key" className="bg-black/20 border-white/10" defaultValue="••••••••" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Bucket Name</label>
                <Input type="text" placeholder="creatorflow-bucket" className="bg-black/20 border-white/10" defaultValue="creatorflow-assets" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
