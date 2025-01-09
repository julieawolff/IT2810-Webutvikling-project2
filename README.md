# Shaken & Stirred 🥂

Link to our website: http://it2810-13.idi.ntnu.no/project2/

Make sure you are either connected to an NTNU Wifi or VPN and that you do not have another server running on port 3001.

**NOTE #1:** On the VM, you cannot refresh the page - we will look into this for the next hand-in. If you want to test for instance session storage for filtering, you should do it locally.
If you encounter difficulties with loading the page you can always go back to the start link: http://it2810-13.idi.ntnu.no/project2/ or refresh.

## 🥂 Short description

Shaken & Stirred is an application created in connection with the NTNU subject IT2810 Webutvikling.

### Idea

The main purpose of Shaken & Stirred is to let the user easily discover and explore a variety of cocktails, fetched from our database. The user is able to perform various filter-, sort- and search functionality simultaneously, which will affect which cocktails are displayed and their ordering. Further, it is possible to click onto a specific cocktial in order to get more information about it such as ingredients and the recipe. A user can also mark cocktails as his/her favorites as well as add reviews with a comment and a rating - this makes it easier for other users to find their new favorite cocktail. In UserPage, a user is able to see and manage all favorited drinks as well as reviews he/she has written.

### A walkthrough of the application and the different pages is given below:

#### 1 - LandingPage

<img width="500" alt="Skjermbilde 2024-11-19 kl  16 20 42" src="https://git.ntnu.no/IT2810-H24/T13-Project-2/assets/523/3f341e00-3f73-4469-a786-adc90a1ef013">

The first page the user is met by after opening the application. The application also navigates to this page when clicking the logo in the left corner of the Navbar.

#### 2 - UserStartPage

<img width="500" alt="Skjermbilde 2024-11-19 kl  16 28 24" src="https://git.ntnu.no/IT2810-H24/T13-Project-2/assets/523/c6d43937-4e38-443b-aac5-1dc1cfd884ad">

The page where a user creates a username the first using the application.

#### 3 - MainPage

<img width="500" alt="Skjermbilde 2024-11-19 kl  16 29 07" src="https://git.ntnu.no/IT2810-H24/T13-Project-2/assets/523/ee10caf3-aae7-469d-a017-74abb124a47c">

The main page where a variety of cocktails are displayed along with their name, image and the average rating received. The user can perform various filter- sort- and search functionality and mark cocktails as favorites. It is possible to filter on different popular alcohol types as well and non-alcoholic cocktails and it is possible to sort after both name and average rating. By clicking on a CocktailCard, the user is navigated to the _CocktailPage_ of the clicked cocktail. By scrolling to the bottom of the page, more cocktails will appear with dynamic loading.

#### 4 - CocktailPage

<img width="500" alt="Skjermbilde 2024-11-19 kl  16 20 42" src="https://git.ntnu.no/IT2810-H24/T13-Project-2/assets/523/d8a73e8b-9ec8-4d39-a18b-7b8d8c83f94d">

A page that displays more detailed information on a cocktail, such as its ingrediends and instructions.
Below, reviews are displayed and a user can also leave a review giving it a comment and a rating. This rating will of course weigh in on the cocktail's average rating.

#### 5 - UserPage

<img width="500" alt="Skjermbilde 2024-11-20 kl  19 39 41" src="https://git.ntnu.no/IT2810-H24/T13-Project-2/assets/497/fee0e1cd-2378-4f99-8869-b3ac7e63f4de">

When clicking the UserIcon in the Navbar, the user is navigated to the UserPage. This is where the user can see and manage his/her favorite cocktails and reviews. By clicking the CocktailCard or the review, the user is navigated to the CocktailPage of that very cocktail.

## 🥂 Choices we have made

### Choice of data

