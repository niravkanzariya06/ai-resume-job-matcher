# AI Resume Analyzer + Job Matcher (MERN)

Production-style MERN application with resume upload/parsing, ATS scoring, AI suggestions, job matching, auth, and dashboard analytics.

## Project Structure

```
ai-resume-job-matcher/
  backend/
    src/
      config/
      constants/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
    uploads/
    .env.example
    package.json
  frontend/
    src/
      api/
      components/
      context/
      pages/
      App.jsx
      main.jsx
      index.css
    .env.example
    package.json
```

## Backend Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and update values.
4. Start MongoDB locally.
5. Run: `npm run dev`

Backend URL: `http://localhost:5000`
Health check: `GET /api/health`

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env`.
4. Run: `npm run dev`

Frontend URL: `http://localhost:5173`

## Core APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/resumes/upload` (JWT + multipart file)
- `POST /api/resumes/:resumeId/analyze` (JWT)
- `GET /api/resumes` (JWT)
- `GET /api/resumes/:resumeId/matches` (JWT)
- `GET /api/jobs` (JWT)
- `POST /api/jobs` (JWT)

## Notes

- Upload supports PDF and DOCX.
- Resume parser extracts name, email, phone, skills, education, experience.
- ATS score uses weighted rubric (skills/keywords/experience).
- AI suggestions use OpenAI API if key configured; fallback recommendations otherwise.
- Job matching returns ranked top matches with reasons.
- Resume model includes version history for tracking.
