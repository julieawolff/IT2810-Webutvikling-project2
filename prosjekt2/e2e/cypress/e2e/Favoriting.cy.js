describe("Favoriting functionality", function () {
    beforeEach("Set username in local storage", function () {
        cy.window().then(function (win) {
            win.localStorage.setItem("username", "Testinge2e");
        });
        cy.visit("/home");
        cy.contains("Rating High-Low").click();
        cy.contains("Name A-Z").click();
    });
    it("checks that it works to favorite and unfavorite on main page", function () {
        // Favoriting A1 and Ace
        cy.contains(".cocktail-card", "A1").within(function () {
            cy.get('[data-testid="FavoriteBorderIcon"]').should("exist").click();
        });
        cy.contains(".cocktail-card", "Ace").within(function () {
            cy.get('[data-testid="FavoriteBorderIcon"]').should("exist").click();
        });
        // Checking that they are shown in favorites overview in user page
        cy.visit("/user/Testinge2e");
        cy.get(".mini-cocktail-card").should("contain.text", "A1");
        cy.get(".mini-cocktail-card").should("contain.text", "Ace");
        // Unfavoriting only A1
        cy.contains(".mini-cocktail-card", "A1").within(function () {
            cy.get('[data-testid="FavoriteIcon"]').should("exist").click();
            cy.get('[data-testid="FavoriteBorderIcon"]').should("exist");
        });
        cy.get(".mini-cocktail-card").should("contain.text", "Ace");
        // Unfavoriting Ace as well
        cy.contains(".mini-cocktail-card", "Ace").within(function () {
            cy.get('[data-testid="FavoriteIcon"]').should("exist").click();
            cy.get('[data-testid="FavoriteBorderIcon"]').should("exist");
        });
    });
    it("checks that it works to favorite on cocktail page", function () {
        cy.contains("A1").click();
        cy.get('[data-testid="FavoriteBorderIcon"]').should("exist").click();
        cy.get('[data-testid="FavoriteIcon"]').should("exist");
        cy.visit("/user/Testinge2e");
        cy.get(".mini-cocktail-card").should("contain.text", "A1");
        // Cleanup by unfavoriting
        cy.get('[data-testid="FavoriteIcon"]').should("exist").click();
        cy.get('[data-testid="FavoriteBorderIcon"]').should("exist");
    });
    it("should return the cocktail of clicked card in favorites overview", function () {
        cy.contains("A1").click();
        cy.get('[data-testid="FavoriteBorderIcon"]').should("exist").click();
        cy.get('[data-testid="FavoriteIcon"]').should("exist");
        cy.visit("/user/Testinge2e");
        cy.get(".mini-cocktail-card").should("contain.text", "A1").click();
        cy.url().should("include", "/cocktail/A1");
        // Cleanup by unfavoriting
        cy.visit("/user/Testinge2e");
        cy.get(".mini-cocktail-card")
            .get('[data-testid="FavoriteIcon"]')
            .should("exist")
            .click();
    });
    it("should show the error message when user has no favorites", function () {
        cy.visit("/user/Testinge2e");
        cy.get(".no-favorites-text")
            .should("be.visible")
            .and("contain.text", "You don't have any favorites");
    });
});
