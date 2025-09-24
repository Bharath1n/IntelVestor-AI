import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet
from xgboost import XGBRegressor
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import shap
import numpy as np

def ensemble_predict(features_df, horizon, sentiment_score):
    target = 'Close'
    X = features_df.drop(columns=['Date', target]).values
    y = features_df[target].values
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)
    y_scaled = scaler.fit_transform(y.reshape(-1, 1))

    # ARIMA
    arima_model = ARIMA(y, order=(5,1,0)).fit()
    arima_pred = arima_model.forecast(horizon)

    # Prophet
    prophet_df = features_df[['Date', target]].rename(columns={'Date': 'ds', 'Close': 'y'})
    prophet_model = Prophet()
    prophet_model.fit(prophet_df)
    future = prophet_model.make_future_dataframe(periods=horizon)
    prophet_pred = prophet_model.predict(future)['yhat'][-horizon:]

    # XGBoost
    xgb_model = XGBRegressor()
    xgb_model.fit(X, y)
    last_features = X[-1].copy()
    last_features[-1] = sentiment_score
    xgb_pred = []
    for _ in range(horizon):
        pred = xgb_model.predict(last_features.reshape(1, -1))[0]
        xgb_pred.append(pred)
        last_features = np.roll(last_features, -1)
        last_features[-1] = pred

    # LSTM
    X_lstm = np.reshape(X_scaled, (X_scaled.shape[0], 1, X_scaled.shape[1]))
    lstm_model = Sequential()
    lstm_model.add(LSTM(50, return_sequences=True, input_shape=(1, X.shape[1])))
    lstm_model.add(LSTM(50))
    lstm_model.add(Dense(1))
    lstm_model.compile(optimizer='adam', loss='mean_squared_error')
    lstm_model.fit(X_lstm, y_scaled, epochs=10, batch_size=32, verbose=0)
    lstm_pred = []
    last_input = X_lstm[-1]
    for _ in range(horizon):
        pred = lstm_model.predict(last_input.reshape(1, 1, -1), verbose=0)[0][0]
        lstm_pred.append(pred)
        last_input = np.roll(last_input, -1)
        last_input[-1] = pred

    ensemble = 0.2 * arima_pred + 0.3 * prophet_pred + 0.3 * np.array(xgb_pred) + 0.2 * scaler.inverse_transform(np.array(lstm_pred).reshape(-1,1)).flatten()
    dates = pd.date_range(start=features_df['Date'].iloc[-1] + pd.Timedelta(days=1), periods=horizon)
    return [{"date": str(date.date()), "pred": float(pred), "conf": 0.05} for date, pred in zip(dates, ensemble)]

def explain_shap(features_df):
    X = features_df.drop(columns=['Date', 'Close'])
    xgb_model = XGBRegressor().fit(X, features_df['Close'])
    explainer = shap.TreeExplainer(xgb_model)
    shap_values = explainer.shap_values(X.iloc[-1:])
    features = X.columns
    return [{"feature": feat, "value": float(val)} for feat, val in zip(features, shap_values[0])]