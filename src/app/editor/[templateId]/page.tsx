"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import {
  Download,
  Layers,
  Type,
  Image as ImageIcon,
  Palette,
  Undo,
  Redo,
  Save,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Settings,
  Square,
  Circle as CircleIcon,
  Star
} from "lucide-react";
import { Template, TemplateLayer, TemplateCategory } from "@src/types/template";
import templatesData from "@data/templates.json";

// Dynamically import Konva components to avoid SSR issues
const Stage = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Stage })), { ssr: false });
const Layer = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Layer })), { ssr: false });
const Text = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Text })), { ssr: false });
const Rect = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Rect })), { ssr: false });
const KonvaCircle = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Circle })), { ssr: false });
const KonvaStar = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Star })), { ssr: false });

const templates: Template[] = templatesData as Template[];

// Predefined gradients
const gradients = [
  { name: "Royal Emerald", value: "linear-gradient(135deg, #047857, #f59e0b)" },
  { name: "Sunset", value: "linear-gradient(135deg, #f97316, #ec4899)" },
  { name: "Ocean", value: "linear-gradient(135deg, #0ea5e9, #8b5cf6)" },
  { name: "Forest", value: "linear-gradient(135deg, #16a34a, #059669)" },
  { name: "Fire", value: "linear-gradient(135deg, #dc2626, #f59e0b)" },
  { name: "Purple Dream", value: "linear-gradient(135deg, #7c3aed, #ec4899)" },
  { name: "Golden Hour", value: "linear-gradient(135deg, #fbbf24, #f59e0b)" },
  { name: "Midnight", value: "linear-gradient(135deg, #1e293b, #475569)" },
  { name: "Custom", value: "custom" }
];

