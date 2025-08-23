import pandas as pd
import inflect
import json

# Initialize inflect engine
p = inflect.engine()

def normalize_word(word):
    word = word.lower().strip()
    singular = p.singular_noun(word)
    return singular if singular else word


# Load your dataset
df = pd.read_csv("indian_food.csv")

# Fill missing values in ingredients
df['ingredients'] = df['ingredients'].fillna('')

# Split ingredients into lists
df['ingredients_list'] = df['ingredients'].str.split(',')
df['ingredients_list'] = df['ingredients_list'].apply(lambda x: [normalize_word(i.strip()) for i in x])

# Remove duplicates & sort
df['ingredients_list'] = df['ingredients_list'].apply(lambda x: sorted(set(x)))

# Create full ingredient matrix
ingredient_matrix = df['ingredients_list'].str.join('|').str.get_dummies()

# Combine with metadata
final_df = pd.concat([df[['name', 'prep_time', 'cook_time', 'diet', 'region', 'course', 'state', 'diet', 'flavor_profile']], ingredient_matrix], axis=1)

# Save ingredient matrix
final_df.to_csv("ingredient_matrix.csv", index=False)


# 🔹 Build inverted index with metadata
inverted_index = {}

# Loop through each ingredient
for ingredient in ingredient_matrix.columns:
    recipes = df[df['ingredients_list'].apply(lambda x: ingredient in x)]

    # Collect metadata for each recipe
    recipe_entries = []
    for _, row in recipes.iterrows():
        recipe_entries.append({
            "name": row['name'],
            "prep_time": row.get('prep_time', None),
            "cook_time": row.get('cook_time', None),
            "flavor_profile": row.get('flavor_profile', None),
            "region": row.get('region', None),
            "course": row.get('course', None),
            "state": row.get('state', None),
        })

    inverted_index[ingredient] = recipe_entries


# Save inverted index with metadata
with open("inverted_index.json", "w", encoding="utf-8") as f:
    json.dump(inverted_index, f, indent=2, ensure_ascii=False)
