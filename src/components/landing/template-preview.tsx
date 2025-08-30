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
  Technology: "bg-primary",
  Gaming: "bg-primary",
  Agriculture: "bg-primary",
  Cooking: "bg-primary",
  Travel: "bg-primary",
  Finance: "bg-primary",
  Education: "bg-primary",
  Vlogs: "bg-primary",
  Business: "bg-primary",
  Health: "bg-primary"
};

export function TemplatePreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose from 
            <span className="royal-gradient-text">
              {" "}50+ Templates
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
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
                  className="px-4 py-2 text-sm font-medium bg-card border border-border hover:border-primary transition-colors cursor-pointer"
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
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card">
                <div className="relative">
                  {/* Template Preview Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-2">
                          {template.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
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
                        className="bg-background text-foreground hover:bg-accent"
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
                      <Badge className="bg-primary text-white border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.meta.tags.slice(0, 2).map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline"
                        className="text-xs text-muted-foreground border-border"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">
                      {template.meta.difficulty} Level
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
            className="royal-gradient hover:opacity-90 text-white px-8 py-6 rounded-xl text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
          >
            <Link href="/templates">
              Browse All Templates
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="text-muted-foreground mt-4">
            50+ professional templates • New designs added weekly
          </p>
        </motion.div>
      </div>
    </section>
  );
}
