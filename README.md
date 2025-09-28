# Online Quiz Application 🧠

### 1] Project Description
****The Online Quiz Application**** is a full-stack web platform designed to provide a structured, timed quiz experience for users.

### 1. Project Goal
The primary goal is to deliver a complete, end-to-end functional application where a user can:

1. Start a quiz from an initial landing page.

2. Navigate through questions one at a time.

3. Submit their answers to the backend.

4. Receive and view their final score on a dedicated results page.

### 2. Core Features
- Database Integration: Uses a lightweight database (SQLite) to securely store quiz questions, options, and correct answers.

- Secure API: Provides an endpoint to fetch questions for the quiz (without exposing the correct answers) and a scoring endpoint to calculate the user's result on the server side.

- Interactive Frontend: A modern, responsive user interface built with Next.js/TypeScript for smooth question navigation and answer selection.

- State Management: Robust state management is implemented to accurately track user-selected options across questions.

### 3. Implemented Bonus Features ✨
| Feature |	Description |
|:--------|:------------|
| Quiz Timer |	A countdown timer is displayed on the frontend for added pressure and challenge. |
| Detailed Results |	The final screen shows the user's score and provides detailed feedback on which specific questions were answered correctly or incorrectly. |
| Animated Mascot |	An animated companion guides the user through the quiz, offering encouraging feedback and visual flair. |
| Dark/Light Mode |	Users can toggle between dark and light themes for a customized viewing experience. |
| Confetti Animation |	A celebratory confetti animation is triggered upon a high score or successful quiz completion. |
| Power-ups |	Simple power-ups (e.g., "50/50" to eliminate two wrong answers, 'Skip' to skip the question) are available to assist the user during the quiz. |
| Daily Tasks |	A system for displaying simple, repeatable daily tasks or challenges to encourage repeat visits. |
--------------------------------------------------------------------
### 2] Clear Instructions on How to Set Up and Run it Locally
#### Prerequisites
You must have the following software installed on your machine:

1. Node.js (LTS recommended)

2. pnpm (Used as the package manager)

#### Install pnpm globally if you don't have it
      npm install -g pnpm

****Step 1: Clone the Repository****

    git clone https://github.com/Raj140503/Online-Quiz-Application.git
    cd Online-Quiz-Application

****Step 2: Install Dependencies****

      pnpm install

****Step 3: Database Setup and Seeding****
This project is configured to use a local database (SQLite).

1. ****Create Environment File:**** Create a file named ```.env.local``` in the root directory.

    #### Example database connection string for local SQLite
        DATABASE_URL="file:./quiz.db

2. ****Initialize Database & Seed Data:**** Run the migration and seed script to set up the database schema and populate it with initial quiz questions.

    #### Run database migration
       pnpm run db:migrate
    #### Populate the database with quiz questions
        pnpm run db:seed
    (Note: The exact command aliases may vary but are standard conventions for database setup.)

****Step 4: Run the Application****

#### Start the development server:
      
      pnpm run dev
      
The application will now be running on ****http://localhost:3000****.

---------------------------------------------------------
### 3] Instructions on How to Run Your Test Cases

Test cases are implemented to ensure the critical backend logic, particularly the score calculation, is correct and reliable.

1. ****Ensure Dependencies are Installed:****
 
        pnpm install
2. ****Run the Test Suite:****
Execute the following command to run all configured test cases (assuming a framework like Jest or Vitest is configured):

       pnpm run test
The output will display the status of the ****backend scoring tests****, confirming that the calculated score is accurate for various answer combinations.

------------------------------------------------------
### 4] Any Assumptions or Design Choices You Made

Design Choices :

| Aspect |	Decision | Justification |
|:-------|:----------|:--------------|
| Architecture |	Full-Stack Separation |	Next.js API Routes (app/api) are used to create the backend scoring and fetch endpoints, cleanly separating data handling from the React UI.|
| Technology Stack |	Next.js & TypeScript |	Provides a robust, type-safe environment for building modern, high-performance web applications.|
| Styling |	Tailwind CSS |	Used for rapid, utility-first styling to ensure a clean and responsive user interface with minimal custom CSS.|
| Scoring Logic |	Server-Side Scoring |	The final score calculation is handled exclusively on the backend to prevent client-side manipulation, ensuring result integrity.|

****Key Assumptions****
- ****Database Technology:**** The project uses ****SQLite**** as the database to fulfill the requirement of using a database while maintaining a simple, file-based setup ideal for local development and demonstration.

- ****Question Structure:**** All questions are assumed to be Multiple-Choice Questions (MCQ) where only one option can be correct.Authentication: User authentication and persistent user profiles are not implemented in this core version; the focus is solely on the quiz flow and score calculation.

- ****Power-up Validation:**** The logic for power-ups (like 50/50) is validated on the server to prevent users from abusing the feature beyond the allowed usage count.
  
- ****Authentication:**** User authentication and persistent user profiles are not implemented in this core version; the focus is solely on the quiz flow and score calculation.
