"use client";

import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import { Zap, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ThumbnailAI
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/templates" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Templates
            </Link>
            <Link 
              href="/editor" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Editor
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link 
              href="/examples" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Examples
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              Sign In
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              Get Started Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
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
          <div className="py-4 space-y-4 border-t border-gray-200/50">
            <Link 
              href="/templates" 
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Templates
            </Link>
            <Link 
              href="/editor" 
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Editor
            </Link>
            <Link 
              href="/pricing" 
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/examples" 
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Examples
            </Link>
            <div className="pt-4 space-y-2 border-t border-gray-200/50">
              <Button variant="ghost" className="w-full justify-start text-gray-700">
                Sign In
              </Button>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Get Started Free
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

