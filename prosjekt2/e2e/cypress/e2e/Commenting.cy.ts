describe("tests", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("username", "Testinge2e");
    });
    cy.visit("/home");
    cy.contains("Rating High-Low").click();
    cy.contains("Name A-Z").click();
  });

  it("should check adding and deleting review on Cocktails", () => {
    //Add review to A1
    cy.contains("A1").click();
    cy.get("[data-testid=rating]").should("exist").click();
    cy.get(".textfield").type("It was ok!");

    cy.contains("Submit").click();
    cy.contains("It was ok!").should("exist");

    //Go back to MainPage
    cy.contains("Go back").click();

    //Add review to ABC
    cy.contains("ABC").click();
    cy.get("[data-testid=rating]").should("exist").click();
    cy.get(".textfield").type("Alright!");

    cy.contains("Submit").click();
    cy.contains("Alright!").should("exist");

    //Check that the reviews exists on the userPage
    cy.get("[data-testid=AccountCircleIcon]").click();
    cy.contains("li", "A1").should("exist");
    cy.contains("li", "ABC").should("exist");

    //Check that a user can navigate to CocktailPage by clicking on a comment
    cy.contains("A1").click();
    cy.url().should("include", "/cocktail/A1");
    cy.contains("Go back").click();

    //Delete reviews and check that they are removed
    cy.contains("li", "A1").within(() => {
      cy.contains("Delete").click();
    });
    cy.contains("li", "ABC").within(() => {
      cy.contains("Delete").click();
    });
    cy.contains("No reviews available.").should("exist");
  });
});
