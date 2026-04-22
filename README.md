# Ocean.Net — AI-Powered Conversational System for Marine Knowledge Exploration

> **Deployed Application**: [ocean-intelligence-liart.vercel.app](https://ocean-intelligence-liart.vercel.app)
> **Capstone Research Project** | Lovely Professional University, Phagwara, India

Marine ecosystems generate vast amounts of heterogeneous data across oceanographic observations, fisheries monitoring, and biodiversity surveys. However, accessing and interpreting this knowledge typically requires domain expertise. Ocean.Net addresses this gap by providing a full-stack web application that combines Natural Language Processing, Machine Learning, and interactive data visualization to make marine science knowledge accessible through a conversational AI interface. The system is built on the Adaptive Ecological Graph Fusion Architecture (AEGFA), which integrates environmental, fisheries, and biodiversity data into a unified predictive framework achieving 0.92 average prediction accuracy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Python Flask + NLTK + Scikit-learn |
| NLP | TF-IDF Vectorizer + Cosine Similarity |
| Classification | Naive Bayes Intent Classifier |
| Knowledge Base | Curated marine Q&A entries spanning 8 categories |

---

## Project Structure

```
ocean/
├── frontend/                        # React + Vite + Tailwind application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx                    # AEGFA Methodology
│   │   │   ├── Features.jsx                 # Core Capabilities
│   │   │   ├── Pipeline.jsx                 # AEGFA Pipeline
│   │   │   ├── Chatbot.jsx                  # Embedded AI Chat
│   │   │   ├── ChatbotPage.jsx              # Full-page Chatbot
│   │   │   ├── Dashboard.jsx                # Oceanographic Dashboard
│   │   │   ├── Benchmarking.jsx             # Accuracy Benchmarks
│   │   │   ├── Datasets.jsx                 # Data Tables
│   │   │   ├── BiodiversityExplorer.jsx     # Species Explorer
│   │   │   ├── FisheriesForecasting.jsx     # Fisheries Forecasting
│   │   │   ├── InteractiveVisualizations.jsx
│   │   │   ├── AdaptiveFusion.jsx           # Fusion Weight Explorer
│   │   │   ├── Team.jsx                     # Research Team
│   │   │   └── Footer.jsx
│   │   ├── utils/
│   │   │   └── dataGenerator.js             # Chart data generators
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── app.py                       # Flask server
│   ├── nlp_engine.py                # TF-IDF + Cosine Similarity engine
│   ├── intent_classifier.py         # Naive Bayes classifier
│   ├── knowledge_base.json          # Marine knowledge base
│   └── requirements.txt
├── DESIGN.md                        # Design system documentation
└── README.md
```

---

## Local Development

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend server starts at `http://localhost:5000`.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server starts at `http://localhost:5173`.

---

## API Reference

### `POST /api/chat`

Processes a natural language query and returns a matched response with intent classification.

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

Returns system status and loaded model information.

---

## Deployment

### Frontend — Vercel

- **URL**: [ocean-intelligence-liart.vercel.app](https://ocean-intelligence-liart.vercel.app)
- Auto-deploys on push to `main` branch
- Root Directory: `frontend`
- Required environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://ocean-intelligence-backend.onrender.com` |

### Backend — Render

- **URL**: [ocean-intelligence-backend.onrender.com](https://ocean-intelligence-backend.onrender.com)
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`
- Instance Type: Free

> The backend is hosted on Render's free tier. Initial requests may experience a brief cold-start delay.

---

## Design System

The visual identity follows the **Abyssal Intelligence** design philosophy — mimicking the fluid, layered nature of the ocean through glassmorphism, tonal depth, and the absence of hard borders.

| Token | Value |
|---|---|
| Base | `#041329` (deep-ocean navy) |
| Primary Accent | `#4fdbc8` (bioluminescent teal) |
| Secondary | `#4cd7f6` (cyan) |
| Headlines | Space Grotesk |
| Body | Inter |

Full design documentation is available in [DESIGN.md](DESIGN.md).

---

## AEGFA Methodology

The Adaptive Ecological Graph Fusion Architecture (AEGFA) is the core algorithmic framework powering Ocean.Net's predictive capabilities:

1. **Multi-Modal Data Acquisition** — Satellite imagery, ocean sensor networks, and climate indices
2. **Graph Node Embedding** — Marine variables encoded as multi-dimensional graph vectors
3. **Ecological Graph Attention** — Dynamic weighting of environmental influences via attention mechanisms
4. **Adaptive Fusion** — Integration of environmental, fisheries, and biodiversity modalities into a unified knowledge state
5. **Inference and Optimization** — Ensemble prediction achieving 0.92 F1 score on marine ecosystem benchmarks

---

## Authors

| Name | Role |
|---|---|
| Anjum Rouf | Faculty Advisor |
| Sneha Pandey | Lead Researcher |
| Mohd. Faisal | ML Engineer |
| Anuja Sharma | Marine Biologist |
| Muli Sahithi Reddy | Graph Theorist |
| Anurag Singh Yadav | Cloud Systems |
| Rahul Mishra | Frontend Dev |

School of Computer Science and Engineering, Lovely Professional University, Phagwara, India

---

## Acknowledgments

This project was developed as part of the Capstone Research Program at Lovely Professional University under the guidance of faculty advisor Anjum Rouf. Oceanographic baselines and environmental data references are drawn from NOAA, NASA MODIS, Copernicus Marine Service, and the Argo Float program.

---

## License

All rights reserved. This project is part of an academic research submission and is not licensed for redistribution without permission from the authors.
