"""
intent_classifier.py — Intent/category classifier for Ocean.Net
Trains a Naive Bayes classifier on the knowledge base categories.
"""
import json
from pathlib import Path
import numpy as np

import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder

nltk.download('stopwords', quiet=True)

KB_PATH = Path(__file__).parent / 'knowledge_base.json'

CATEGORY_LABELS = {
    'marine_animals': 'Marine Animals',
    'coral_reefs': 'Coral Reefs',
    'ocean_pollution': 'Ocean Pollution',
    'ecosystems': 'Ocean Ecosystems',
    'fisheries': 'Fisheries',
    'climate_change': 'Climate Change',
    'biodiversity': 'Biodiversity',
    'oceanography': 'Oceanography',
    'unknown': 'General Inquiry',
}

class IntentClassifier:
    def __init__(self):
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        self.label_encoder = LabelEncoder()
        self.pipeline = None
        self._train()

    def _preprocess(self, text: str) -> str:
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        tokens = text.split()
        tokens = [self.stemmer.stem(t) for t in tokens if t not in self.stop_words and len(t) > 1]
        return ' '.join(tokens)

    def _train(self):
        """Train Naive Bayes classifier on KB entries."""
        with open(KB_PATH, 'r', encoding='utf-8') as f:
            kb = json.load(f)

        texts, labels = [], []
        for category, entries in kb.items():
            for entry in entries:
                combined = (
                    entry['question'] + ' ' + entry['answer'] + ' ' +
                    ' '.join(entry.get('keywords', []))
                )
                texts.append(self._preprocess(combined))
                labels.append(category)

        encoded_labels = self.label_encoder.fit_transform(labels)

        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
            ('nb', MultinomialNB(alpha=0.5)),
        ])
        self.pipeline.fit(texts, encoded_labels)

    def classify(self, query: str) -> dict:
        """Predict intent category and confidence."""
        processed = self._preprocess(query)
        probas = self.pipeline.predict_proba([processed])[0]
        best_idx = int(np.argmax(probas))
        category_code = self.label_encoder.inverse_transform([best_idx])[0]
        confidence = float(probas[best_idx])

        return {
            'intent': CATEGORY_LABELS.get(category_code, 'General Inquiry'),
            'intent_code': category_code,
            'confidence': round(confidence, 4),
        }
