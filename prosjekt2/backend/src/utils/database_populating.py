# The script we used to populate our database 
# Kept for documentation purposes

# from py2neo import Graph
# import requests
# import random

# def fetch_cocktails_by_letter(letter):
#     url = f"https://www.thecocktaildb.com/api/json/v1/1/search.php?f={letter}"
#     response = requests.get(url)
#     return response.json()['drinks']

# graph = Graph("bolt://it2810-13.idi.ntnu.no:7687", auth=("neo4j", "cocktailPassword"))

# def insert_cocktails(cocktail_data):
#     for cocktail in cocktail_data:
#         query = """
#             MERGE (c:Cocktail 
#                 {id: $idDrink, 
#                  name: $strDrink, 
#                  tags: COALESCE($strTags, ''), 
#                  category: COALESCE($strCategory, ''), 
#                  ibas: COALESCE($strIBA, ''), 
#                  alcoholic: COALESCE($strAlcoholic, ''), 
#                  glass: COALESCE($strGlass, ''), 
#                  instructions: COALESCE($strInstructions, ''), 
#                  image: COALESCE($strThumbnail, '')})
#             """
#         graph.run(query, 
#                idDrink=cocktail['idDrink'], 
#                strDrink=cocktail['strDrink'], 
#                strTags=cocktail.get('strTags'), 
#                strCategory=cocktail.get('strCategory'),
#                strIBA=cocktail.get('strIBA'), 
#                strAlcoholic=cocktail.get('strAlcoholic'), 
#                strGlass=cocktail.get('strGlass'), 
#                strInstructions=cocktail.get('strInstructions'),
#                strThumbnail=cocktail.get('strDrinkThumb')) 

#         # Add ingredients and measurements
#         for i in range(1, 16):  # CocktailDB has up to 15 ingredients
#             ingredient = cocktail.get(f'strIngredient{i}')
#             measurement = cocktail.get(f'strMeasure{i}')
#             if ingredient and ingredient.strip():  # Check for non-null ingredients
#                 # Insert or merge ingredient node
#                 graph.run("MERGE (i:Ingredient {name: $ingredient})", ingredient=ingredient)
#                 # Create relationship with measurement if available
#                 if measurement and measurement.strip():
#                     graph.run("""
#                     MATCH (c:Cocktail {id: $idDrink}), (i:Ingredient {name: $ingredient})
#                     MERGE (c)-[:INCLUDES {measure: $measurement}]->(i)
#                     """, idDrink=cocktail['idDrink'], ingredient=ingredient, measurement=measurement)
#                 else:
#                     # If no measurement, just create the relationship
#                     graph.run("""
#                     MATCH (c:Cocktail {id: $idDrink}), (i:Ingredient {name: $ingredient})
#                     MERGE (c)-[:INCLUDES]->(i)
#                     """, idDrink=cocktail['idDrink'], ingredient=ingredient)


# def insert_user(username):
#     query = """
#     MERGE (u:User {name: $username})
#     """

#     graph.run(query, username=username)

# def fetch_all_cocktail_ids():
#     query = "MATCH (c:Cocktail) RETURN c.id AS cocktail_id"
#     result = graph.run(query)
#     return [record["cocktail_id"] for record in result]

# def generate_random_comments_for_cocktails(cocktail_ids, user_ids):
#     for cocktail_id in cocktail_ids:
#         num_comments = random.randint(2, 7)  # Random number of comments between 2 and 7
#         print(f"Generating {num_comments} comments for cocktail {cocktail_id}")
#         for _ in range(num_comments):
#             user_id = random.choice(user_ids)  
#             description = f"{random.choice(possible_comments)}"  # Example comment
#             rating = random.randint(1, 5)  
            
#             # Create the comment relationship (assumes the relationship is COMMENTED_ON)
#             graph.run("""
#                 MATCH (u:User {name: $username}), (co:Cocktail {id: $cocktailId})
#                 MERGE (u)-[r:COMMENTED_ON]->(co)
#                 SET r.description = $description, r.rating = $rating
#                 """, username=user_id, cocktailId=cocktail_id, description=description, rating=rating)

# def assign_favorite_cocktails_to_users(user_ids, cocktail_ids):
#     for user_id in user_ids:
#         num_favorites = random.randint(0, 6)  # Random number of favorite cocktails between 2 and 6
#         favorite_cocktails = random.sample(cocktail_ids, num_favorites)  # Select random favorites

#         for cocktail_id in favorite_cocktails:
#             # Create the favorite relationship (assumes the relationship is FAVORED)
#             query = """
#             MATCH (u:User {name: $user_id}), (c:Cocktail {id: $cocktail_id})
#             CREATE (u)-[:FAVORED]->(c)
#             """
#             graph.run(query, user_id=user_id, cocktail_id=cocktail_id)


# # Populate the database
# for letter in "abcdefghijklmnopqrstuvwxyz":
#     print(f"Fetching cocktails starting with {letter}")
#     cocktails = fetch_cocktails_by_letter(letter)
#     if cocktails:
#         insert_cocktails(cocktails)
#     else:
#         print("No cocktails to insert.")

# users = ["Alice123", "ILoveCocktails", "CocktailLover", "WinterWarmer", "SummerSipper", "CocktailQueen", "Mixologist", "CocktailConnoisseur"]
# possible_comments = ["10/10, would recommend", "Seriously tasted like heaven", "Great!", "I love this drink!", "Tastes amazing!", "Not my favorite.", "Wouldn't recommend." "This is the worst cocktail I've ever had! I wouldn't wish this on my worst enemy!"]

# cocktail_ids = fetch_all_cocktail_ids()
# generate_random_comments_for_cocktails(cocktail_ids, users)
# assign_favorite_cocktails_to_users(users, cocktail_ids)

