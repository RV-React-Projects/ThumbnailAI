"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { ArrowRight, Sparkles, Clock, Eye, Download } from "lucide-react";
import Link from "next/link";
import { Template, TemplateCategory } from "@src/types/template";

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

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group cursor-pointer"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
        <div className="relative">
          {/* Template Preview */}
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
            {/* Simulated thumbnail preview based on template data */}
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: template.canvas.backgroundColor || '#f3f4f6' }}
            >
              {/* Render basic shapes based on template layers */}
              {template.layers.map((layer, index) => {
                if (layer.type === 'text' && layer.text) {
                  return (
                    <div
                      key={layer.id}
                      className="absolute font-bold"
                      style={{
                        left: `${(layer.x / template.canvas.width) * 100}%`,
                        top: `${(layer.y / template.canvas.height) * 100}%`,
                        fontSize: `${Math.max(8, (layer.fontSize || 24) / 8)}px`,
                        color: layer.fill || '#000000',
                        fontFamily: layer.fontFamily || 'Inter',
                        transform: 'scale(0.8)',
                        transformOrigin: 'top left'
                      }}
                    >
                      {layer.text}
                    </div>
                  );
                }
                if (layer.type === 'rect') {
                  return (
                    <div
                      key={layer.id}
                      className="absolute"
                      style={{
                        left: `${(layer.x / template.canvas.width) * 100}%`,
                        top: `${(layer.y / template.canvas.height) * 100}%`,
                        width: `${((layer.width || 100) / template.canvas.width) * 100}%`,
                        height: `${((layer.height || 100) / template.canvas.height) * 100}%`,
                        backgroundColor: layer.fill || '#ddd',
                        borderRadius: layer.cornerRadius ? `${layer.cornerRadius / 4}px` : '0',
                        opacity: layer.opacity || 1,
                        border: layer.stroke ? `${(layer.strokeWidth || 1) / 2}px solid ${layer.stroke}` : 'none'
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>
            
            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <div className="text-center">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100 mb-2"
                >
                  Use Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="text-white text-sm">
                  Click to customize
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              className={`${categoryColors[template.category]} text-white border-0 text-xs`}
            >
              {template.category}
            </Badge>
          </div>
          
          {/* Recommended Badge */}
          {template.meta.recommended && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-yellow-500 text-white border-0 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            </div>
          )}

          {/* Difficulty Badge */}
          <div className="absolute bottom-3 right-3">
            <Badge 
              variant="outline" 
              className="bg-white/90 backdrop-blur-sm text-xs"
            >
              <Clock className="w-3 h-3 mr-1" />
              {template.meta.difficulty || 'easy'}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {template.name}
            </h3>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
          </div>
          
          {template.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {template.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-4">
            {template.meta.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag}
                variant="outline"
                className="text-xs text-gray-500 border-gray-200"
              >
                {tag}
              </Badge>
            ))}
            {template.meta.tags.length > 3 && (
              <Badge 
                variant="outline"
                className="text-xs text-gray-500 border-gray-200"
              >
                +{template.meta.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{Math.floor(Math.random() * 1000) + 100}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>{Math.floor(Math.random() * 500) + 50}</span>
              </div>
            </div>
            <div className="capitalize">
              {template.meta.difficulty} Level
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button 
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Link href={`/editor/${template.id}`}>
                Customize Template
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
