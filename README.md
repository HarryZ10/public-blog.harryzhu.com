# CSIS 314 Journex Web Application

## Description

This project is a full-stack web application (for a Tumblr-clone project assignment) featuring a dynamic and interactive blogging platform. The backend is built using PHP, providing robust API endpoints, authentication services, and database interactions. The frontend is developed with React.js, offering a modern, responsive user interface.

---
### Backend Structure

The main directory written in PHP for the backend part of the project is not for public use.

### Frontend Structure

The main directory for the frontend part of the project.
- `public`: Public assets for the frontend.
- `src`: Source files for the frontend application.
  - `api`: Contains files related to API calls.
  - `components`: React components used in the application.
  - `pages`: Contains the React components for different pages.
    - `FeedPage.jsx`: The page that gets all the blogs
    - `HomePage.jsx`: The home page component.
    - `LoginPage.jsx`: The login page component.
  - `styles`: CSS files and styling related resources.
  - `App.js`: Main React application file.
  - `index.js`: Entry point for the React application.
  - `routes.js`: Defines the routing for the frontend application.

## Installation

### Backend Setup
1. Navigate to `/backend`.
2. Install the necessary PHP dependencies (if any).
3. Configure your database in `config.php`.

### Frontend Setup
1. Navigate to `/frontend`.
2. Run `npm install` or `npm ci` to install the proper node modules. DO NOT delete `package.json` or `package-lock.json`.
3. Start the frontend server with `npm start`.

## Usage

After setting up both the front end and back end, you can start using the application by navigating to the front end's URL. The application supports creating, viewing, and managing blog posts and user comments.

## Contributing

Contributions to this project are not welcome.

## Acknowledgments

* CS 314: Client-Server Systems
