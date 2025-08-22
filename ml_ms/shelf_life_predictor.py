from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import numpy as np
from datetime import datetime, timedelta
import joblib
import os

app = FastAPI()

# Food shelf life base values (in hours) at optimal conditions (4°C, 60% humidity)
FOOD_SHELF_LIFE_BASE = {
    "GRAINS": {
        "rice": 72, "bread": 48, "pasta": 96, "wheat": 168, "corn": 72,
        "oats": 168, "quinoa": 96, "barley": 168, "millet": 120
    },
    "MEAT": {
        "chicken": 24, "beef": 48, "pork": 48, "fish": 12, "lamb": 48,
        "turkey": 24, "duck": 24, "sausage": 36, "bacon": 72
    },
    "VEGETABLES": {
        "tomato": 48, "potato": 168, "onion": 336, "carrot": 168,
        "broccoli": 72, "spinach": 48, "lettuce": 72, "cucumber": 72,
        "bell_pepper": 96, "cauliflower": 96, "cabbage": 168
    },
    "DAIRY": {
        "milk": 48, "cheese": 168, "yogurt": 72, "butter": 168,
        "cream": 48, "curd": 48, "paneer": 72
    },
    "FRUITS": {
        "apple": 168, "banana": 72, "orange": 168, "grape": 96,
        "strawberry": 48, "mango": 72, "pineapple": 96, "watermelon": 48
    }
}

class FoodShelfLifeRequest(BaseModel):
    foodItem: str = Field(..., description="Name of the food item")
    foodCategory: str = Field(..., description="Category: GRAINS, MEAT, VEGETABLES, DAIRY, FRUITS")
    temperature: float = Field(..., ge=-10, le=50, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")

class FoodShelfLifeResponse(BaseModel):
    foodItem: str
    foodCategory: str
    temperature: float
    humidity: float
    predictedShelfLife: float
    expiresAt: datetime
    remainingHours: float
    isSafeToEat: bool
    riskLevel: str

def calculate_temperature_factor(temp):
    """Calculate temperature factor affecting shelf life"""
    if temp <= 4:  # Refrigeration
        return 1.0
    elif temp <= 10:  # Cool storage
        return 0.7
    elif temp <= 20:  # Room temperature
        return 0.4
    elif temp <= 30:  # Warm
        return 0.2
    else:  # Hot
        return 0.1

def calculate_humidity_factor(humidity):
    """Calculate humidity factor affecting shelf life"""
    if 40 <= humidity <= 70:  # Optimal humidity
        return 1.0
    elif humidity < 40:  # Low humidity
        return 0.8
    elif humidity <= 85:  # High humidity
        return 0.6
    else:  # Very high humidity
        return 0.3

def get_base_shelf_life(food_item, category):
    """Get base shelf life for a food item"""
    food_item_lower = food_item.lower().replace(" ", "_")
    
    # Check specific food item first
    if category in FOOD_SHELF_LIFE_BASE:
        for key, value in FOOD_SHELF_LIFE_BASE[category].items():
            if key in food_item_lower or food_item_lower in key:
                return value
    
    # Return category default if specific item not found
    category_defaults = {
        "GRAINS": 72,
        "MEAT": 36,
        "VEGETABLES": 96,
        "DAIRY": 72,
        "FRUITS": 96
    }
    return category_defaults.get(category, 48)

@app.get('/')
async def root():
    return {"message": "Food Shelf Life Prediction API"}

@app.post('/predict-shelf-life', response_model=FoodShelfLifeResponse)
async def predict_shelf_life(request: FoodShelfLifeRequest):
    try:
        # Get base shelf life
        base_shelf_life = get_base_shelf_life(request.foodItem, request.foodCategory)
        
        # Calculate environmental factors
        temp_factor = calculate_temperature_factor(request.temperature)
        humidity_factor = calculate_humidity_factor(request.humidity)
        
        # Calculate predicted shelf life
        predicted_shelf_life = base_shelf_life * temp_factor * humidity_factor
        
        # Calculate expiration time
        expires_at = datetime.now() + timedelta(hours=predicted_shelf_life)
        remaining_hours = predicted_shelf_life
        
        # Determine if safe to eat
        is_safe_to_eat = remaining_hours > 0
        
        # Determine risk level
        if remaining_hours > 24:
            risk_level = "LOW"
        elif remaining_hours > 6:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"
        
        return FoodShelfLifeResponse(
            foodItem=request.foodItem,
            foodCategory=request.foodCategory,
            temperature=request.temperature,
            humidity=request.humidity,
            predictedShelfLife=round(predicted_shelf_life, 2),
            expiresAt=expires_at,
            remainingHours=round(remaining_hours, 2),
            isSafeToEat=is_safe_to_eat,
            riskLevel=risk_level
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get('/food-categories')
async def get_food_categories():
    """Get available food categories and their items"""
    return {
        "categories": list(FOOD_SHELF_LIFE_BASE.keys()),
        "food_items": FOOD_SHELF_LIFE_BASE
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 