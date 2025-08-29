# Epistemy Backend

Production-ready Node/Express backend for Epistemy with MongoDB persistence and an AI pipeline that turns tutoring transcripts into a structured Teaching Pack.

## Quick start

1) Requirements
- Node 18+
- MongoDB 6+

2) Install
- Create .env (see below)
- Install deps, then run in dev

3) Environment variables (.env)
- PORT=4000
- MONGODB_URI=mongodb://localhost:27017/epistemy
- GROQ_API_KEY=gsk_...
- GROQ_BASE_URL=https://api.groq.com/openai/v1
- MODEL_TOPICS=mixtral-8x7b-32768 (example)
- MODEL_SUMMARY=mixtral-8x7b-32768
- MODEL_PROGRESS=mixtral-8x7b-32768
- MODEL_QUIZ=mixtral-8x7b-32768
- MAX_INPUT_CHARS=12000
- MAX_OUTPUT_TOKENS=600
- MAX_OUTPUT_TOKENS_PROGRESS=900
- MAX_OUTPUT_TOKENS_QUIZ=700
- LLM_STEP_PAUSE_MS=200

## High-level architecture

- Express HTTP API (index.js/server.js)
- Controllers and Services (src/controllers, src/services)
- MongoDB via Mongoose (src/dataBase/models)
- File upload via multer (text transcripts as memory upload)
- AI pipeline (LangChain + Groq-compatible Chat API) under `src/services/AIpipeline`

## AI pipeline (high-level diagram)

![AI Pipeline](https://res.cloudinary.com/dwakiaafh/image/upload/v1756441896/epistemy_pipeline_sketchflow_v2_fhipzl.png)



## Implementation details

- LLM client is OpenAI-compatible pointed to Groq baseURL; models via env.
- Strict JSON prompts; robust parser (`safeJsonFromLLM`) repairs and extracts JSON substrings.
- Per-step token caps and optional pauses mitigate TPM limits.
- `normalizeQuiz` tolerates legacy field names and validates indices.
- `persist/repair.js` can rebuild `pack` and normalize `quiz` for existing sessions.

## Dev tips

- If you see E11000 on shareToken, run the migration in README discussion or let the partial index build and unset nulls.
- To switch models, update env MODEL_* values.
- If the LLM returns prose-wrapped JSON, the parser extracts and balances braces; logs can be enabled in code for troubleshooting.
