from fastapi import FastAPI
import yfinance as yf
import os
from google.generativeai import configure
from app.utils.features import build_features
from app.predictor import ensemble_predict, explain_shap
from app.utils.sentiment import compute_sentiment

app = FastAPI()

# Configure Google API
configure(api_key=os.getenv("GOOGLE_API_KEY"))

@app.post("/ml/predict")
async def predict(symbol: str, horizon: int):
    try:
        # Fetch stock data
        data = yf.download(symbol + ".NS", period="1y")
        if data.empty:
            return {
                "symbol": symbol,
                "prediction": [{"date": "", "pred": 0.0, "conf": 0.0}] * horizon,
                "sentiment": {"score": 0.5, "headlines": ["No data available"]},
                "shap": [{"feature": "price", "value": 0.1}],
                "explanation": "No stock data found."
            }
        
        # Build features
        features = build_features(data)
        
        # Compute sentiment score
        try:
            sentiment_result = compute_sentiment(symbol)
            sentiment_score = sentiment_result["score"]
            sentiment_headlines = sentiment_result["top_headlines"]
        except Exception as sentiment_error:
            # Fallback in case sentiment analysis fails
            sentiment_score = 0.5
            sentiment_headlines = [f"Sentiment analysis failed: {str(sentiment_error)}"]
        
        # Ensemble prediction
        predictions = ensemble_predict(features, horizon, sentiment_score)
        
        # SHAP explanation
        shap_values = explain_shap(features)
        
        return {
            "symbol": symbol,
            "prediction": predictions,
            "sentiment": {"score": sentiment_score, "headlines": sentiment_headlines},
            "shap": shap_values,
            "explanation": "Prediction based on ensemble of ARIMA, Prophet, XGBoost, and LSTM."
        }
    except Exception as e:
        return {
            "symbol": symbol,
            "prediction": [{"date": "", "pred": 0.0, "conf": 0.0}] * horizon,
            "sentiment": {"score": 0.0, "headlines": ["Error fetching data"]},
            "shap": [],
            "explanation": f"Error: {str(e)}"
        }

@app.get("/")
def read_root():
    return {"message": "Welcome to the IntelVestor ML API"}