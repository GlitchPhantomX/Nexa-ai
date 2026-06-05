# Nexa AI - Provider-Agnostic Voice Assistant Setup

This project has been refactored to remove the dependency on Stream Video's `connectOpenAi` and OpenAI Realtime API. It now uses browser-native APIs for speech-to-text (STT) and text-to-speech (TTS), and supports free AI providers via OpenRouter, Gemini, or Groq.

## New Architecture

- **Speech-to-Text**: Browser `SpeechRecognition` API (webkit-supported).
- **AI Backend**: Custom `/api/chat` route in Next.js.
- **Text-to-Speech**: Browser `speechSynthesis` API.
- **Providers**: 
  - **OpenRouter** (Default): Supports free models like `deepseek/deepseek-r1:free`.
  - **Gemini**: Supports `gemini-1.5-flash`.
  - **Groq**: Supports `llama-3.3-70b-versatile`.

## Environment Variables

Add the following to your `.env` or `.env.local`:

```env
# AI Provider Configuration
AI_PROVIDER=openrouter # options: openrouter, gemini, groq
MODEL_NAME=deepseek/deepseek-r1:free # Model name for the selected provider

# API Keys
OPENROUTER_API_KEY=your_openrouter_key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
```

## Setup Instructions

1. **Install Dependencies**:
   (No new dependencies were added, but ensure you have the existing ones)
   ```bash
   npm install
   ```

2. **Database Push**:
   Ensure your database is up to date.
   ```bash
   npm run db:push
   ```

3. **Run Locally**:
   ```bash
   npm run dev
   ```

4. **Start a Call**:
   Navigate to the dashboard, create an agent, and start a meeting. The AI assistant will appear as a sidebar in the call view.

## Removed/Replaced Parts

- **Removed `bridge-server`**: This was an experimental WebSocket bridge for Gemini which is no longer needed.
- **Removed `connectOpenAi`**: Removed from `src/app/api/webhooks/stream/route.ts`. The AI no longer joins the call as a server-side participant; it lives in the user's browser.
- **Replaced WebRTC/Streaming logic**: All complex audio streaming logic has been replaced with standard HTTP requests and browser-native voice APIs.

## Usage

- Click **"Push to Talk"** to start speaking.
- The AI will process your speech, send it to the backend, and speak the response back to you.
- You can see the conversation history in the sidebar.
