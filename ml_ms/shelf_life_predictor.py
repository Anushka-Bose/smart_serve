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

class ImpactTrackingRequest(BaseModel):
    userId: str = Field(..., description="User ID")
    userType: str = Field(..., description="Type of user: student, ngo, staff, organiser, admin, canteen")

class ImpactTrackingResponse(BaseModel):
    userId: str
    userType: str
    impact: str
    foodWasteReduced: float
    carbonFootprintSaved: float
    mealsSaved: int
    impactScore: float

class SurplusPredictionRequest(BaseModel):
    eventName: str = Field(..., description="Name of the event")
    guestCount: int = Field(..., ge=1, description="Number of guests")
    eventType: str = Field(..., description="Type of event: wedding, corporate, birthday, etc.")
    mealType: str = Field(..., description="Type of meal: breakfast, lunch, dinner, snacks")
    duration: int = Field(..., ge=1, le=24, description="Event duration in hours")

class SurplusPredictionResponse(BaseModel):
    eventName: str
    guestCount: int
    predictedSurplus: float
    surplusPercentage: float
    recommendedActions: list
    estimatedWaste: float
    potentialSavings: float

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

def calculate_user_impact(user_type):
    """Calculate impact based on user type"""
    # Mock impact calculations - in real implementation, this would fetch from database
    impact_data = {
        "student": {
            "foodWasteReduced": 15.5,
            "carbonFootprintSaved": 8.2,
            "mealsSaved": 25,
            "impactScore": 75.5
        },
        "ngo": {
            "foodWasteReduced": 125.0,
            "carbonFootprintSaved": 65.8,
            "mealsSaved": 200,
            "impactScore": 92.3
        },
        "staff": {
            "foodWasteReduced": 45.2,
            "carbonFootprintSaved": 23.7,
            "mealsSaved": 75,
            "impactScore": 81.8
        },
        "organiser": {
            "foodWasteReduced": 89.7,
            "carbonFootprintSaved": 47.1,
            "mealsSaved": 150,
            "impactScore": 88.9
        },
        "admin": {
            "foodWasteReduced": 250.0,
            "carbonFootprintSaved": 131.5,
            "mealsSaved": 400,
            "impactScore": 95.2
        },
        "canteen": {
            "foodWasteReduced": 67.3,
            "carbonFootprintSaved": 35.4,
            "mealsSaved": 110,
            "impactScore": 85.1
        }
    }
    
    return impact_data.get(user_type, {
        "foodWasteReduced": 0.0,
        "carbonFootprintSaved": 0.0,
        "mealsSaved": 0,
        "impactScore": 0.0
    })

def predict_surplus(event_name, guest_count, event_type, meal_type, duration):
    """Predict surplus based on event details"""
    
    # Base surplus percentages by event type
    event_type_factors = {
        "wedding": 0.25,  # 25% surplus typically
        "corporate": 0.15,  # 15% surplus
        "birthday": 0.20,  # 20% surplus
        "conference": 0.10,  # 10% surplus
        "party": 0.30,  # 30% surplus
        "meeting": 0.05,  # 5% surplus
        "default": 0.15
    }
    
    # Meal type adjustments
    meal_type_factors = {
        "breakfast": 0.8,  # Less waste for breakfast
        "lunch": 1.0,  # Standard
        "dinner": 1.2,  # More waste for dinner
        "snacks": 0.6,  # Less waste for snacks
        "default": 1.0
    }
    
    # Duration adjustments
    duration_factor = min(1.5, max(0.5, duration / 4))  # Normalize to 4-hour baseline
    
    # Calculate base surplus
    base_factor = event_type_factors.get(event_type.lower(), event_type_factors["default"])
    meal_factor = meal_type_factors.get(meal_type.lower(), meal_type_factors["default"])
    
    # Calculate surplus percentage
    surplus_percentage = base_factor * meal_factor * duration_factor
    
    # Calculate predicted surplus (in kg)
    # Assume average 0.5kg food per person per meal
    base_food_per_person = 0.5
    total_food = guest_count * base_food_per_person
    predicted_surplus = total_food * surplus_percentage
    
    # Calculate potential savings (assuming $10 per kg of food)
    potential_savings = predicted_surplus * 10
    
    # Generate recommendations
    recommendations = []
    if surplus_percentage > 0.25:
        recommendations.append("Consider reducing portion sizes")
        recommendations.append("Plan for multiple meal services")
    if guest_count > 100:
        recommendations.append("Implement buffet-style serving")
        recommendations.append("Set up donation partnerships")
    if duration > 6:
        recommendations.append("Plan for multiple meal breaks")
        recommendations.append("Consider food preservation methods")
    
    recommendations.append("Coordinate with local NGOs for surplus distribution")
    recommendations.append("Use real-time tracking for better planning")
    
    return {
        "predictedSurplus": round(predicted_surplus, 2),
        "surplusPercentage": round(surplus_percentage * 100, 1),
        "recommendedActions": recommendations,
        "estimatedWaste": round(predicted_surplus * 0.3, 2),  # 30% of surplus becomes waste
        "potentialSavings": round(potential_savings, 2)
    }

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

@app.post('/track-impact', response_model=ImpactTrackingResponse)
async def track_impact(request: ImpactTrackingRequest):
    try:
        # Calculate impact based on user type
        impact_data = calculate_user_impact(request.userType)
        
        # Generate impact message
        impact_message = f"Great work! You've helped reduce {impact_data['foodWasteReduced']}kg of food waste, saved {impact_data['carbonFootprintSaved']}kg CO2, and provided {impact_data['mealsSaved']} meals to those in need."
        
        return ImpactTrackingResponse(
            userId=request.userId,
            userType=request.userType,
            impact=impact_message,
            foodWasteReduced=impact_data['foodWasteReduced'],
            carbonFootprintSaved=impact_data['carbonFootprintSaved'],
            mealsSaved=impact_data['mealsSaved'],
            impactScore=impact_data['impactScore']
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Impact tracking error: {str(e)}")

@app.post('/predict-surplus', response_model=SurplusPredictionResponse)
async def predict_surplus_endpoint(request: SurplusPredictionRequest):
    try:
        # Predict surplus based on event details
        prediction_data = predict_surplus(
            request.eventName,
            request.guestCount,
            request.eventType,
            request.mealType,
            request.duration
        )
        
        return SurplusPredictionResponse(
            eventName=request.eventName,
            guestCount=request.guestCount,
            predictedSurplus=prediction_data['predictedSurplus'],
            surplusPercentage=prediction_data['surplusPercentage'],
            recommendedActions=prediction_data['recommendedActions'],
            estimatedWaste=prediction_data['estimatedWaste'],
            potentialSavings=prediction_data['potentialSavings']
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Surplus prediction error: {str(e)}")

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