import os
import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib

def preprocess_data(raw_path, processed_path):
    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Raw data not found: {raw_path}")

    # --- Load dataset ---
    df = pd.read_csv(raw_path)

    # Drop ID column if present
    df = df.drop(columns=["ID"], errors="ignore")
    df = df.drop(columns=["staff_experience"], errors="ignore")

    # --- Convert date column ---
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["Day"] = df["date"].dt.day
    df["Month"] = df["date"].dt.month
    df["Year"] = df["date"].dt.year
    df["DayOfWeek"] = df["date"].dt.dayofweek
    df["IsWeekend"] = (df["DayOfWeek"] >= 5).astype(int)
    df["WeekOfYear"] = df["date"].dt.isocalendar().week
    df["MonthStart"] = df["date"].dt.is_month_start.astype(int)
    df["MonthEnd"] = df["date"].dt.is_month_end.astype(int)

    # Drop original date
    df = df.drop(columns=["date"])
    df = df.drop(columns=["day_of_week"])

    # --- Clean categorical columns ---
    for col in ["special_event", "waste_category"]:
        if col in df.columns:
            df[col] = df[col].fillna("NONE").astype(str).str.upper()

    categorical_cols = [c for c in ["special_event", "waste_category"] if c in df.columns]
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    # --- Convert numeric columns ---
    numeric_cols = ["meals_served", "temperature_C", "humidity_percent", "food_waste_kg"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # --- Fill NaNs ---
    #df["staff_experience"] = df["staff_experience"].fillna(0)
    df["meals_served"] = df["meals_served"].replace(0, 1)

    # --- Drop rows with unrealistic temperature ---
    if "temperature_C" in df.columns:
        df = df[(df["temperature_C"] >= 9) & (df["temperature_C"] <= 40)]

    # --- Feature interactions ---
    #df["StaffPerMeal"] = df["kitchen_staff"] / df["meals_served"]
    #df["ExperiencePerMeal"] = df["staff_experience"] / df["meals_served"]
    #df["Temp_Humidity"] = df["temperature_C"] * df["humidity_percent"]

    # --- Past waste trends ---
    df = df.sort_values(["Year", "Month", "Day"])
    if "food_waste_kg" in df.columns:
        df["PastWaste_3daysAvg"] = df["food_waste_kg"].shift(1).rolling(3).mean().fillna(0)
        df["PastWaste_7daysAvg"] = df["food_waste_kg"].shift(1).rolling(7).mean().fillna(0)

    # --- Scale numeric features ---
    scale_cols = ["meals_served", "kitchen_staff", "temperature_C", "humidity_percent","Temp_Humidity","PastWaste_3daysAvg", "PastWaste_7daysAvg"]
    existing_cols = [col for col in scale_cols if col in df.columns]
    scaler = StandardScaler()
    df[existing_cols] = scaler.fit_transform(df[existing_cols])

    # --- Save processed data ---
    os.makedirs(os.path.dirname(processed_path), exist_ok=True)
    df.to_csv(processed_path, index=False)
    print(f"Preprocessing done! Saved to: {processed_path}")
    joblib.dump(scaler, "scaler.pkl")
    past3 = df["food_waste_kg"].tail(3).mean()
    past7 = df["food_waste_kg"].tail(7).mean()
    joblib.dump({"PastWaste_7daysAvg" : past7,  "PastWaste_3daysAvg" : past3}, "past.pkl")

    return df

if __name__ == "__main__":
    raw_path = r"..\data\raw\train.csv"
    processed_path= r"..\data\processed\preprocessed_data.csv"
    preprocess_data(raw_path, processed_path)
