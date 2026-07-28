# CreatorFlow (Agentic Media Studio)

A hackathon project demonstrating an end-to-end generative media pipeline orchestrated by Genblaze and backed by Backblaze B2.

## Architecture & Custom Google Provider

This project uses a custom Genblaze provider architecture to natively integrate Google's latest generative media models.

**The official `genblaze-google` adapter currently targets Google's legacy Imagen workflow.** This project implements a custom Genblaze-compatible provider (`GoogleProvider`) using the latest `google-genai` SDK so it can orchestrate Google's current media models (`Nano Banana Pro` and `Veo 3.1`) while preserving Genblaze pipelines, streaming, manifests, and Backblaze storage integration.

### Models Used
- **Image Generation**: Nano Banana Pro (`nano-banana-pro-preview`)
- **Video Generation**: Veo 3.1 (`veo-3.1-generate-preview`)
- **Orchestration**: Gemini 3.6 Flash
