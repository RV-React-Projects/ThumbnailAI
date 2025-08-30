"use client";

import { motion } from "framer-motion";
import { Badge } from "@components/ui/badge";
import { TemplateCategory } from "@src/types/template";

const categories: (TemplateCategory | "All")[] = [
  "All",
  "Technology",
  "Gaming", 
  "Agriculture",
  "Cooking",
  "Travel",
  "Finance",
  "Education",
  "Vlogs",
  "Business",
  "Health"
];

const categoryIcons: Record<TemplateCategory | "All", string> = {
  All: "🎨",
  Technology: "💻",
  Gaming: "🎮",
  Agriculture: "🌾",
  Cooking: "👨‍🍳",
  Travel: "✈️",
  Finance: "💰",
  Education: "📚",
  Vlogs: "📹",
  Business: "💼",
  Health: "🏥"
};

interface CategoryFilterProps {
  selectedCategory: TemplateCategory | "All";
  onCategoryChange: (category: TemplateCategory | "All") => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div>
      <h4 className="font-medium text-foreground mb-4">Categories</h4>
      <div className="space-y-2">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(category)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-primary/10 border border-primary/30 text-primary"
                  : "hover:bg-accent text-muted-foreground border border-transparent"
              }`}
            >
              <span className="text-lg">{categoryIcons[category]}</span>
              <span className="font-medium text-sm flex-1 text-left">
                {category}
              </span>
              {selectedCategory === category && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Badge 
                    variant="secondary"
                    className="bg-primary/20 text-primary text-xs"
                  >
                    ✓
                  </Badge>
                </motion.div>
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
