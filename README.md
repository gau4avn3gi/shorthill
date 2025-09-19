# Shorthill Project

This repository contains the backend and frontend code for the Shorthill project along with the database SQL file.

## Directory Structure

```
shorthill-project/
│
├── backend/                # Laravel backend code
│   ├── app/                # Application code
│   ├── config/             # Configuration files
│   ├── database/           # Database migrations and seeds
│   ├── public/             # Public assets
│   ├── routes/             # API and web routes
│   ├── resources/          # Views, frontend assets (if any)
│   └── ...                 # Other Laravel folders
│
├── shorthill-frontend/     # Frontend code
│   ├── index.html          # Main HTML file
│   ├── register.html       # Registration page
│   ├── products.html       # Products page
│   ├── style.css           # Stylesheet
│   ├── auth.js             # Authentication JS logic
│   ├── products.js         # Products page JS logic
│   └── ...                 # Any other frontend assets
│
├── database.sql            # Database dump for initial setup
└── README.md               # Project documentation
```

## Setup Instructions

### Backend (Laravel)

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   composer install
   ```
3. Copy the `.env.example` to `.env` and configure database settings:

   ```bash
   cp .env.example .env
   ```
4. Run migrations and seeders:

   ```bash
   php artisan migrate --seed
   ```
5. Start the Laravel server:

   ```bash
   php artisan serve
   ```

### Frontend

1. Navigate to the `shorthill-frontend` folder:

   ```bash
   cd shorthill-frontend
   ```
2. Open `index.html` in a browser to access the login page.

### Database

* Import the provided `database.sql` file into your MySQL or MariaDB server to set up the initial database.

## Notes

* The frontend communicates with the backend via API endpoints (e.g., `http://127.0.0.1:8000/api/login`).
* Admin users have access to add, edit, and delete products. Regular users can only view products.
