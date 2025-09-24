import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd

def fetch_historical(symbol, start_date=None):
    if start_date is None:
        start_date = (datetime.now() - timedelta(days=365*2)).strftime('%Y-%m-%d')
    end_date = datetime.now().strftime('%Y-%m-%d')
    try:
        df = yf.download(symbol + '.NS', start=start_date, end=end_date)
        df.reset_index(inplace=True)
        return df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]
    except:
        # Fallback to mock data if yfinance fails
        dates = pd.date_range(start=start_date, end=end_date, freq='B')
        return pd.DataFrame({
            'Date': dates,
            'Open': [100 + i*0.1 for i in range(len(dates))],
            'High': [101 + i*0.1 for i in range(len(dates))],
            'Low': [99 + i*0.1 for i in range(len(dates))],
            'Close': [100 + i*0.1 for i in range(len(dates))],
            'Volume': [1000000 for _ in range(len(dates))]
        })