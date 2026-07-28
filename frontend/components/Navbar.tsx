"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Projects", href: "/history" },
    { name: "History", href: "/history" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Branding */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
            CreatorFlow <span className="text-violet-400 text-xs font-mono px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          <Link href="/projects/new">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-violet-500/20 transition-all gap-1.5 px-4 h-9 text-sm">
              <Plus className="w-4 h-4" /> New Project
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
