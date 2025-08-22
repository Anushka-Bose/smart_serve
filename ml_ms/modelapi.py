from fastapi import FastAPI
from pydantic import BaseModel, Field
import joblib
import numpy as np
import requests
from datetime import date
import joblib
import calendar

model_save_path = r"..\models\food_waste_model.pkl"
app=FastAPI()
cool=joblib.load(model_save_path)

class food(BaseModel):
    meals_served: float
    kitchen_staff: float
    past_waste_kg: float=Field(ge=0)
    special_event_1: bool
    waste_category_GRAINS: bool
    waste_category_MEAT: bool
    waste_category_VEGETABLES: bool
    city: str

API_KEY = "a7e721a9c38d4d8aad6112350252208"   # replace with your valid key
BASE_URL = "https://api.weatherapi.com/v1/current.json"

def get_weather(city: str):
    try:
        params = {"key": API_KEY, "q": city}
        response = requests.get(BASE_URL, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        return {"temperature_C": data["current"]["temp_c"], "humidity_percent": data["current"]["humidity"]}
    except Exception:
        return {"temperature_C": 27.0, "humidity_percent": 77.0}

def get_today_info():
    d = date.today()

    iso_year, week_num, _ = d.isocalendar()
    weekday_num = d.weekday()   # Monday=0, Sunday=6
    is_weekend = 1 if weekday_num >= 5 else 0  # Sat(5), Sun(6)

    # Month start / end flags
    last_day = calendar.monthrange(d.year, d.month)[1]
    month_start = 1 if d.day == 1 else 0
    month_end = 1 if d.day == last_day else 0

    return {
        "Day": d.day,
        "Month": d.month,
        "Year": d.year,
        "DayOfWeek": weekday_num,   
        "WeekOfYear": week_num,
        "IsWeekend": is_weekend,        
        "MonthStart": month_start,      
        "MonthEnd": month_end           
    }

scaler = joblib.load("scaler.pkl")


# Select the same numeric columns as used in training
numeric_cols = ["meals_served", "kitchen_staff", "temperature_C", "humidity_percent", 
                "PastWaste_3daysAvg", "PastWaste_7daysAvg"]


@app.get('/')
async def start():
    return { 'message' : "hello world"}


@app.post('/predwaste')
async def pred(data : food):
    allcols=data.model_dump()
    allcols.pop("city", None)
    date=get_today_info()
    past=joblib.load("past.pkl")
    weather=get_weather(data.city)
    combined = {**weather, **past, **date, **allcols}

    # 4. Extract features in correct order
    ordcols = [combined[col] for col in cool["order"]]
    x_pred = np.array([ordcols], dtype=float)

    # 5. Scale numeric columns used in training
    numeric_idx = [cool["order"].index(col) for col in numeric_cols if col in cool["order"]]
    x_pred[:, numeric_idx] = scaler.transform(x_pred[:, numeric_idx])

    # 6. Predict
    pred_value = cool["model"].predict(x_pred)[0]

    return {'pred': float(pred_value)}

