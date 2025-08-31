import { NextRequest, NextResponse } from 'next/server';

export interface ThumbnailRequest {
  title: string;
  description: string;
  theme: string;
}

export interface ThumbnailResponse {
  success: boolean;
  image?: string; // base64 string
  enhancedTitle?: string; // The corrected/enhanced title used
  error?: string;
}

// Function to enhance and spell-check titles using AI
async function enhanceTitle(originalTitle: string): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return originalTitle;

  try {
    const enhancementPrompt = `Fix any spelling errors and slightly enhance this YouTube video title to make it more engaging while keeping the core meaning intact. Only return the enhanced title, nothing else:

Original title: "${originalTitle}"

Rules:
- Fix any spelling mistakes
- Keep it concise (under 60 characters if possible)
- Make it more engaging and click-worthy
- Preserve the main topic and intent
- Use proper capitalization
- Return ONLY the enhanced title, no quotes or extra text`;

    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: enhancementPrompt,
        parameters: {
          max_new_tokens: 20,
          temperature: 0.3,
          return_full_text: false
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result && result[0] && result[0].generated_text) {
        const enhancedTitle = result[0].generated_text.trim();
        // Basic validation - if response is reasonable, use it
        if (enhancedTitle.length > 5 && enhancedTitle.length < 100) {
          return enhancedTitle;
        }
      }
    }
  } catch (error) {
    console.log('Title enhancement failed, using original:', error);
  }

  // Fallback: Basic spell check and enhancement
  return basicTitleEnhancement(originalTitle);
}

// Fallback function for basic title enhancement
function basicTitleEnhancement(title: string): string {
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

    // Create enhanced and spell-corrected title
    const enhancedTitle = await enhanceTitle(title);
    
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
