"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@components/landing/navbar";
import { TemplateCard } from "@components/templates/template-card";
import { CategoryFilter } from "@components/templates/category-filter";
import { Button } from "@components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@components/ui/input";
import type { Template, TemplateCategory } from "@/types/template";
import templatesData from "@/data/templates.json";

const templates: Template[] = templatesData as Template[];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.meta.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Professional YouTube
              <span className="royal-gradient-text">
                {" "}Thumbnail Templates
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose from our collection of high-converting thumbnail templates 
              designed by professionals for maximum engagement.
            </p>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-md mx-auto relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-border focus:border-primary focus:ring-primary"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Filters</h3>
              </div>
              
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-medium text-foreground mb-3">Quick Stats</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Total Templates</span>
                    <span className="font-medium">{templates.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Filtered Results</span>
                    <span className="font-medium">{filteredTemplates.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories</span>
                    <span className="font-medium">10</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {selectedCategory === "All" ? "All Templates" : `${selectedCategory} Templates`}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
              
              <Button variant="outline" className="hidden sm:flex">
                Sort by Popular
              </Button>
            </motion.div>

            {/* Templates Grid */}
            {filteredTemplates.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.6 + index * 0.1, 
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                  >
                    <TemplateCard template={template} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center py-16"
              >
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No templates found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query to find more templates.
                </p>
                <Button 
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
