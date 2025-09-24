from transformers import pipeline
from newsapi import NewsApiClient
import os
import statistics

sentiment_pipeline = pipeline("sentiment-analysis", model="mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis")

def compute_sentiment(symbol):
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key:
        return {"score": 0, "top_headlines": ["No NewsAPI key provided"]}
    newsapi = NewsApiClient(api_key=api_key)
    try:
        articles = newsapi.get_everything(q=symbol, language='en', sort_by='publishedAt', page_size=10)
        texts = [article['title'] + ' ' + (article['description'] or '') for article in articles['articles']]
        results = sentiment_pipeline(texts)
        scores = [res['score'] if res['label'] == 'positive' else -res['score'] for res in results]
        aggregated_score = statistics.mean(scores) if scores else 0
        return {"score": aggregated_score, "top_headlines": [article['title'] for article in articles['articles']]}
    except:
        return {"score": 0, "top_headlines": ["Failed to fetch news"]}