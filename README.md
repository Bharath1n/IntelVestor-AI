IntelVestor AI
AI-driven stock prediction platform for Indian markets with sentiment analysis and explainable AI (XAI).
Tech Stack

Frontend: React, Tailwind, Clerk (Vercel)
Backend: Spring Boot, MongoDB (Render, MongoDB Atlas)
ML: FastAPI, yfinance, transformers, Gemini (Render)
CI/CD: GitHub Actions, Docker

Setup

Clone repo: git clone <repo-url>
Copy .env.example to .env and fill:
MONGODB_URI: MongoDB Atlas connection string
CLERK_SECRET_KEY: Clerk backend secret
ML_SERVICE_URL: ML service URL (e.g., http://ml:8000 locally)
NEWS_API_KEY: NewsAPI key (newsapi.org)
GOOGLE_API_KEY: Google Gemini key (ai.google.dev)


Run: docker-compose up --build
Access:
Frontend: http://localhost:3000
Backend: http://localhost:8080
ML: http://localhost:8000



Deployment

Frontend: Vercel (connect GitHub)
Backend/ML: Render (Docker, set env vars)
DB: MongoDB Atlas (free M0 cluster)

Datasets

Stock prices: yfinance (Yahoo Finance)
News: NewsAPI.org
Summaries: Google Gemini

Metrics

RMSE, MAPE, directional accuracy
Backtesting: Long-only strategy vs buy-and-hold

Disclaimer: Predictions are probabilistic, not financial advice.



