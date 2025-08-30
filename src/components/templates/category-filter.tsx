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
      <h4 className="font-medium text-gray-900 mb-4">Categories</h4>
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
                  ? "bg-blue-50 border border-blue-200 text-blue-700"
                  : "hover:bg-gray-50 text-gray-700 border border-transparent"
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
                    className="bg-blue-100 text-blue-700 text-xs"
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