// Font options
const fonts = [
  { name: "Inter", value: "Inter" },
  { name: "Roboto", value: "Roboto" },
  { name: "Open Sans", value: "Open Sans" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Poppins", value: "Poppins" },
  { name: "Playfair Display", value: "Playfair Display" },
  { name: "Merriweather", value: "Merriweather" },
  { name: "Source Sans Pro", value: "Source Sans Pro" }
];

interface EditorPageProps {
  params: {
    templateId: string;
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stageRef = useRef<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [layers, setLayers] = useState<TemplateLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg'>('png');
  const [canvasBackground, setCanvasBackground] = useState('#1e293b');
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);
  const [customGradient, setCustomGradient] = useState('linear-gradient(135deg, #047857, #f59e0b)');

  const [history, setHistory] = useState<TemplateLayer[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Client-side check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load template data
  useEffect(() => {
    try {
      let template = templates.find(t => t.id === params.templateId);
      
      // Check if it's an AI-generated template
      if (!template && params.templateId.startsWith('ai_gen_')) {
        const aiThumbnails = JSON.parse(localStorage.getItem('ai_thumbnails') || '[]');
        template = aiThumbnails.find((t: Template) => t.id === params.templateId);
      }
      
      // Fallback to first template if nothing found
      if (!template) {
        template = templates[0];
        console.log('Template not found, using fallback:', template?.name);
      }
      
      if (template) {
        setSelectedTemplate(template);
        // Ensure all layers have required properties
        const processedLayers = template.layers.map(layer => ({
          ...layer,
          visible: layer.visible !== false, // Default to true if not specified
          opacity: layer.opacity ?? 1,
          rotation: layer.rotation ?? 0
        }));
        setLayers(processedLayers);
        setCanvasBackground(template.canvas.backgroundColor || '#1e293b');
        console.log('Template loaded:', template.name, 'Layers:', processedLayers.length);
        
        // Add a default text layer if no layers exist
        if (processedLayers.length === 0) {
          const defaultLayer: TemplateLayer = {
            id: `text_${Date.now()}`,
            type: 'text',
            text: 'Click to edit',
            x: 200,
            y: 200,
            fontSize: 64,
            fontFamily: 'Inter',
            fill: '#ffffff',
            visible: true,
            opacity: 1,
            rotation: 0
          };
          setLayers([defaultLayer]);
          setSelectedLayerId(defaultLayer.id);
        }
      }
    } catch (error) {
      console.error('Error loading template:', error);
      // Create a basic template if loading fails
      const fallbackTemplate = {
        id: 'fallback',
        name: 'Basic Template',
        category: 'Technology' as TemplateCategory,
        preview: '/templates/fallback.jpg',
        canvas: { width: 1280, height: 720, backgroundColor: '#1e293b' },
        layers: [],
        meta: { tags: ['fallback'], createdAt: new Date().toISOString() }
      };
      setSelectedTemplate(fallbackTemplate);
      setLayers([]);
      setCanvasBackground('#1e293b');
    }
  }, [params.templateId]);

  // Save to history
  const saveToHistory = (newLayers: TemplateLayer[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newLayers]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLayers([...history[historyIndex - 1]]);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLayers([...history[historyIndex + 1]]);
    }
  };

  // Handle layer updates
  const updateLayer = (layerId: string, updates: Partial<TemplateLayer>) => {
    const newLayers = layers.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    );
    setLayers(newLayers);
    saveToHistory(newLayers);
  };

  // Add new text layer
  const addTextLayer = () => {
    const newLayer: TemplateLayer = {
      id: `text_${Date.now()}`,
      type: 'text',
      text: 'New Text',
      x: 100,
      y: 100,
      fontSize: 48,
      fontFamily: 'Inter',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      fontStyle: 'bold',
      opacity: 1,
      rotation: 0,
      visible: true
    };
    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    setSelectedLayerId(newLayer.id);
    saveToHistory(newLayers);
  };

  // Add new shape layer
  const addShapeLayer = (shapeType: 'rect' | 'circle' | 'star') => {
    const newLayer: TemplateLayer = {
      id: `${shapeType}_${Date.now()}`,
      type: shapeType,
      x: 200,
      y: 200,
      width: shapeType === 'rect' ? 100 : 50,
      height: shapeType === 'rect' ? 100 : 50,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
      opacity: 1,
      rotation: 0,
      visible: true,
      cornerRadius: shapeType === 'rect' ? 8 : 0,
      points: shapeType === 'star' ? 5 : undefined
    };
    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    setSelectedLayerId(newLayer.id);
    saveToHistory(newLayers);
  };

  // Duplicate layer
  const duplicateLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      const newLayer = {
        ...layer,
        id: `${layer.type}_${Date.now()}`,
        x: layer.x + 20,
        y: layer.y + 20
      };
      const newLayers = [...layers, newLayer];
      setLayers(newLayers);
      setSelectedLayerId(newLayer.id);
      saveToHistory(newLayers);
    }
  };

  // Delete layer
  const deleteLayer = (layerId: string) => {
    const newLayers = layers.filter(l => l.id !== layerId);
    setLayers(newLayers);
    setSelectedLayerId(null);
    saveToHistory(newLayers);
  };

  // Toggle layer visibility
  const toggleLayerVisibility = (layerId: string) => {
    updateLayer(layerId, { visible: !layers.find(l => l.id === layerId)?.visible });
  };

  // Apply gradient to selected layer
  const applyGradient = (layerId: string) => {
    const gradient = selectedGradient.value === 'custom' ? customGradient : selectedGradient.value;
    updateLayer(layerId, { fill: gradient });
  };

  // Export functionality
  const handleExport = async () => {
    if (!stageRef.current) {
      alert('❌ Canvas not ready. Please wait a moment and try again.');
      return;
    }

    setIsExporting(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stage = stageRef.current as any;

      if (!stage.toDataURL) {
        throw new Error('Canvas export method not available');
      }

      const mimeType = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
      const quality = exportFormat === 'png' ? 1 : 0.9;

      console.log('Exporting with settings:', { mimeType, quality, pixelRatio: 2 });

      const dataURL = stage.toDataURL({
        mimeType: mimeType,
        quality: quality,
        pixelRatio: 2,
        width: 1280,
        height: 720
      });

      console.log('Data URL generated:', dataURL.substring(0, 100) + '...');

      const link = document.createElement('a');
      const fileName = `thumbnail-${selectedTemplate?.name?.replace(/[^a-z0-9]/gi, '_') || 'custom'}.${exportFormat}`;
      link.download = fileName;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Export completed successfully');
      alert(`✅ Thumbnail exported successfully as ${fileName}!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert(`❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setIsExporting(false);
  };

  // Generate variants
  const generateVariants = () => {
    const variants = [];
    const baseLayers = [...layers];
    
    // Variant 1: Different color scheme
    const variant1 = baseLayers.map(layer => ({
      ...layer,
      fill: layer.fill === '#ffffff' ? '#000000' : 
            layer.fill === '#000000' ? '#ffffff' : 
            (layer.fill?.includes('gradient') ? 'linear-gradient(135deg, #f59e0b, #047857)' : '#3b82f6')
    }));
    variants.push(variant1);
    
    // Variant 2: Different layout
    const variant2 = baseLayers.map(layer => ({
      ...layer,
      x: layer.x + 50,
      y: layer.y + 30,
      rotation: (layer.rotation || 0) + 5
    }));
    variants.push(variant2);
    
    // Variant 3: Different fonts
    const variant3 = baseLayers.map(layer => ({
      ...layer,
      fontFamily: layer.fontFamily === 'Inter' ? 'Poppins' : 'Inter',
      fontSize: layer.fontSize ? layer.fontSize + 10 : 48
    }));
    variants.push(variant3);
    
    // Save variants to localStorage
    const savedVariants = JSON.parse(localStorage.getItem('thumbnail_variants') || '[]');
    const newVariants = [...savedVariants, ...variants.map((variant, index) => ({
      id: `variant_${Date.now()}_${index}`,
      name: `${selectedTemplate?.name} Variant ${index + 1}`,
      layers: variant,
      createdAt: new Date().toISOString()
    }))];
    localStorage.setItem('thumbnail_variants', JSON.stringify(newVariants));
    
    alert(`✅ Generated ${variants.length} variants! Check the variants panel.`);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">
              Editing: {selectedTemplate?.name}
            </h1>
            <Badge variant="outline">
              {selectedTemplate?.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button 
              onClick={generateVariants}
              className="royal-gradient hover:opacity-90 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Variants
            </Button>
            <div className="flex items-center gap-2">
              <Select value={exportFormat} onValueChange={(value: string) => setExportFormat(value as 'png' | 'jpg')}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleExport}
                disabled={isExporting}
                className="royal-gradient hover:opacity-90 text-white"
              >
                {isExporting ? (
                  <>Exporting...</>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </>
                )}
              </Button>
              <Button 
                onClick={() => {
                  console.log('Stage ref:', stageRef.current);
                  console.log('Layers:', layers);
                  console.log('Selected template:', selectedTemplate);
                }}
                variant="outline"
                size="sm"
              >
                Debug
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Tools */}
        <div className="w-80 bg-card border-r border-border p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Add Elements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Add Elements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={addTextLayer}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Type className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    onClick={() => addShapeLayer('rect')}
                    variant="outline" 
                    size="sm"
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <Square className="w-4 h-4 mb-1" />
                    <span className="text-xs">Rectangle</span>
                  </Button>
                  <Button 
                    onClick={() => addShapeLayer('circle')}
                    variant="outline" 
                    size="sm"
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <CircleIcon className="w-4 h-4 mb-1" />
                    <span className="text-xs">Circle</span>
                  </Button>
                  <Button 
                    onClick={() => addShapeLayer('star')}
                    variant="outline" 
                    size="sm"
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <Star className="w-4 h-4 mb-1" />
                    <span className="text-xs">Star</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Canvas Background */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Canvas Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Background Color
                  </label>
                  <Input
                    type="color"
                    value={canvasBackground}
                    onChange={(e) => setCanvasBackground(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Gradient Background
                  </label>
                  <Select value={selectedGradient.name} onValueChange={(value) => {
                    const gradient = gradients.find(g => g.name === value);
                    if (gradient) setSelectedGradient(gradient);
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradients.map((gradient) => (
                        <SelectItem key={gradient.name} value={gradient.name}>
                          {gradient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedGradient.value === 'custom' && (
                    <Input
                      type="text"
                      value={customGradient}
                      onChange={(e) => setCustomGradient(e.target.value)}
                      placeholder="linear-gradient(135deg, #color1, #color2)"
                      className="mt-2"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Layer Properties */}
            {selectedLayer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Layer Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedLayer.type === 'text' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Text Content
                        </label>
                        <Input
                          value={selectedLayer.text || ''}
                          onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                          placeholder="Enter text..."
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Font Family
                        </label>
                        <Select 
                          value={selectedLayer.fontFamily || 'Inter'} 
                          onValueChange={(value) => updateLayer(selectedLayer.id, { fontFamily: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fonts.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Font Size
                        </label>
                        <Input
                          type="number"
                          value={selectedLayer.fontSize || 48}
                          onChange={(e) => updateLayer(selectedLayer.id, { fontSize: parseInt(e.target.value) })}
                          min="12"
                          max="200"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Text Color
                        </label>
                        <Input
                          type="color"
                          value={selectedLayer.fill || '#ffffff'}
                          onChange={(e) => updateLayer(selectedLayer.id, { fill: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Text Gradient
                        </label>
                        <Select value={selectedGradient.name} onValueChange={(value) => {
                          const gradient = gradients.find(g => g.name === value);
                          if (gradient) {
                            setSelectedGradient(gradient);
                            applyGradient(selectedLayer.id);
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {gradients.map((gradient) => (
                              <SelectItem key={gradient.name} value={gradient.name}>
                                {gradient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={selectedLayer.fontStyle?.includes('bold') ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateLayer(selectedLayer.id, { 
                            fontStyle: selectedLayer.fontStyle?.includes('bold') 
                              ? selectedLayer.fontStyle.replace('bold', '').trim()
                              : `${selectedLayer.fontStyle || ''} bold`.trim()
                          })}
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={selectedLayer.fontStyle?.includes('italic') ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateLayer(selectedLayer.id, { 
                            fontStyle: selectedLayer.fontStyle?.includes('italic') 
                              ? selectedLayer.fontStyle.replace('italic', '').trim()
                              : `${selectedLayer.fontStyle || ''} italic`.trim()
                          })}
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={selectedLayer.fontStyle?.includes('underline') ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateLayer(selectedLayer.id, { 
                            fontStyle: selectedLayer.fontStyle?.includes('underline') 
                              ? selectedLayer.fontStyle.replace('underline', '').trim()
                              : `${selectedLayer.fontStyle || ''} underline`.trim()
                          })}
                        >
                          <Underline className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">X</label>
                      <Input
                        type="number"
                        value={selectedLayer.x}
                        onChange={(e) => updateLayer(selectedLayer.id, { x: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Y</label>
                      <Input
                        type="number"
                        value={selectedLayer.y}
                        onChange={(e) => updateLayer(selectedLayer.id, { y: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Width</label>
                      <Input
                        type="number"
                        value={selectedLayer.width || 100}
                        onChange={(e) => updateLayer(selectedLayer.id, { width: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Height</label>
                      <Input
                        type="number"
                        value={selectedLayer.height || 100}
                        onChange={(e) => updateLayer(selectedLayer.id, { height: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Rotation</label>
                    <Input
                      type="number"
                      value={selectedLayer.rotation || 0}
                      onChange={(e) => updateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) })}
                      min="0"
                      max="360"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Opacity</label>
                    <Input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedLayer.opacity || 1}
                      onChange={(e) => updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">{Math.round((selectedLayer.opacity || 1) * 100)}%</span>
                  </div>

                  {selectedLayer.type === 'rect' && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Corner Radius</label>
                      <Input
                        type="number"
                        value={selectedLayer.cornerRadius || 0}
                        onChange={(e) => updateLayer(selectedLayer.id, { cornerRadius: parseInt(e.target.value) })}
                        min="0"
                        max="50"
                      />
                    </div>
                  )}

                  {selectedLayer.type === 'star' && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Points</label>
                      <Input
                        type="number"
                        value={selectedLayer.points || 5}
                        onChange={(e) => updateLayer(selectedLayer.id, { points: parseInt(e.target.value) })}
                        min="3"
                        max="20"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Sidebar - Layers */}
        <div className="w-80 bg-card border-l border-border p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Layers ({layers.length})
              </h3>
            </div>
            
            <div className="space-y-2">
              {layers.map((layer, index) => (
                <motion.div
                  key={layer.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedLayerId === layer.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {layer.type === 'text' ? (
                        <Type className="w-4 h-4 text-muted-foreground" />
                      ) : layer.type === 'rect' ? (
                        <Square className="w-4 h-4 text-muted-foreground" />
                      ) : layer.type === 'circle' ? (
                        <CircleIcon className="w-4 h-4 text-muted-foreground" />
                      ) : layer.type === 'star' ? (
                        <Star className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {layer.type === 'text' ? (layer.text || 'Text') : `${layer.type} Layer`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(layer.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {layer.visible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateLayer(layer.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLayer(layer.id);
                        }}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">#{layers.length - index}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl shadow-lg p-6 h-full flex items-center justify-center"
          >
            <div className="relative">
              {/* Canvas Size Indicator */}
              <div className="text-center mb-4">
                <Badge variant="outline">
                  1280 × 720 • YouTube Optimized
                </Badge>
              </div>
              
              {/* Konva Stage */}
              <div className="border-2 border-border rounded-lg overflow-hidden shadow-xl">
                {isClient ? (
                  <div className="transform scale-50 origin-top-left">
                    <Stage
                      ref={stageRef}
                      width={1280} // Full size for proper export
                      height={720}
                      style={{
                        background: selectedGradient.value === 'custom' ? customGradient : 
                                   selectedGradient.value !== 'custom' ? selectedGradient.value : 
                                   canvasBackground
                      }}
                      onMouseDown={() => console.log('Stage clicked')}
                    >
                      <Layer>
                        {layers.map((layer) => {
                          if (!layer.visible) return null;
                          
                          if (layer.type === 'text') {
                            return (
                              <Text
                                key={layer.id}
                                x={layer.x}
                                y={layer.y}
                                text={layer.text || ''}
                                fontSize={layer.fontSize || 48}
                                fontFamily={layer.fontFamily || 'Inter'}
                                fill={layer.fill || '#ffffff'}
                                stroke={layer.stroke}
                                strokeWidth={layer.strokeWidth}
                                fontStyle={layer.fontStyle}
                                opacity={layer.opacity || 1}
                                rotation={layer.rotation || 0}
                                draggable
                                onDragEnd={(e) => {
                                  updateLayer(layer.id, {
                                    x: e.target.x(),
                                    y: e.target.y()
                                  });
                                }}
                                onClick={() => setSelectedLayerId(layer.id)}
                              />
                            );
                          }
                          
                          if (layer.type === 'rect') {
                            return (
                              <Rect
                                key={layer.id}
                                x={layer.x}
                                y={layer.y}
                                width={layer.width || 100}
                                height={layer.height || 100}
                                fill={layer.fill || '#3b82f6'}
                                stroke={layer.stroke}
                                strokeWidth={layer.strokeWidth}
                                cornerRadius={layer.cornerRadius || 0}
                                opacity={layer.opacity || 1}
                                rotation={layer.rotation || 0}
                                draggable
                                onDragEnd={(e) => {
                                  updateLayer(layer.id, {
                                    x: e.target.x(),
                                    y: e.target.y()
                                  });
                                }}
                                onClick={() => setSelectedLayerId(layer.id)}
                              />
                            );
                          }
                          
                          if (layer.type === 'circle') {
                            return (
                              <KonvaCircle
                                key={layer.id}
                                x={layer.x}
                                y={layer.y}
                                radius={(layer.width || 50) / 2}
                                fill={layer.fill || '#3b82f6'}
                                stroke={layer.stroke}
                                strokeWidth={layer.strokeWidth}
                                opacity={layer.opacity || 1}
                                rotation={layer.rotation || 0}
                                draggable
                                onDragEnd={(e) => {
                                  updateLayer(layer.id, {
                                    x: e.target.x(),
                                    y: e.target.y()
                                  });
                                }}
                                onClick={() => setSelectedLayerId(layer.id)}
                              />
                            );
                          }
                          
                          if (layer.type === 'star') {
                            return (
                              <KonvaStar
                                key={layer.id}
                                x={layer.x}
                                y={layer.y}
                                numPoints={layer.points || 5}
                                innerRadius={(layer.width || 50) / 4}
                                outerRadius={(layer.width || 50) / 2}
                                fill={layer.fill || '#3b82f6'}
                                stroke={layer.stroke}
                                strokeWidth={layer.strokeWidth}
                                opacity={layer.opacity || 1}
                                rotation={layer.rotation || 0}
                                draggable
                                onDragEnd={(e) => {
                                  updateLayer(layer.id, {
                                    x: e.target.x(),
                                    y: e.target.y()
                                  });
                                }}
                                onClick={() => setSelectedLayerId(layer.id)}
                              />
                            );
                          }
                          
                          return null;
                        })}
                      </Layer>
                    </Stage>
                  </div>
                ) : (
                  <div className="w-[640px] h-[360px] bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading canvas...</p>
                      <p className="text-xs text-muted-foreground mt-2">Please wait while the editor initializes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

