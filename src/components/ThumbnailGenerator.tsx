'use client';

import { useState } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Card } from '@components/ui/card';
import { ThumbnailGenerationRequest, ThumbnailGenerationResponse, ThumbnailTheme } from '@src/types/template';
import { Loader2, Download, ImageIcon } from 'lucide-react';

const themes: { value: ThumbnailTheme; label: string }[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'travel', label: 'Travel' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'vlogs', label: 'Vlogs' },
  { value: 'business', label: 'Business' },
  { value: 'health', label: 'Health' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'science', label: 'Science' },
];

export default function ThumbnailGenerator() {
  const [formData, setFormData] = useState<ThumbnailGenerationRequest>({
    title: '',
    description: '',
    theme: 'technology',
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ThumbnailGenerationRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

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
        setGeneratedImage(data.image);
      } else {
        setError(data.error || 'Failed to generate thumbnail');
      }
    } catch (err) {
      setError('Network error occurred while generating thumbnail');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${formData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_thumbnail.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">AI Thumbnail Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate eye-catching YouTube thumbnails using AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Thumbnail Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Video Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., AI vs Humans: The Ultimate Showdown"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                rows={3}
                placeholder="Brief description of your video content..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium mb-2">
                Theme
              </label>
              <select
                id="theme"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value as ThumbnailTheme)}
                required
              >
                {themes.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || !formData.title || !formData.description}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Generate Thumbnail
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Preview Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
            {isLoading ? (
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generating your thumbnail...
                </p>
              </div>
            ) : generatedImage ? (
              <>
                <img
                  src={generatedImage}
                  alt="Generated thumbnail"
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  onClick={handleDownload}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </>
            ) : error ? (
              <div className="text-center text-red-500">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Your generated thumbnail will appear here</p>
              </div>
            )}
          </div>

          {generatedImage && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Thumbnail generated successfully!
              </p>
              <Button onClick={handleDownload} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download High Quality Image
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
