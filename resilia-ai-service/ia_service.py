# ia_service.py
from flask import Flask, request, jsonify
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import os
import logging
from time import time

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# Le chemin vers votre modèle
MODEL_DIR = 'final_roberta_emotion_model'

# --- Chargement du modèle ---
try:
    start_time = time()
    logging.info(f"Chargement du modèle d'analyse émotionnelle depuis: {MODEL_DIR}...")
    
    # 1. Charger le tokenizer et le modèle
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    
    # 2. Créer le pipeline de classification de texte (plus facile à utiliser)
    emotion_analyzer = pipeline(
        "text-classification",
        model=model,
        tokenizer=tokenizer,
        top_k=1 # Nous ne voulons que l'émotion dominante
    )
    
    end_time = time()
    logging.info(f"Modèle chargé avec succès en {end_time - start_time:.2f} secondes.")
    MODEL_LOADED = True
    
except Exception as e:
    logging.error(f"Erreur lors du chargement du modèle: {e}")
    emotion_analyzer = None
    MODEL_LOADED = False

# --- Endpoint de l'API REST (POST /analyze) ---
@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Endpoint pour l'analyse émotionnelle.
    Reçoit un message en JSON et retourne l'émotion détectée.
    """
    if not MODEL_LOADED:
        return jsonify({"error": "Le modèle IA n'a pas pu être chargé."}), 503

    try:
        # 1. Récupérer les données envoyées par Spring Boot
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "Champ 'message' manquant dans la requête."}), 400
        
        user_message = data['message']
        
        # 2. Exécuter l'analyse émotionnelle (F3)
        # Note: L'analyse doit être rapide pour respecter la contrainte de < 3s [cite: 18]
        analysis_result = emotion_analyzer(user_message)
        
        # 3. Extraire le label de l'émotion dominante (ex: 'LABEL_0', 'LABEL_1', etc.)
        # Assurez-vous que le mapping de votre modèle (id2label) est correct.
        detected_emotion = analysis_result[0][0]['label']
        
        logging.info(f"Message analysé: '{user_message[:30]}...' -> Émotion: {detected_emotion}")
        
        # 4. Renvoyer l'émotion au backend Spring Boot
        return jsonify({"emotion": detected_emotion})

    except Exception as e:
        logging.error(f"Erreur lors du traitement de la requête: {e}")
        return jsonify({"error": "Erreur interne du service IA."}), 500

if __name__ == '__main__':
    # Le service doit s'exécuter sur le port 5000 pour que le ChatService Java puisse le joindre
    logging.info("Démarrage du service IA sur http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000)