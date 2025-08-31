# 🎨 AI YouTube Thumbnail Generator

A powerful Next.js application that generates professional YouTube thumbnails using AI technology. Create eye-catching, click-worthy thumbnails in seconds with intelligent title enhancement, spell-checking, and theme-based design generation.

![AI Thumbnail Generator](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🤖 AI-Powered Generation
- **Real AI thumbnail creation** using Hugging Face's FLUX.1-schnell model
- **Intelligent title enhancement** with automatic spell-checking
- **Theme-based optimization** for different content categories
- **Professional 16:9 aspect ratio** (1024×576) perfect for YouTube

### 🎯 Smart Title Management
- **Automatic spell correction** for common YouTube-related words
- **Title enhancement** for better engagement and click-through rates
- **Proper capitalization** and formatting
- **Preview enhanced titles** before generation

### 🎨 Professional Design
- **High contrast text** for maximum readability
- **Theme-appropriate graphics** and color schemes
- **No UI elements** (play buttons, YouTube branding removed)
- **Clean, professional aesthetics**

### 🚀 User Experience
- **Real-time generation** with loading animations
- **Instant download** functionality
- **Gallery of generated thumbnails**
- **Mobile-responsive** design
- **Dark/Light mode** support
- **Beautiful animations** with Framer Motion

### 📱 Supported Themes
- Technology
- Gaming
- Cooking
- Travel
- Business
- Education
- Health
- Entertainment
- Sports
- Science
- And more...

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui with Radix UI
- **Animations**: Framer Motion
- **AI Integration**: Hugging Face API (FLUX.1-schnell)
- **Runtime**: Bun (recommended) or Node.js
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before installation, ensure you have:

- **Bun** (recommended) or **Node.js** 18+ installed
- **Hugging Face API key** (free account required)
- **Git** for cloning the repository

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/yt-thumbnail.git
cd yt-thumbnail
```

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Get your API key from https://huggingface.co/settings/tokens
AI_API_KEY=hf_your_hugging_face_api_key_here

# Optional: App URL for production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get Your Hugging Face API Key

1. Visit [Hugging Face](https://huggingface.co/)
2. Create a free account or sign in
3. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Click "New token"
5. Give it a name (e.g., "thumbnail-generator")
6. Select "Read" permissions
7. Copy the token and add it to your `.env.local` file

## 🏃‍♂️ Running the Application

### Development Mode

Using Bun:
```bash
bun run dev
```

Using npm:
```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Production Build

```bash
# Build the application
bun run build

# Start production server
bun run start
```

## 📖 How to Use

### 1. Access the Application
Open your browser and navigate to `http://localhost:3000`

### 2. Generate Your First Thumbnail

#### Step 1: Fill in the Details
- **Video Title**: Enter your video title (spelling mistakes will be auto-corrected)
  - Example: "teh ultimat ai vs humans battel"
  - Will become: "The Ultimate AI vs Humans Battle"
- **Description**: Brief description of your video content
  - Example: "Exploring AI capabilities vs human creativity"
- **Theme**: Select the most appropriate theme for your content

#### Step 2: Generate
- Click the "Generate AI Thumbnail" button
- Watch the loading animation (generation takes 2-10 seconds)
- See your professional thumbnail appear

#### Step 3: Download
- Click the "Download" button on the generated thumbnail
- The image will be saved as a PNG file with optimized naming

### 3. Quick Start Examples

Try these example inputs for immediate results:

**Technology Theme:**
- Title: "AI vs Humans: The Ultimate Showdown"
- Description: "Comparing artificial intelligence with human capabilities"
- Theme: Technology

**Gaming Theme:**
- Title: "Epic Boss Battle Highlights"
- Description: "Most intense boss fights compilation"
- Theme: Gaming

**Cooking Theme:**
- Title: "Perfect Pizza at Home"
- Description: "Easy homemade pizza recipe step by step"
- Theme: Cooking

### 4. Understanding Enhanced Titles

The AI automatically enhances your titles by:
- **Fixing spelling errors**: "tecnology" → "Technology"
- **Improving capitalization**: "ai vs humans" → "AI vs Humans"
- **Making it more engaging**: "basic tutorial" → "Ultimate Tutorial"
- **Keeping it concise**: Ensures titles are YouTube-friendly length

### 5. Gallery Management

- Generated thumbnails appear in the gallery below the form
- Each thumbnail shows:
  - The enhanced title used
  - Original title (if different)
  - Theme and description
  - Download button
- Gallery keeps your last 5 generations

## 🎯 Best Practices

### Title Tips
- **Be specific**: "React Hooks Tutorial" vs "Programming Video"
- **Use action words**: "Master", "Ultimate", "Complete"
- **Include keywords**: Your main topic should be clear
- **Keep it under 60 characters** for best results

### Description Tips
- **Be descriptive**: Help the AI understand your content
- **Mention key elements**: Important features to highlight
- **Keep it concise**: 1-2 sentences work best

### Theme Selection
- **Choose accurately**: Wrong theme affects visual style
- **Technology**: Blue gradients, modern design
- **Gaming**: Purple/dark themes, dynamic elements
- **Cooking**: Warm oranges, food-friendly design
- **Business**: Professional, clean aesthetics

## 🔧 Configuration

### Customizing Themes

You can modify themes in `src/types/template.ts`:

```typescript
export type ThumbnailTheme = 
  | 'technology'
  | 'gaming' 
  | 'your-custom-theme'
  // Add more themes here
```

### Adjusting AI Parameters

Modify AI generation settings in `src/app/api/generate-thumbnail/route.ts`:

```typescript
parameters: {
  width: 1024,           // Image width
  height: 576,           // Image height (16:9 ratio)
  num_inference_steps: 4 // Generation quality (1-10)
}
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `AI_API_KEY`: Your Hugging Face API key
4. Deploy automatically

### Deploy to Netlify

1. Build the application: `bun run build`
2. Upload the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

### Deploy to Railway

1. Connect your GitHub repository
2. Add environment variables
3. Deploy with one click

## 🐛 Troubleshooting

### Common Issues

**401 Error - Authentication Failed**
- Check your `.env.local` file exists
- Verify your Hugging Face API key is correct
- Ensure the key has proper permissions

**Image Not Displaying**
- Clear browser cache
- Check network connection
- Verify API key has sufficient quota

**Slow Generation**
- First generation may take longer (model loading)
- Subsequent generations are faster
- Check Hugging Face service status

**Build Errors**
- Run `bun install` or `npm install` again
- Clear `node_modules` and reinstall
- Check Node.js/Bun version compatibility

### Error Messages

| Error | Solution |
|-------|----------|
| "AI_API_KEY not configured" | Add your API key to `.env.local` |
| "Model is loading" | Wait 30 seconds and try again |
| "Network error" | Check internet connection |
| "Failed to generate" | Verify API key and try again |

## 📊 Performance

### Generation Times
- **First generation**: 10-30 seconds (model loading)
- **Subsequent generations**: 2-8 seconds
- **Download**: Instant

### Image Quality
- **Resolution**: 1024×576 pixels
- **Aspect Ratio**: 16:9 (YouTube standard)
- **Format**: PNG with transparency support
- **File Size**: Typically 200KB-800KB

## 🔒 Security

- **API keys are server-side only** - never exposed to browsers
- **No user data stored** - everything is session-based
- **Secure environment variables** - properly configured
- **No external tracking** - privacy-focused

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Add proper error handling
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face** for providing the FLUX.1-schnell model
- **Vercel** for Next.js and deployment platform
- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for styling system
- **Framer Motion** for smooth animations

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/your-username/yt-thumbnail/issues)
3. Create a new issue with:
   - Error message (if any)
   - Steps to reproduce
   - Your environment details

## 🗺️ Roadmap

- [ ] **Multiple AI models** support
- [ ] **Batch generation** for multiple titles
- [ ] **Custom template creation**
- [ ] **Brand integration** (logos, colors)
- [ ] **A/B testing** features
- [ ] **Analytics integration**
- [ ] **Video preview** integration

---

**Made with ❤️ using Next.js, TypeScript, and AI**

*Generate professional YouTube thumbnails in seconds!*