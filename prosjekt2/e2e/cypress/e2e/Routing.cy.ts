describe("tests", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("username", "Testinge2e");
    });
    cy.visit("/");
  });

  it("should be check that user is able to navigate around the website", () => {
    //Check that the first thing the user sees is the LandingPage
    cy.contains("Get Started").should("exist");

    //Check that the user is navigated to MainPage
    cy.contains("Get Started").click();
    cy.url().should("include", "/home");

    //Check that a user can navigate to the UserPage
    cy.get("[data-testid=AccountCircleIcon]").click();
    cy.url().should("include", "/Testinge2e");

    //Check that a user can navigate back to MainPage by click on go back
    cy.contains("Go back").click();
    cy.url().should("include", "/home");

    //Check that a user can navigate to LandingPage from HomePage
    cy.get(".logo-image").click();
    cy.url().should("include", "");

    //Check that a user can navigate to a CocktailCard
    //Sort from A to Z for predictability
    cy.visit("/home");
    cy.contains("Rating High-Low").click();
    cy.contains("Name A-Z").click();
    cy.contains("A1").click();
    cy.url().should("include", "/cocktail/A1");

    //Check that a user can navigate back to MainPage from CocktailCard
    cy.contains("Go back").click();
    cy.url().should("include", "/home");

    //Checkt that a user can navigate to Landing Page from UserPage
    cy.get("[data-testid=AccountCircleIcon]").click();
    cy.get(".logo-image").click();
    cy.url().should("include", "");
  });
});
