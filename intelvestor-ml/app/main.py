from fastapi import FastAPI
from pydantic import BaseModel
from app.utils.data_loader import fetch_historical
from app.utils.features import build_features
from app.utils.sentiment import compute_sentiment
from app.predictor import ensemble_predict, explain_shap
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import os

app = FastAPI()

class PredictRequest(BaseModel):
    symbol: str
    horizon: int = 30
    start_date: str = None
    features: dict = None

class PredictResponse(BaseModel):
    symbol: str
    horizon: int
    predictions: list
    shap_values: list
    sentiment: dict
    explanation: str

@app.post("/ml/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    df = fetch_historical(req.symbol, req.start_date)
    features_df = build_features(df)
    sentiment = compute_sentiment(req.symbol)
    features_df['sentiment'] = sentiment['score']
    predictions = ensemble_predict(features_df, req.horizon, sentiment['score'])
    shap_values = explain_shap(features_df)
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GOOGLE_API_KEY"))
    prompt = PromptTemplate.from_template("Summarize top drivers for stock {symbol} prediction: SHAP {shap}, Sentiment {sentiment}.")
    chain = prompt | llm
    explanation = chain.invoke({"symbol": req.symbol, "shap": shap_values, "sentiment": sentiment['score']}).content
    return PredictResponse(
        symbol=req.symbol,
        horizon=req.horizon,
        predictions=predictions,
        shap_values=shap_values,
        sentiment=sentiment,
        explanation=explanation
    )