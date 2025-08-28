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

```
Client (multipart/form-data: sessionId, studentId, transcript)
				|
				v
Controller (/tutor/process-session) -> Service -> Orchestrator (runPipeline)
				|
				v
[Preprocess]
	Inputs:
		- rawTranscriptText
	Outputs:
		- cleanText (full cleaned transcript)
		- llmText (truncated for LLM), checksum, lang
	Persist:
		- Transcript.upsert({ sessionId, clean, checksum, lang })
		- Session.upsert({ status: 'transcribed' })

				|
				v
[Topics]
	In: llmText
	Out: { subject, subtopics[{ title, objective }] }
	Persist: Session.topics

				|
				v
[Summary]
	In: llmText
	Out: { executive, key_points[], misconceptions[] }
	Persist: Session.summary

				|
				v
[Progress]
	In: llmText + previousText (prior session’s transcript for same student)
	Out: { improvements[], gaps[], nextGoals[], rubric{ criteria[], levels } }
	Persist: Session.progress

				|
				v
[Quiz]
	In: summary
	Out (raw): array of MCQs
	Normalize: ensure shape { subtopic?, q, choices[], answer_index, explanation, difficulty(1..3) }
	Persist: Session.quiz

				|
				v
[Finalize]
	Build pack: { topics, summary, progress, quiz }
	Persist: Session.pack, Session.status='processed'
	Response: { sessionId, result: pack }
```

## Storage model (ERD-style)

```
User (_id, name, email, role[tutor|student], passwordHash, ...)
	1..*  
Session (
	_id, tutorId->User, studentId->User?, title, status, paid,
	links{ studentView }, files[],
	topics{ subject, subtopics[{ title, objective }] }|null,
	summary{ executive, key_points[], misconceptions[] }|null,
	progress(Mixed)|null,
	quiz[{ subtopic?, q, choices[], answer_index, explanation, difficulty }]|undefined,
	pack(Mixed)|null,
	checksum, promptVersion, createdAt, updatedAt,
	shareToken? (unique when set)
)

Transcript (
	_id, sessionId->Session (unique), source, clean, segments?, sttMeta{ engine, lang }, checksum, createdAt
)
```

Notes
- `shareToken` uses a partial unique index; multiple sessions can omit it without collision.
- `quiz` is normalized on write to guarantee consistent shape.

## Key endpoints

- POST /tutor/signup
- POST /tutor/login
- POST /tutor/create-session
- GET  /tutor/session/:id
- POST /tutor/process-session (multipart: transcript file, fields: sessionId, studentId)

Response sample (process-session)
```
{
	"sessionId": "...",
	"result": {
		"topics": { ... },
		"summary": { ... },
		"progress": { ... },
		"quiz": [ ... ]
	}
}
```

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
