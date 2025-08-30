"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import {
  Palette,
  Zap,
  Download,
  Layers,
  Sparkles,
  BarChart3,
  Wand2,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "AI-Powered Templates",
    description: "Choose from 50+ professionally designed templates optimized for different content categories.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: Layers,
    title: "Layer-Based Editor",
    description: "Drag, drop, and customize text, images, and shapes with pixel-perfect precision.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    icon: Wand2,
    title: "One-Click Magic",
    description: "Generate multiple thumbnail variants instantly for A/B testing your content.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10"
  },
  {
    icon: Download,
    title: "Export Optimization",
    description: "Download high-quality thumbnails optimized for YouTube's 1280×720 requirements.",
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    icon: Sparkles,
    title: "Brand Presets",
    description: "Save your channel colors, fonts, and logos for consistent branding across all thumbnails.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10"
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track which thumbnail variants perform best to optimize your click-through rates.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create professional thumbnails in under 2 minutes with our streamlined workflow.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  },
  {
    icon: Smartphone,
    title: "Mobile Preview",
    description: "See how your thumbnails look on desktop and mobile devices before publishing.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Create
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Viral Thumbnails
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive toolkit provides all the features you need to create 
            thumbnails that stand out and drive more views to your content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-16 h-16 mx-auto rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </motion.div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                AI-Powered Suggestions
              </h3>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                Our AI analyzes your content and suggests the best template styles, 
                colors, and layouts to maximize engagement for your specific niche.
              </p>
              <div className="flex justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">87%</div>
                  <div className="text-blue-200">Avg. CTR Increase</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">2.3x</div>
                  <div className="text-blue-200">Faster Creation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">95%</div>
                  <div className="text-blue-200">User Satisfaction</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

