import { NextRequest, NextResponse } from 'next/server';
import { ThumbnailGenerationRequest } from '@/types/template';

// Function to enhance and spell-check titles
function enhanceTitle(title: string): string {
  // Basic spell corrections for common YouTube words
  const corrections: Record<string, string> = {
    'tecnology': 'Technology',
    'techonology': 'Technology', 
    'teh': 'The',
    'adn': 'And',
    'vs': 'VS',
    'ai': 'AI',
    'youtube': 'YouTube',
    'youtuber': 'YouTuber',
    'reciew': 'Review',
    'reveiw': 'Review',
    'beginer': 'Beginner',
    'beginner': 'Beginner',
    'ultimat': 'Ultimate',
    'amzing': 'Amazing',
    'incredibl': 'Incredible'
  };

  let enhanced = title;
  
  // Apply corrections
  Object.entries(corrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    enhanced = enhanced.replace(regex, correct);
  });

  // Capitalize first letter of each major word
  enhanced = enhanced.replace(/\b\w+/g, (word) => {
    const lowerWord = word.toLowerCase();
    // Don't capitalize small connecting words unless they're first
    if (['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(lowerWord)) {
      return lowerWord;
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Ensure first word is always capitalized
  enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);

  return enhanced;
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, theme }: ThumbnailGenerationRequest = await request.json();

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

    // Create enhanced and spell-corrected title
    const enhancedTitle = enhanceTitle(title);
    
    // Create a detailed prompt for thumbnail generation
    const prompt = `Create a professional YouTube thumbnail with these EXACT REQUIREMENTS:

TITLE TEXT (MOST IMPORTANT): 
- Display this EXACT title prominently: "${enhancedTitle}"
- Make the title text LARGE, BOLD, and HIGHLY READABLE
- Use contrasting colors for maximum readability (white text with dark outline, or dark text with bright background)
- Position title in upper 60% of the image for maximum visibility
- NO spelling errors - use the title exactly as provided above

VISUAL STYLE:
- Theme: ${theme}
- Description: ${description}
- Professional thumbnail design for video content
- Eye-catching, click-worthy design
- High contrast colors and professional lighting
- 16:9 aspect ratio (1920x1080 recommended)
- Include relevant visual elements that match the ${theme} theme

STRICT EXCLUSIONS - DO NOT INCLUDE:
- NO play button icons or triangular play symbols
- NO YouTube logo or branding
- NO UI elements (pause, stop, forward buttons)
- NO video player controls or interfaces
- NO overlay icons of any kind
- NO circular play buttons
- NO media player symbols

DESIGN PRIORITIES (in order):
1. Title text visibility and readability (HIGHEST PRIORITY)
2. Eye-catching visual design without any buttons or icons
3. Theme-appropriate graphics and colors
4. Clean, professional thumbnail aesthetics

Focus on creating a clean thumbnail image with prominent title text and thematic visuals, but absolutely NO play buttons or media control icons.`;

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
      image: `data:image/jpeg;base64,${base64Image}`,
      enhancedTitle: enhancedTitle
    });

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
