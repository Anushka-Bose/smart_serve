from fastapi import FastAPI, Query
import json
import inflect

app = FastAPI(title="Recipe Search API")

# Inflect engine for singular/plural normalization
p = inflect.engine()

def normalize_word(word):
    """Lowercase + singularize"""
    word = word.lower().strip()
    singular = p.singular_noun(word)
    return singular if singular else word

# Load inverted index
with open("inverted_index.json", "r", encoding="utf-8") as f:
    inverted_index = json.load(f)

def search_recipes(leftovers: str):
    ingredients = [normalize_word(ing) for ing in leftovers.split(",")]
    recipe_scores = {}

    for ing in ingredients:
        if ing in inverted_index:
            for recipe in inverted_index[ing]:   # recipe is a dict
                recipe_name = recipe["name"]     # use name as key
                if recipe_name not in recipe_scores:
                    # Store recipe dict + score
                    recipe_scores[recipe_name] = {**recipe, "score": 1}
                else:
                    # Just increment score
                    recipe_scores[recipe_name]["score"] += 1

    # Rank by score, descending
    ranked = sorted(recipe_scores.values(), key=lambda x: x["score"], reverse=True)
    return ranked

@app.get("/search")
def search(leftovers: str = Query(..., description="Comma-separated ingredients")):
    """
    Example: /search?leftovers=onion,tomatoes,rice
    """
    results = search_recipes(leftovers)
    return {"input": leftovers, "results": results}
