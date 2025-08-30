"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Template, TemplateCategory } from "@src/types/template";

const previewTemplates: Pick<Template, 'id' | 'name' | 'category' | 'preview' | 'meta'>[] = [
  {
    id: "tech_bold_split",
    name: "Tech Bold Split",
    category: "Technology",
    preview: "/templates/tech_bold_split.jpg",
    meta: {
      tags: ["neon", "split", "modern"],
      recommended: true,
      difficulty: "easy",
      createdAt: "2024-01-01T00:00:00Z"
    }
  },
  {
    id: "gaming_action",
    name: "Gaming Action",
    category: "Gaming",
    preview: "/templates/gaming_action.jpg",
    meta: {
      tags: ["action", "colorful", "character"],
      recommended: true,
      difficulty: "medium",
      createdAt: "2024-01-01T00:00:00Z"
    }
  },
  {
    id: "cooking_recipe",
    name: "Delicious Recipe",
    category: "Cooking",
    preview: "/templates/cooking_recipe.jpg",
    meta: {
      tags: ["cooking", "warm", "appetizing"],
      recommended: true,
      difficulty: "easy",
      createdAt: "2024-01-01T00:00:00Z"
    }
  },
  {
    id: "travel_adventure",
    name: "Travel Adventure",
    category: "Travel",
    preview: "/templates/travel_adventure.jpg",
    meta: {
      tags: ["travel", "inspiring", "scenic"],
      recommended: true,
      difficulty: "medium",
      createdAt: "2024-01-01T00:00:00Z"
    }
  }
];

const categoryColors: Record<TemplateCategory, string> = {
  Technology: "bg-blue-500",
  Gaming: "bg-purple-500",
  Agriculture: "bg-green-500",
  Cooking: "bg-orange-500",
  Travel: "bg-cyan-500",
  Finance: "bg-emerald-500",
  Education: "bg-indigo-500",
  Vlogs: "bg-pink-500",
  Business: "bg-slate-500",
  Health: "bg-teal-500"
};

export function TemplatePreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose from 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}50+ Templates
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Professional templates designed for every content category. 
            Each template is optimized for maximum engagement and click-through rates.
          </p>
          
          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {Object.keys(categoryColors).slice(0, 6).map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge 
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  {category}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {previewTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="relative">
                  {/* Template Preview Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-700 mb-2">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          1280 × 720
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    >
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        Use Template
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge 
                      className={`${categoryColors[template.category]} text-white border-0`}
                    >
                      {template.category}
                    </Badge>
                  </div>
                  
                  {/* Recommended Badge */}
                  {template.meta.recommended && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-yellow-500 text-white border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.meta.tags.slice(0, 2).map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline"
                        className="text-xs text-gray-500 border-gray-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 capitalize">
                      {template.meta.difficulty} Level
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-xl text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
          >
            <Link href="/templates">
              Browse All Templates
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="text-gray-500 mt-4">
            50+ professional templates • New designs added weekly
          </p>
        </motion.div>
      </div>
    </section>
  );
}
