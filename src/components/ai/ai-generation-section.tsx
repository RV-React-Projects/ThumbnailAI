"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Sparkles, Wand2, ArrowRight, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { TemplateCategory } from "@src/types/template";

const examplePrompts = [
  "Tech tutorial about JavaScript arrays",
  "Cooking video: Easy pasta recipes",
  "Gaming: Epic boss battle highlights",
  "Travel vlog: Tokyo street food tour",
  "Fitness: 10-minute morning workout",
  "Business: How to start a startup"
];

const generatedExamples = [
  {
    id: "ai_gen_1",
    prompt: "Tech tutorial about React hooks",
    preview: "🔥 REACT HOOKS MASTERY",
    style: "Modern tech with blue gradients",
    category: "Technology"
  },
  {
    id: "ai_gen_2", 
    prompt: "Cooking: Homemade pizza recipe",
    preview: "🍕 PERFECT PIZZA AT HOME",
    style: "Warm orange tones with food imagery",
    category: "Cooking"
  },
  {
    id: "ai_gen_3",
    prompt: "Gaming: Minecraft building tips",
    preview: "⚡ EPIC MINECRAFT BUILDS",
    style: "Blocky style with green accents",
    category: "Gaming"
  }
];

export function AIGenerationSection() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState(generatedExamples);
  const [selectedExample, setSelectedExample] = useState("");

  const generateAIThumbnail = (userPrompt: string) => {
    // Smart AI generation based on prompt analysis
    const promptLower = userPrompt.toLowerCase();
    
    // Detect category from prompt
    let category = "General";
    let backgroundColor = "#1e293b";
    let titleColor = "#ffffff";
    let accentColor = "#3b82f6";
    
    if (promptLower.includes("tech") || promptLower.includes("coding") || promptLower.includes("programming")) {
      category = "Technology";
      backgroundColor = "#0f172a";
      titleColor = "#ffffff";
      accentColor = "#3b82f6";
    } else if (promptLower.includes("gaming") || promptLower.includes("game")) {
      category = "Gaming";
      backgroundColor = "#1a0b2e";
      titleColor = "#ffffff";
      accentColor = "#a855f7";
    } else if (promptLower.includes("cooking") || promptLower.includes("recipe") || promptLower.includes("food")) {
      category = "Cooking";
      backgroundColor = "#7c2d12";
      titleColor = "#ffffff";
      accentColor = "#f97316";
    } else if (promptLower.includes("travel") || promptLower.includes("vlog")) {
      category = "Travel";
      backgroundColor = "#0ea5e9";
      titleColor = "#ffffff";
      accentColor = "#06b6d4";
    }
    
    // Extract main title from prompt
    const words = userPrompt.split(' ');
    const mainTitle = words.slice(0, 4).join(' ').toUpperCase();
    const subtitle = words.length > 4 ? words.slice(4, 8).join(' ') : "Amazing Content";
    
    return {
      id: `ai_gen_${Date.now()}`,
      name: `AI: ${mainTitle}`,
      category: category as TemplateCategory,
      preview: `/templates/ai_generated.jpg`,
      description: `AI-generated thumbnail for: ${userPrompt}`,
      canvas: {
        width: 1280,
        height: 720,
        backgroundColor: backgroundColor
      },
      layers: [
        {
          id: "ai_bg_overlay",
          type: "rect" as const,
          x: 0,
          y: 400,
          width: 1280,
          height: 320,
          fill: "rgba(0,0,0,0.7)"
        },
        {
          id: "ai_main_title",
          type: "text" as const,
          text: mainTitle,
          x: 80,
          y: 450,
          fontFamily: "Inter",
          fontSize: 84,
          fontStyle: "bold" as const,
          fill: titleColor,
          stroke: "#000000",
          strokeWidth: 4,
          textAlign: "left" as const,
          lineHeight: 1.1
        },
        {
          id: "ai_subtitle",
          type: "text" as const,
          text: subtitle,
          x: 80,
          y: 580,
          fontFamily: "Inter",
          fontSize: 36,
          fill: accentColor,
          textAlign: "left" as const
        },
        {
          id: "ai_accent_shape",
          type: "rect" as const,
          x: 900,
          y: 100,
          width: 300,
          height: 200,
          fill: accentColor,
          cornerRadius: 20,
          opacity: 0.8
        }
      ],
      meta: {
        tags: ["ai-generated", category.toLowerCase(), "optimized"],
        recommended: true,
        difficulty: "easy" as const,
        createdAt: new Date().toISOString()
      }
    };
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate AI thumbnail
    const aiThumbnail = generateAIThumbnail(prompt);
    
    // Store in localStorage so it can be accessed in editor
    const aiThumbnails = JSON.parse(localStorage.getItem('ai_thumbnails') || '[]');
    aiThumbnails.unshift(aiThumbnail);
    localStorage.setItem('ai_thumbnails', JSON.stringify(aiThumbnails.slice(0, 10))); // Keep last 10
    
    const newThumbnail = {
      id: aiThumbnail.id,
      prompt: prompt,
      preview: `🎯 ${aiThumbnail.layers.find(l => l.type === 'text')?.text || 'AI GENERATED'}`,
      style: `${aiThumbnail.category} style with optimized colors and layout`,
      category: aiThumbnail.category
    };
    
    setGeneratedThumbnails(prev => [newThumbnail, ...prev.slice(0, 2)]);
    setIsGenerating(false);
    setPrompt("");
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setSelectedExample(example);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Generation
            <Sparkles className="w-4 h-4" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Generate Thumbnails with
            <span className="royal-gradient-text">
              {" "}Just Your Idea
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Simply describe your video content and our AI will create multiple 
            professional thumbnail designs optimized for maximum click-through rates.
          </p>

          {/* AI Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-primary" />
                  Describe Your Video Content
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Main Input */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="e.g., 'Tech tutorial about React hooks and best practices'"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="text-lg py-4 px-6 border-border focus:border-primary focus:ring-primary"
                      onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    size="lg"
                    className="royal-gradient hover:opacity-90 text-white px-8 py-4"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>

                {/* Example Prompts */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((example) => (
                      <motion.button
                        key={example}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleExampleClick(example)}
                        className={`px-3 py-1 text-sm rounded-full border transition-all ${
                          selectedExample === example
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-secondary border-border text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {example}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Generated Results */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
            Recently Generated Thumbnails
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {generatedThumbnails.map((thumbnail, index) => (
              <motion.div
                key={thumbnail.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.5 + index * 0.1, 
                  duration: 0.6,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card">
                  <div className="relative">
                    {/* AI Generated Preview */}
                    <div className="aspect-video bg-gradient-to-br from-primary via-primary/80 to-primary/60 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-xl md:text-2xl font-bold mb-2">
                            {thumbnail.preview}
                          </div>
                          <div className="text-sm opacity-80">
                            AI Generated • 1280×720
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover Overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center"
                      >
                        <Button
                          size="sm"
                          className="bg-background text-foreground hover:bg-accent"
                          asChild
                        >
                          <Link href={`/editor/${thumbnail.id}`}>
                            Customize
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                    
                    {/* AI Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-white border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-3">
                      <h4 className="font-semibold text-foreground mb-1">
                        {thumbnail.prompt}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {thumbnail.style}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {thumbnail.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ImageIcon className="w-3 h-3" />
                        <span>Ready to export</span>
                      </div>
                    </div>

                    <Button 
                      asChild
                      className="w-full mt-4 royal-gradient hover:opacity-90 text-white"
                    >
                      <Link href={`/editor/${thumbnail.id}`}>
                        Edit & Download
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="royal-gradient rounded-3xl p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              🚀 Generate Your First AI Thumbnail
            </h3>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-8">
              Join thousands of creators using AI to boost their click-through rates by up to 300%
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-300">10K+</div>
                <div className="text-emerald-200">Thumbnails Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-300">300%</div>
                <div className="text-emerald-200">Average CTR Increase</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-300">30s</div>
                <div className="text-emerald-200">Generation Time</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