We have filled our database with data from [The CocktialDB API](https://www.thecocktaildb.com) via a [script](prosjekt2/backend/database_populating.py). We also generated users and some comments with ratings on each cocktail with the script. Because this was randomized, currently there are some mismatches between comment-text and ratings (ex: high rating and a negative comment). We did not prioritize fixing this, because we saw it as irrelevant to the rest of the functionality of the application.

### Choices related to search, filtering and sorting

To enhance the user experience, we made the following decisions regarding search, filtering, and sorting.

- When searching, the results update automatically and include any cocktails that contain the search text, not just those that start with it.
- Users can filter cocktails by one or more alcohol types, as well as by non-alcoholic options. If no filters are applied, the entire cocktail collection is shown.
- By default, cocktails are sorted on rating (high to low). Users can also choose to sort on low-to-high rating or in alphabetical order, both ascending and descending

### Choices related to sustainability

In order to reduce our application's energy consumption, we have attempted to conciously make sustainable choices during the development:

- We have implemented lightmode/darkmode
- We have used .avif format for images which generate smaller files compared to for instance .jpeg and .webp
- We chose not to display images for each ingredient, in order to keep the number of images in our application low
- We have put thought into limiting the user interactions to a bare minimum of pages (a user mostly spends time in only three different pages; _MainPage_, _CocktialPage_ and _UserPage_)
- We have tried to send as few API calls as possible, and only fetching necessary information in our queries (ex: in MainPage, we only fetch name, image etc. for each Cocktail, not the entire Cocktail object with info such as ingredients and instructions)
- Add debounce to search such that data only is fetched when the user has not typed a new character for 0.5 seconds

_Some images from the darkmode implementation:_

<img width="500" alt="Skjermbilde 2024-11-20 kl  13 30 30" src="https://git.ntnu.no/IT2810-H24/T13-Project-2/assets/523/1c642b42-2218-40ed-a1d2-4a1941b275b1">
<img width="500" alt="Skjermbilde 2024-11-20 kl  13 30 47" src="https://git.ntnu.no/IT2810-H24/T13-Project-2/assets/523/da2b056e-7c31-4476-8888-203db23f0cc4">

### Choices related to accessability

We have made key decisions to enhance the accessibility of our application:

- **ARIA Labels**: We implemented ARIA labels to improve screen reader support, helping users with visual impairments navigate the app more effectively. The MUI library used includes some features automatically, but additional labels were added to make the screen reader more user-friendly.

- **Color-Blind Friendly Palette**: Our color theme is designed to be distinguishable for all types of color blindness, ensuring that visual elements are clear to every user.

- **Tabular Navigation**: All elements are navigable with tabular navigation to account for keyboard users.

### Choices related to global state management 

Our approach to global state management focuses on simplicity and enhancing the user experience:

- **Theme Management**: We use global state to store the user's theme preference (light or dark mode), ensuring a consistent experience across all components and pages.

- **State Simplicity**: We have kept our global state minimal, focusing on managing only application features like the theme, which helps maintain clarity and reduces complexity in our codebase.


### Choices related to reproducible code

In order to make it easy for other persons to understand and run the project as we inteded, we have tried our best at writing reproducible code.

- We have written this README with useful information about the application; how to install and run the application, how to run the tests and some explaination of different choices we have made
- We have describing comments throughout the code for all components and pages, as well as for functions where it may not be obvious what is being done
- All tests (both frontend and cypress tests) actively use `describe` and `it` keywords to explain what each test does   


## 🥂 Technologies

This project uses [Vite](https://vitejs.dev) as the build tool and [React](https://react.dev) as the frontend framework with [TypeScript](https://www.typescriptlang.org) for type safety. For backend, we use [Apollo Server](https://www.apollographql.com) and [Neo4j Database](https://neo4j.com). In addition, [GraphQL](https://graphql.org) contributes to efficient data fetching.

In short, we have decided to follow the GRAND Web stack (GraphQL, React, Apollo, Neo4j Database) - a powerful and modern web stack for building an efficient and graph-based application. A large part of the stack was predefined for us, but we specificaly chose to use Neo4j Database because it excels at 

Additionally, we have used the popular React component library [Mui Material](https://mui.com), since reuse of components was encouraged by the staff in this course.

## 🥂 Installation and running the project

To run the project locally, you need to have Node.js and Npm installed. If you don't have these, you can download them from the following links:

- [Node.js](https://nodejs.org/en/)
- [Npm](https://www.npmjs.com)

We use Node version 22.

When you have Node.js and Npm installed, you can follow the steps below.

### How to run the project locally

1. Clone the repository
2. Open the terminal and navigate into /T13-Project-2/prosjekt2/backend directory:
   ```
   cd prosjekt2
   cd backend
   ```

3. Run `npm install` to intall the project dependencies for backend
4. Run `npm start` to start the backend
5. Navigate to /T13-Project-2/prosjekt2/frontend directory:
   ```
   cd ..
   cd frontend
   ```
6. Run `npm install` to intall the project dependencies for frontend
7. Run `npm run dev` to start the developement server
8. Follow the instructions in the terminal to open the project in your browser (open localhost)

## 🥂 Testing

Testing is important in order to make sure the app works as intended for all different features and interactions.
In order to test our application, we have written frontend tests (for our components) using Vitest and automated end-2-end tests with Cypress (which also tests the API).

### A) Frontend tests

We have a test file for each of our 17 different components and 5 different pages, resulting in a total of 80 frontend tests. These tests mainly check that rendering and function calls happen as expected, as one interacts with the components.

#### How to run the frontend Vitest tests

1. Clone the repository
2. Open the terminal and navigate into the /T13-Project-2/prosjekt2/frontend directory:
   ```
   cd prosjekt2
   cd frontend
   ```
3. Run `npm install` to install the project dependencies for frontend
4. Run `npm test` in order to actually run the tests

#### Code coverage

We used Istanbul in order to measure and monitor our frontend code coverage. Istanbul helps us ensure that our codebase is thoroughly tested by tracking which parts of the code are covered during testing.

This is the code coverage report for our components and pages:
<img width="575" alt="image" src="https://git.ntnu.no/IT2810-H24/T13-Project-2/assets/523/86c3b556-9bcd-40a7-9713-3a96c578cb78">

**HOW TO GENERATE THE CODE COVERAGE REPORT IN THE TERMINAL**

1. Navigate to the frontend folder
2. Run the following command `npm test -- --coverage`

### B) End-2-end tests

#### How to run the end-2-end Cypress tests

1. Clone the repository
2. Open the terminal and navigate into the /T13-Project-2/prosjekt2/e2e directory:
   ```
   cd prosjekt2
   cd e2e
   ```
3. Run `npm install` to install the project dependencies for Cypress tests
4. Run `npx cypress open` in order to launch Cypress
5. Choose E2E Testing as testing type and open in your preferred browser
6. Click on the specs in order to get the respective tests to run

## 🥂 Authors

This project is authored by Group 13 in IT2810 Webutvikling.
