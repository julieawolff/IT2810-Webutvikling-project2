export const typeDefs = `#graphql
  type Cocktail {
      id: String
      name: String
      tags: String
      ibas: String
      alcoholic: String
      glass: String
      instructions: String
      image: String
      ingredients: [Ingredient!]!
        @relationship(type: "INCLUDES", properties: "Includes", direction: OUT)
      favoritedBy: [User!]!
        @relationship(type: "FAVORED", properties: "Favored", direction: IN)
      commentedBy: [User!]!
        @relationship(
          type: "COMMENTED_ON"
          properties: "Commented_on"
          direction: IN
        )
      ratingSum: Float
        @cypher(
          statement: """
          MATCH (this)<-[comment:COMMENTED_ON]-(:User)
          RETURN round(avg(comment.rating) * 100) / 100 AS ratingSum
          """
          columnName: "ratingSum"
        )
    }

    type Ingredient {
      name: String
      drinks: [Cocktail!]!
        @relationship(type: "INCLUDES", properties: "Includes", direction: IN)
    }

    type User {
      name: String!
      favorites: [Cocktail!]!
        @relationship(type: "FAVORED", properties: "Favored", direction: OUT)
      comments: [Cocktail!]!
        @relationship(
          type: "COMMENTED_ON"
          properties: "Commented_on"
          direction: OUT
        )
    }

    type UserComment {
      rating: Int
      description: String
      username: String
    }

    type UserReview {
      cocktail: String
      rating: Int
      description: String
    }

    type Includes @relationshipProperties {
      measure: String
    }

    type Favored @relationshipProperties {
      id: Int!
    }

    type Commented_on @relationshipProperties {
      description: String!
      rating: Int!
    }

    # Liste med hvilke queries som er tilgjengelig og hva de returnerer
    type Query {
      cocktailsForMainPage(
        limit: Int
        offset: Int
        filter: [String]
        sort: String
        searchPrefix: String
      ): [Cocktail]
        @cypher(
          statement: """
          MATCH (c)<-[comment:COMMENTED_ON]-(:User)
          MATCH (c)-[:INCLUDES]->(ingredient:Ingredient)
          WHERE (
            size($filter) = 0 OR(
            ('Amaretto' IN $filter AND ingredient.name = 'Amaretto') OR
            ('Brandy' IN $filter AND ingredient.name = 'Brandy') OR
            ('Gin' IN $filter AND ingredient.name = 'Gin') OR
            ('Rum' IN $filter AND ingredient.name = 'Rum') OR
            ('Tequila' IN $filter AND ingredient.name = 'Tequila') OR
            ('Vodka' IN $filter AND ingredient.name = 'Vodka') OR
            ('Non-alcoholic' IN $filter AND c.alcoholic = 'Non alcoholic')
          )
          )
          AND toLower(c.name) CONTAINS toLower($searchPrefix)
          WITH c, round(avg(comment.rating) * 100) / 100 AS ratingSum
          ORDER BY CASE WHEN $sort = "Name A-Z" THEN c.name END ASC,
                  CASE WHEN $sort = "Name Z-A" THEN c.name END DESC,
                  CASE WHEN $sort = "Rating High-Low" THEN ratingSum END DESC,
                  CASE WHEN $sort = "Rating Low-High" THEN ratingSum END ASC
          WITH DISTINCT c, ratingSum
          SKIP $offset LIMIT $limit
          RETURN c
          """
          columnName: "c"
        )

      totalCocktailsCount(filter: [String], searchPrefix: String): Int
        @cypher(
          statement: """
          MATCH (c)-[:INCLUDES]->(ingredient:Ingredient)
          WHERE (
            size($filter) = 0 OR(
            ('Amaretto' IN $filter AND ingredient.name = 'Amaretto') OR
            ('Brandy' IN $filter AND ingredient.name = 'Brandy') OR
            ('Gin' IN $filter AND ingredient.name = 'Gin') OR
            ('Rum' IN $filter AND ingredient.name = 'Rum') OR
            ('Tequila' IN $filter AND ingredient.name = 'Tequila') OR
            ('Vodka' IN $filter AND ingredient.name = 'Vodka') OR
            ('Non-alcoholic' IN $filter AND c.alcoholic = 'Non alcoholic')
          )
          )
          AND toLower(c.name) CONTAINS toLower($searchPrefix)
            RETURN count(DISTINCT c) AS totalCount
          """
          columnName: "totalCount"
        )

      cocktailsFavoredByUser(userName: String!): [Cocktail]
        @cypher(
          statement: """
          MATCH (u:User {name: $userName})-[:FAVORED]->(c:Cocktail)
          RETURN c
          """
          columnName: "c"
        )

      commentsForCocktail(cocktailName: String!): [UserComment]
        @cypher(
          statement: """
          MATCH (c:Cocktail {name: $cocktailName})<-[comment:COMMENTED_ON]-(u:User)
          RETURN {rating: comment.rating, description: comment.description, username: u.name} AS usercomment
          """
          columnName: "usercomment"
        )

      reviewsByUser(userName: String!): [UserReview]
        @cypher(
          statement: """
          MATCH (u:User {name: $userName})-[comment:COMMENTED_ON]->(c:Cocktail)
          RETURN {cocktail: c.name, rating: comment.rating, description: comment.description} AS userreview
          """
          columnName: "userreview"
        )

      cocktailByName(cocktailName: String!): [Cocktail]
        @cypher(
          statement: """
          MATCH (c:Cocktail)
          WHERE c.name = $cocktailName
          RETURN c
          """
          columnName: "c"
        )
    }

    # Mutations
    type Mutation {
      addFavorite(userName: String!, cocktailName: String!): User
        @cypher(
          statement: """
          MATCH (u:User {name: $userName}), (c:Cocktail {name: $cocktailName})
          MERGE (u)-[:FAVORED]->(c)
          RETURN c
          """
          columnName: "c"
        )

      removeFavorite(userName: String!, cocktailName: String!): User
        @cypher(
          statement: """
          MATCH (u:User {name: $userName})-[f:FAVORED]->(c:Cocktail {name: $cocktailName})
          DELETE f
          RETURN c
          """
          columnName: "c"
        )

      createComment(
        userName: String!
        cocktailName: String!
        rating: Int!
        description: String!
      ): User
        @cypher(
          statement: """
          MATCH (u:User {name: $userName}), (c:Cocktail {name: $cocktailName})
          MERGE (u)-[r:COMMENTED_ON]->(c)
          SET r.rating = $rating, r.description = $description
          RETURN c
          """
          columnName: "c"
        )

      deleteReview(userName: String!, cocktailName: String!): Boolean
        @cypher(
          statement: """
          MATCH (u:User {name: $userName})-[comment:COMMENTED_ON]->(c:Cocktail {name: $cocktailName})
          DELETE comment
          RETURN count(comment) > 0 AS deleted
          """
          columnName: "deleted"
        )
    }
  `;
