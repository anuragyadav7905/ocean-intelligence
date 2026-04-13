"""
app.py — Flask backend for Ocean.Net AI chatbot
Endpoint: POST /api/chat
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp_engine import NLPEngine
from intent_classifier import IntentClassifier

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://localhost:3000', '*'])

print("🌊 Initializing Ocean.Net NLP Engine...")
nlp = NLPEngine()
print("🧠 Initializing Intent Classifier...")
classifier = IntentClassifier()
print("✅ Ocean.Net backend ready on http://localhost:5000")


@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint."""
    data = request.get_json(silent=True)
    if not data or 'message' not in data:
        return jsonify({'error': 'Missing "message" field in request body'}), 400

    user_message = str(data['message']).strip()
    if not user_message:
        return jsonify({'error': 'Message cannot be empty'}), 400

    if len(user_message) > 1000:
        return jsonify({'error': 'Message too long (max 1000 characters)'}), 400

    # NLP matching
    nlp_result = nlp.query(user_message)
    # Intent classification
    intent_result = classifier.classify(user_message)

    # Blend confidence scores
    combined_confidence = round(
        0.6 * nlp_result['confidence'] + 0.4 * intent_result['confidence'], 4
    )

    response = {
        'response': nlp_result['answer'],
        'intent': intent_result['intent'],
        'intent_code': intent_result['intent_code'],
        'confidence': combined_confidence,
        'matched_question': nlp_result.get('matched_question'),
        'category': nlp_result['category'],
    }

    return jsonify(response), 200


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'service': 'Ocean.Net API',
        'version': '1.0.0',
        'models': ['NLPEngine (TF-IDF + Cosine)', 'IntentClassifier (Naive Bayes)'],
    }), 200


@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Ocean.Net AI Backend — POST to /api/chat with {"message": "your query"}',
        'docs': 'GET /api/health for system status',
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
