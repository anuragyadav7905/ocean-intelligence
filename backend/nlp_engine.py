"""
nlp_engine.py — NLP processing pipeline for Ocean.Net
Handles: tokenization, stopword removal, stemming, TF-IDF, cosine similarity
"""
import json
import re
import string
from pathlib import Path
import numpy as np

import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Download NLTK resources on first run
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)

KB_PATH = Path(__file__).parent / 'knowledge_base.json'

class NLPEngine:
    def __init__(self):
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        self.vectorizer = TfidfVectorizer()
        self.documents = []      # raw answers
        self.questions = []      # raw questions
        self.metadata = []       # category, keywords
        self.tfidf_matrix = None
        self._load_and_fit()

    def _load_and_fit(self):
        """Load knowledge base and build TF-IDF index."""
        with open(KB_PATH, 'r', encoding='utf-8') as f:
            kb = json.load(f)

        for category, entries in kb.items():
            for entry in entries:
                self.questions.append(entry['question'])
                self.documents.append(
                    entry['question'] + ' ' + entry['answer'] + ' ' +
                    ' '.join(entry.get('keywords', []))
                )
                self.metadata.append({
                    'question': entry['question'],
                    'answer': entry['answer'],
                    'category': entry['category'],
                    'keywords': entry.get('keywords', []),
                })

        processed = [self._preprocess(doc) for doc in self.documents]
        self.tfidf_matrix = self.vectorizer.fit_transform(processed)

    def _preprocess(self, text: str) -> str:
        """Tokenize, lowercase, remove stop words, stem."""
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        tokens = text.split()
        tokens = [self.stemmer.stem(t) for t in tokens if t not in self.stop_words and len(t) > 1]
        return ' '.join(tokens)

    def query(self, user_query: str) -> dict:
        """Find the best matching answer using cosine similarity."""
        processed_query = self._preprocess(user_query)
        query_vec = self.vectorizer.transform([processed_query])
        scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        best_idx = int(np.argmax(scores))
        confidence = float(scores[best_idx])

        if confidence < 0.05:
            return {
                'answer': (
                    "I don't have specific information on that topic yet. "
                    "Try asking about marine animals, coral reefs, ocean currents, "
                    "fisheries, climate change, or biodiversity. "
                    "Our knowledge base is continuously expanding through the AEGFA pipeline."
                ),
                'category': 'unknown',
                'confidence': round(confidence, 4),
                'matched_question': None,
            }

        meta = self.metadata[best_idx]
        return {
            'answer': meta['answer'],
            'category': meta['category'],
            'confidence': round(min(confidence * 1.2, 0.99), 4),  # calibrate upward
            'matched_question': meta['question'],
        }
