import pandas as pd
import pandas_ta as ta

def build_features(df):
    df = df.copy()
    df['MA_20'] = df['Close'].rolling(window=20).mean()
    df['RSI'] = ta.rsi(df['Close'])
    df['MACD'] = ta.macd(df['Close'])['MACD_12_26_9']
    bbands = ta.bbands(df['Close'])
    df['BB_upper'] = bbands['BBU_5_2.0']
    df['BB_lower'] = bbands['BBL_5_2.0']
    df['Returns'] = df['Close'].pct_change()
    df['Volatility'] = df['Returns'].rolling(window=20).std()
    df.dropna(inplace=True)
    return df