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
  Sparkles
} from "lucide-react";
import { Template, TemplateLayer } from "@src/types/template";
import templatesData from "@data/templates.json";

// Dynamically import Konva components to avoid SSR issues
const Stage = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Stage })), { ssr: false });
const Layer = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Layer })), { ssr: false });
const Text = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Text })), { ssr: false });
const Rect = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Rect })), { ssr: false });
const Circle = dynamic(() => import("react-konva").then((mod) => ({ default: mod.Circle })), { ssr: false });

const templates: Template[] = templatesData as Template[];

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

  // Client-side check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load template data
  useEffect(() => {
    let template = templates.find(t => t.id === params.templateId);
    
    // Check if it's an AI-generated template
    if (!template && params.templateId.startsWith('ai_gen_')) {
      const aiThumbnails = JSON.parse(localStorage.getItem('ai_thumbnails') || '[]');
      template = aiThumbnails.find((t: Template) => t.id === params.templateId);
    }
    
    // Fallback to first template if nothing found
    if (!template) {
      template = templates[0];
    }
    
    setSelectedTemplate(template);
    setLayers(template.layers);
  }, [params.templateId]);

  // Handle layer updates
  const updateLayer = (layerId: string, updates: Partial<TemplateLayer>) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    ));
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
      fontStyle: 'bold'
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  // Add new image placeholder
  const addImageLayer = () => {
    const newLayer: TemplateLayer = {
      id: `image_${Date.now()}`,
      type: 'rect', // Using rect as placeholder for now
      x: 200,
      y: 200,
      width: 300,
      height: 200,
      fill: '#e5e7eb',
      stroke: '#9ca3af',
      strokeWidth: 2,
      cornerRadius: 10
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  // Export canvas as image
  const handleExport = async () => {
    if (!stageRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Get the stage node and export to data URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stage = stageRef.current as any;
      
      const mimeType = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
      const quality = exportFormat === 'png' ? 1 : 0.9;
      
      const dataURL = stage.toDataURL({
        mimeType: mimeType,
        quality: quality,
        pixelRatio: 2,
        width: 1280,
        height: 720
      });
      
      // Create download link
      const link = document.createElement('a');
      const fileName = `thumbnail-${selectedTemplate?.name?.replace(/[^a-z0-9]/gi, '_') || 'custom'}.${exportFormat}`;
      link.download = fileName;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      alert(`✅ Thumbnail exported successfully as ${fileName}!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('❌ Export failed. Please try again.');
    }
    
    setIsExporting(false);
  };

  // Generate AI variants
  const generateVariants = () => {
    // Simulate AI variant generation
    alert('🚀 AI Variants feature coming soon! This will generate 3 optimized variations of your thumbnail.');
  };

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-semibold text-gray-900">Loading Editor...</h2>
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
              Editing: {selectedTemplate.name}
            </h1>
            <Badge variant="outline">
              {selectedTemplate.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="w-4 h-4" />
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
                <SelectTrigger className="w-24">
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
                    Export {exportFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Tools */}
        <div className="w-80 bg-card border-r border-border p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Add Elements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5" />
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
                <Button 
                  onClick={addImageLayer}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Add Shape
                </Button>
              </CardContent>
            </Card>

            {/* Layer Properties */}
            {selectedLayer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Edit {selectedLayer.type === 'text' ? 'Text' : 'Layer'}
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
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Stroke Color
                        </label>
                        <Input
                          type="color"
                          value={selectedLayer.stroke || '#000000'}
                          onChange={(e) => updateLayer(selectedLayer.id, { stroke: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Stroke Width
                        </label>
                        <Input
                          type="number"
                          value={selectedLayer.strokeWidth || 0}
                          onChange={(e) => updateLayer(selectedLayer.id, { strokeWidth: parseInt(e.target.value) })}
                          min="0"
                          max="20"
                        />
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
                </CardContent>
              </Card>
            )}

            {/* Layers List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Layers</CardTitle>
              </CardHeader>
              <CardContent>
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
                          ) : (
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium text-foreground">
                            {layer.type === 'text' ? (layer.text || 'Text') : `${layer.type} Layer`}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">#{layers.length - index}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                      height={720} // Full size for proper export
                      style={{ backgroundColor: selectedTemplate.canvas.backgroundColor || '#ffffff' }}
                    >
                  <Layer>
                    {layers.map((layer) => {
                      if (layer.type === 'text') {
                        return (
                          <Text
                            key={layer.id}
                            id={layer.id}
                            text={layer.text || ''}
                            x={layer.x}
                            y={layer.y}
                            fontSize={layer.fontSize || 48}
                            fontFamily={layer.fontFamily || 'Inter'}
                            fill={layer.fill || '#000000'}
                            stroke={layer.stroke}
                            strokeWidth={layer.strokeWidth || 0}
                            fontStyle={layer.fontStyle || 'normal'}
                            align={layer.textAlign || 'left'}
                            draggable
                            onClick={() => setSelectedLayerId(layer.id)}
                            onDragEnd={(e) => {
                              updateLayer(layer.id, {
                                x: e.target.x(),
                                y: e.target.y()
                              });
                            }}
                          />
                        );
                      } else if (layer.type === 'rect') {
                        return (
                          <Rect
                            key={layer.id}
                            id={layer.id}
                            x={layer.x}
                            y={layer.y}
                            width={layer.width || 100}
                            height={layer.height || 100}
                            fill={layer.fill || '#cccccc'}
                            stroke={layer.stroke}
                            strokeWidth={layer.strokeWidth || 0}
                            cornerRadius={layer.cornerRadius || 0}
                            opacity={layer.opacity || 1}
                            draggable
                            onClick={() => setSelectedLayerId(layer.id)}
                            onDragEnd={(e) => {
                              updateLayer(layer.id, {
                                x: e.target.x(),
                                y: e.target.y()
                              });
                            }}
                          />
                        );
                      } else if (layer.type === 'circle') {
                        return (
                          <Circle
                            key={layer.id}
                            id={layer.id}
                            x={layer.x + (layer.width || 100) / 2}
                            y={layer.y + (layer.height || 100) / 2}
                            radius={(layer.width || 100) / 2}
                            fill={layer.fill || '#cccccc'}
                            stroke={layer.stroke}
                            strokeWidth={layer.strokeWidth || 0}
                            opacity={layer.opacity || 1}
                            draggable
                            onClick={() => setSelectedLayerId(layer.id)}
                            onDragEnd={(e) => {
                              updateLayer(layer.id, {
                                x: e.target.x() - (layer.width || 100) / 2,
                                y: e.target.y() - (layer.height || 100) / 2
                              });
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                  </Layer>
                    </Stage>
                  </div>
                ) : (
                  <div className="w-[640px] h-[360px] bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎨</div>
                      <div className="text-gray-600">Loading Canvas...</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Canvas Info */}
              <div className="text-center mt-4 text-sm text-gray-500">
                Click and drag elements to reposition • Select layers to edit properties
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

