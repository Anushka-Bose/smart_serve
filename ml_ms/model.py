import os
import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from xgboost import XGBRegressor
import numpy as np

def train_model(preprocessed_path, model_save_path):
    """
    Fixed XGBoost training function that handles API compatibility issues
    """
    if not os.path.exists(preprocessed_path):
        raise FileNotFoundError(f"File not found: {preprocessed_path}")

    # Load preprocessed data
    df = pd.read_csv(preprocessed_path)
    df = df.dropna(subset=["food_waste_kg"])

    # Features & target
    X = df.drop(columns=["food_waste_kg"])
    y = df["food_waste_kg"]
    order = X.columns.tolist()

    # Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # XGBoost model with fixed parameters
    xgb = XGBRegressor(
        objective="reg:squarederror",
        n_jobs=-1,
        random_state=42,
        eval_metric="rmse"
    )

    # Hyperparameter grid
    param_dist = {
        "n_estimators": [100, 200, 300],
        "max_depth": [3, 5, 7],
        "learning_rate": [0.05, 0.1, 0.2],
        "subsample": [0.7, 0.9],
        "colsample_bytree": [0.7, 0.9]
    }

    # Randomized Search
    search = RandomizedSearchCV(
        estimator=xgb,
        param_distributions=param_dist,
        n_iter=10,
        scoring="r2",
        cv=3,
        verbose=1,
        random_state=42
    )

    print("Starting hyperparameter search...")
    search.fit(X_train, y_train)

    # Get best model and refit with early stopping
    best_model = search.best_estimator_
    
    # Fixed early stopping implementation
    try:
        best_model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            early_stopping_rounds=20,
            verbose=False
        )
    except TypeError:
        # Fallback for older XGBoost versions
        print("Using fallback training method...")
        best_model.fit(X_train, y_train)

    # Evaluation
    y_pred_test = best_model.predict(X_test)
    y_pred_train = best_model.predict(X_train)

    metrics = {
        'train_mse': mean_squared_error(y_train, y_pred_train),
        'train_r2': r2_score(y_train, y_pred_train),
        'test_mse': mean_squared_error(y_test, y_pred_test),
        'test_r2': r2_score(y_test, y_pred_test)
    }

    print(f"Best parameters: {search.best_params_}")
    print(f"Train R²: {metrics['train_r2']:.4f}, Test R²: {metrics['test_r2']:.4f}")

    # Save model with metadata
    save_object = {
        "model": best_model,
        "order": order,
        "metrics": metrics,
        "best_params": search.best_params_
    }

    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    joblib.dump(save_object, model_save_path)
    print(f"Model saved to: {model_save_path}")

    return best_model, metrics

# Usage
if __name__ == "__main__":
    preprocessed_path = r"../data/processed/preprocessed_data.csv"
    model_save_path = r"../models/food_waste_model.pkl"
    
    try:
        model, metrics = train_model(preprocessed_path, model_save_path)
        print("Training completed successfully!")
    except Exception as e:
        print(f"Training failed: {str(e)}")

