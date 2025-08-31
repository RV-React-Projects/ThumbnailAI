import { NextRequest, NextResponse } from 'next/server';

export interface ThumbnailRequest {
  title: string;
  description: string;
  theme: string;
}

export interface ThumbnailResponse {
  success: boolean;
  image?: string; // base64 string
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, theme }: ThumbnailRequest = await request.json();

    // Validate required fields
    if (!title || !description || !theme) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, or theme' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'AI_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Create a detailed prompt for thumbnail generation
    const prompt = `Create a professional YouTube thumbnail for a video titled "${title}". 
    Description: ${description}. 
    Theme: ${theme}. 
    Style: High-quality, eye-catching, professional YouTube thumbnail with bold text, vibrant colors, and engaging visual elements. 
    Include the title text prominently in the image. 
    Make it click-worthy and attention-grabbing suitable for ${theme} content.
    Aspect ratio: 16:9 (1920x1080 or similar). 
    High contrast, readable text, professional lighting.`;

    // Call Hugging Face Flux API
    const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: 1024,
          height: 576, // 16:9 aspect ratio
          num_inference_steps: 4
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      return NextResponse.json(
        { success: false, error: `Hugging Face API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Check if the model is still loading
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const errorData = await response.json();
      if (errorData.error && errorData.error.includes('loading')) {
        return NextResponse.json({
          success: false,
          error: 'Model is loading, please try again in a few moments'
        });
      }
    }

    // Convert image to base64
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      image: `data:image/jpeg;base64,${base64Image}`
    });

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
