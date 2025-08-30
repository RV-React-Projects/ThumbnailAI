export interface TemplateLayer {
  id: string;
  type: 'text' | 'image' | 'rect' | 'circle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  
  // Text specific properties
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: 'normal' | 'bold' | 'italic';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  
  // Image specific properties
  src?: string;
  fit?: 'cover' | 'contain' | 'fill';
  
  // Shape specific properties (rect, circle)
  cornerRadius?: number;
  
  // Effects
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  effects?: {
    outline?: boolean;
    glow?: boolean;
  };
  filters?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  preview: string;
  description?: string;
  canvas: {
    width: number;
    height: number;
    backgroundColor?: string;
  };
  layers: TemplateLayer[];
  meta: {
    tags: string[];
    recommended?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard';
    createdAt: string;
  };
}

export type TemplateCategory = 
  | 'Technology'
  | 'Gaming'
  | 'Agriculture'
  | 'Cooking'
  | 'Travel'
  | 'Finance'
  | 'Education'
  | 'Vlogs'
  | 'Business'
  | 'Health';

export interface Project {
  id: string;
  name: string;
  templateId?: string;
  layers: TemplateLayer[];
  canvas: {
    width: number;
    height: number;
    backgroundColor?: string;
  };
  brand?: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    fontFamily: string;
  };
  createdAt: string;
  updatedAt: string;
}

