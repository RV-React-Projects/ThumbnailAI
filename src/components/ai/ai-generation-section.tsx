"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Sparkles, Wand2, Loader2, Image as ImageIcon, Download } from "lucide-react";
import Image from "next/image";
import { ThumbnailGenerationRequest, ThumbnailGenerationResponse, ThumbnailTheme } from "@/types/template";

const examplePrompts = [
  "Tech tutorial about JavaScript arrays",
  "Cooking video: Easy pasta recipes", 
  "Gaming: Epic boss battle highlights",
  "Travel vlog: Tokyo street food tour",
  "Fitness: 10-minute morning workout",
  "Business: How to start a startup"
];

const themes: { value: ThumbnailTheme; label: string }[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'travel', label: 'Travel' },
  { value: 'business', label: 'Business' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'science', label: 'Science' },
];

export function AIGenerationSection() {
  const [formData, setFormData] = useState<ThumbnailGenerationRequest>({
    title: "",
    description: "",
    theme: 'technology',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<Array<{
    id: string;
    image: string;
    enhancedTitle: string;
    originalTitle: string;
    description: string;
    theme: string;
    timestamp: number;
  }>>([]);
  const [selectedExample, setSelectedExample] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ThumbnailGenerationRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownload = (image: string, title: string) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_thumbnail.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = async () => {
    if (!formData.title.trim() || !formData.description.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ThumbnailGenerationResponse = await response.json();

      if (data.success && data.image) {
        const newThumbnail = {
          id: `ai_gen_${Date.now()}`,
          image: data.image,
          enhancedTitle: data.enhancedTitle || formData.title,
          originalTitle: formData.title,
          description: formData.description,
          theme: formData.theme,
          timestamp: Date.now(),
        };
        
        setGeneratedThumbnails(prev => [newThumbnail, ...prev.slice(0, 4)]); // Keep last 5
        setFormData({ title: "", description: "", theme: 'technology' });
      } else {
        setError(data.error || 'Failed to generate thumbnail');
      }
    } catch (err) {
      setError('Network error occurred while generating thumbnail');
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    // Parse example prompt to extract title and description
    const words = example.split(': ');
    const theme = words[0].toLowerCase() as ThumbnailTheme;
    const content = words[1] || example;
    
    setFormData({
      title: content,
      description: `Learn about ${content.toLowerCase()} with this comprehensive guide`,
      theme: themes.find(t => t.value === theme)?.value || 'technology'
    });
    setSelectedExample(example);
  };

  return (
    <section id="ai-generation-section" className="py-24 bg-gradient-to-b from-secondary/30 to-background">
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
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Video Title</label>
                  <Input
                    type="text"
                    placeholder="e.g., 'AI vs Humans: The Ultimate Showdown'"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="text-lg py-3 px-4 border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                    rows={3}
                    placeholder="Brief description of your video content..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                    value={formData.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value as ThumbnailTheme)}
                  >
                    {themes.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!formData.title.trim() || !formData.description.trim() || isGenerating}
                  size="lg"
                  className="w-full royal-gradient hover:opacity-90 text-white py-4"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating AI Thumbnail...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate AI Thumbnail
                    </>
                  )}
                </Button>

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}

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
        {generatedThumbnails.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">
              Your AI Generated Thumbnails
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedThumbnails.map((thumbnail, index) => (
                <motion.div
                  key={thumbnail.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.1 + index * 0.1, 
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer"
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card">
                    <div className="relative">
                      {/* Real AI Generated Image */}
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={thumbnail.image}
                          alt={`Generated thumbnail: ${thumbnail.enhancedTitle}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        
                        {/* Hover Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
                        >
                          <Button
                            size="sm"
                            onClick={() => handleDownload(thumbnail.image, thumbnail.enhancedTitle)}
                            className="bg-background text-foreground hover:bg-accent"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
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
                          {thumbnail.enhancedTitle}
                        </h4>
                        {thumbnail.enhancedTitle !== thumbnail.originalTitle && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                            Enhanced from: &ldquo;{thumbnail.originalTitle}&rdquo;
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {thumbnail.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="text-xs capitalize">
                          {thumbnail.theme}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ImageIcon className="w-3 h-3" />
                          <span>1024×576</span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleDownload(thumbnail.image, thumbnail.enhancedTitle)}
                        className="w-full royal-gradient hover:opacity-90 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Image
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

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
