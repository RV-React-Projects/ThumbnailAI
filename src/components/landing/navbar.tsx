"use client";

import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import { Zap, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@components/theme/theme-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 royal-gradient rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold royal-gradient-text">
                ThumbnailAI
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/templates" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Templates
            </Link>
            <Link 
              href="/editor" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Editor
            </Link>
            <Link 
              href="/pricing" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link 
              href="/examples" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Examples
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Sign In
            </Button>
            <Button 
              className="royal-gradient hover:opacity-90 text-white border-0"
            >
              Get Started Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4 border-t border-border">
            <Link 
              href="/templates" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Templates
            </Link>
            <Link 
              href="/editor" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Editor
            </Link>
            <Link 
              href="/pricing" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/examples" 
              className="block text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Examples
            </Link>
            <div className="pt-4 space-y-2 border-t border-border">
              <Button variant="ghost" className="w-full justify-start text-foreground">
                Sign In
              </Button>
              <Button className="w-full royal-gradient text-white">
                Get Started Free
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

