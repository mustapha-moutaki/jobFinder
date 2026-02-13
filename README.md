# JobFinder – Angular SPA Application

**Author:** Mustapha Moutaki  
---
## Project Overview

JobFinder is a professional Single Page Application (SPA) built with Angular 17+. It provides job seekers with a comprehensive platform to search for international job opportunities via public APIs, manage a list of favorites using centralized state management, and track the progress of their job applications.

To ensure data persistence without a custom backend, the project utilizes JSON Server to simulate a RESTful API environment.

---

## Project Objectives

The application provides the following core functionalities:
*   **Job Search:** Integration with public APIs to retrieve global job listings.
*   **Favorites Management:** Ability to save and organize preferred job offers.
*   **Application Tracking:** A dedicated system to monitor the status of sent applications.
*   **Profile Management:** User-specific settings and personal data administration.
*   **Authentication:** A secure-simulated environment for user access control.

---

## Technical Stack

*   **Framework:** Angular 17+ (Standalone Components Architecture)
*   **State Management:** NgRx (Store, Actions, Reducers, Effects, Selectors)
*   **Reactive Programming:** RxJS and Observables
*   **UI Components:** Angular Material
*   **Form Management:** Angular Reactive Forms
*   **API Simulation:** JSON Server
*   **Routing:** Lazy Loading, Route Guards
*   **Development Tools:** Redux DevTools, HTTP Interceptors
---

## Key Features

### 1. Authentication System
The application implements a robust simulated authentication flow:
*   **Storage:** Users are managed within the JSON Server `users` table.
*   **Security:** Passwords are hashed before storage; sensitive data is omitted when storing the user object in `sessionStorage` or `localStorage`.
*   **Protection:** Routes are secured using `AuthGuard` to prevent unauthorized access.

### 2. Job Search and Discovery
Users, including guests, can access the search engine:
*   **Filtering:** Mandatory keyword filters and optional location filters.
*   **Sorting:** Results are automatically sorted by publication date (newest first).
*   **User Experience:** Includes pagination (10 results per page) and loading indicators during data fetching.
*   **Data Display:** Detailed job cards featuring company info, location, salary (where available), and direct external links.

### 3. State Management with NgRx (Favorites)
The Favorites feature is handled through a centralized NgRx store to ensure data consistency across the application.
*   **Operations:** Add to favorites, remove from favorites, and duplicate prevention.
*   **Persistence:** Favorites are synchronized between the NgRx store and the JSON Server.
*   **UI Integration:** Real-time visual indicators show if a job is already in the user's favorites list.

### 4. Application Tracking System
Authenticated users can manage their career pipeline:
*   **Workflow:** Users can add notes and update the status of their applications (Pending, Accepted, or Rejected).
*   **Data Model:** Stores job metadata alongside the date added and user-specific notes.

---

## Architecture and Design

The project follows a modular, feature-based structure to ensure scalability and maintainability:

```text
src/
 ├── app/
 │   ├── api/              -> API communication layer (Services)
 │   ├── core/             -> Singleton services, Guards, Models, Interceptors
 │   ├── features/         -> Feature-specific modules
 │   │   ├── auth/         -> Login and Registration
 │   │   ├── jobs/         -> Search and Listing
 │   │   ├── job-details/  -> Detailed views
 │   │   └── user-details/ -> Profile and Tracking
 │   └── app.routes.ts     -> Lazy-loaded route configurations
```

**Design Principles Applied:**
*   Separation of concerns (Logic vs. Presentation).
*   Parent/Child component composition.
*   Reusable services for HTTP logic.
*   HTTP Interceptors for global request handling.

---

## Data Storage Strategy

| Storage Type | Usage |
| :--- | :--- |
| **localStorage** | Maintaining the authentication token and session state. |
| **JSON Server (db.json)** | Persistent storage for Users, Favorites, and Applications. |

---

## Installation and Setup

**1. Clone the repository**
```bash
git clone https://github.com/your-username/mustapha-moutaki-jobfinder.git
cd mustapha-moutaki-jobfinder
```

**2. Install dependencies**
```bash
npm install
```

**3. Launch the Mock API (JSON Server)**
```bash
npx json-server --watch db.json --port 3000
```

**4. Start the Angular application**
```bash
ng serve
```
The application will be available at `http://localhost:4200`.

---
## Skills Demonstrated

*   **Advanced Angular:** Utilization of Angular 17 features, Standalone components, and optimized Change Detection.
*   **State Management:** Implementation of the Redux pattern via NgRx for complex data flows.
*   **Frontend Architecture:** Designing a clean, scalable, and professional folder structure.
*   **RxJS Mastery:** Advanced use of operators for search filtering, debouncing, and stream management.
*   **UI/UX Design:** Responsive design implementation using Angular Material.
*   **Security Best Practices:** Implementation of Route Guards and secure handling of user sessions.