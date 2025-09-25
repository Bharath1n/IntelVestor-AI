import pandas as pd
import numpy as np

def build_features(data: pd.DataFrame) -> pd.DataFrame:
    """
    Build technical indicators and features for stock data.
    
    Args:
        data: DataFrame with OHLCV columns (Open, High, Low, Close, Volume).
    
    Returns:
        DataFrame with additional feature columns.
    """
    df = data.copy()
    
    # Simple Moving Average (SMA)
    df['sma_20'] = df['Close'].rolling(window=20).mean()
    
    # Relative Strength Index (RSI)
    delta = df['Close'].diff()
    gain = delta.where(delta > 0, 0).rolling(window=14).mean()
    loss = -delta.where(delta < 0, 0).rolling(window=14).mean()
    rs = gain / loss
    df['rsi_14'] = 100 - (100 / (1 + rs))
    
    # Exponential Moving Average (EMA)
    df['ema_12'] = df['Close'].ewm(span=12, adjust=False).mean()
    
    # Bollinger Bands
    df['bb_middle'] = df['Close'].rolling(window=20).mean()
    df['bb_std'] = df['Close'].rolling(window=20).std()
    df['bb_upper'] = df['bb_middle'] + 2 * df['bb_std']
    df['bb_lower'] = df['bb_middle'] - 2 * df['bb_std']
    
    # Volume Moving Average
    df['volume_sma_20'] = df['Volume'].rolling(window=20).mean()
    
    # Ensure Date is a column
    df['Date'] = df.index
    
    # Drop NaN values
    df = df.dropna()
    
    return df