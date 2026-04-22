# Ocean.Net — AI-Powered Conversational System for Marine Knowledge Exploration

> **Live Demo**: [ocean-intelligence-liart.vercel.app](https://ocean-intelligence-liart.vercel.app)
> **Capstone Research Project** | LPU University Research Division

Ocean.Net is a full-stack web application that combines Natural Language Processing, Machine Learning, and interactive data visualization to make marine science knowledge accessible through a conversational AI interface.

---

## 🌊 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Python Flask + NLTK + Scikit-learn |
| NLP | TF-IDF Vectorizer + Cosine Similarity |
| Classification | Naive Bayes Intent Classifier |
| Data | 50+ marine Q&A entries across 8 categories |

---

## 🏗️ Project Structure

```
ocean/
├── frontend/          # React + Vite + Tailwind app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx                # AEGFA Methodology
│   │   │   ├── Features.jsx             # Core Capabilities
│   │   │   ├── Pipeline.jsx             # AEGFA Pipeline
│   │   │   ├── Chatbot.jsx              # Functional AI Chat
│   │   │   ├── ChatbotPage.jsx          # Full chatbot page
│   │   │   ├── Dashboard.jsx            # Analytics Dashboard
│   │   │   ├── Benchmarking.jsx         # Accuracy Charts
│   │   │   ├── Datasets.jsx             # Data Tables
│   │   │   ├── BiodiversityExplorer.jsx # Species explorer
│   │   │   ├── FisheriesForecasting.jsx # Forecast visualizations
│   │   │   ├── InteractiveVisualizations.jsx
│   │   │   ├── AdaptiveFusion.jsx
│   │   │   ├── Team.jsx                 # Research Team
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── app.py                # Flask server
│   ├── nlp_engine.py         # TF-IDF + cosine similarity
│   ├── intent_classifier.py  # Naive Bayes classifier
│   ├── knowledge_base.json   # 50+ marine Q&A
│   └── requirements.txt
└── README.md
```

---

## 🚀 Local Development

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at `http://localhost:5000`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🤖 API

### `POST /api/chat`

```json
// Request
{ "message": "What causes coral bleaching?" }

// Response
{
  "response": "Coral bleaching occurs when...",
  "intent": "Coral Reefs",
  "confidence": 0.87,
  "category": "coral_reefs"
}
```

### `GET /api/health`
System health check.

---

## ☁️ Deployment

### Frontend — Vercel

- Hosted at: [ocean-intelligence-liart.vercel.app](https://ocean-intelligence-liart.vercel.app)
- Auto-deploys on every push to `main`
- Root Directory set to `frontend`
- Environment variable required:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://ocean-intelligence-backend.onrender.com` |

### Backend — Render

- Hosted at: [ocean-intelligence-backend.onrender.com](https://ocean-intelligence-backend.onrender.com)
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app`
- Instance Type: Free

> **Note:** Render's free tier sleeps after 15 minutes of inactivity. The first request after sleep may take ~30 seconds to respond.

---

## 🎨 Design System — The Abyssal Intelligence

| Token | Value |
|---|---|
| Base | `#041329` (deep-ocean navy) |
| Primary Accent | `#4fdbc8` (bioluminescent teal) |
| Secondary | `#4cd7f6` (cyan) |
| Headlines | Space Grotesk |
| Body | Inter |

Design philosophy: Glassmorphism layers, tonal depth, no hard borders.

---

## 📊 AEGFA Methodology

Adaptive Ecological Graph Fusion Architecture (AEGFA):

1. **Multi-Modal Data Acquisition** — Satellite, sensor, climate indices
2. **Graph Node Embedding** — Marine variables as graph vectors
3. **Ecological Graph Attention** — Weighted environmental influences
4. **Adaptive Fusion** — Unified knowledge state
5. **Inference & Optimization** — Ensemble prediction at 0.92 F1
