Uzhavar Neradi – Setup Guide
📋 Prerequisites

    Python 3.11+ (with pip)

    Node.js 18+ (with npm)

    PostgreSQL (or use Docker for PostgreSQL)

    Git

🚀 Quick Start
1. Clone the Repository
bash

git clone <repository-url>
cd uzhavar-neradi

2. Backend Setup (Django)
2.1 Create and Activate Virtual Environment
bash

cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

2.2 Install Dependencies
bash

pip install -r requirements.txt

If requirements.txt is not present, install manually:
bash

pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary django-filter celery redis django-otp phonenumberslite Pillow django-environ gunicorn

2.3 Configure Environment Variables

Create a .env file in the backend/ folder with the following:
text

SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

POSTGRES_DB=uzhavar
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Email settings (use console for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
# For SMTP, uncomment and fill:
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=your-email@gmail.com
# EMAIL_HOST_PASSWORD=your-app-password

CORS_ALLOWED_ORIGINS=http://localhost:3000
SITE_URL=http://localhost:3000

# Google Maps API key (optional, for distance calculation)
GOOGLE_MAPS_API_KEY=your-key

Note: Generate a SECRET_KEY with:
bash

python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

2.4 Set Up Database

    Start PostgreSQL (if not already running):
    bash

sudo systemctl start postgresql   # Linux

Create the database (if not already exists):
bash

psql -U postgres -c "CREATE DATABASE uzhavar;"

2.5 Run Migrations
bash

python manage.py makemigrations users products orders payments delivery predictions admin_tools
python manage.py migrate

2.6 Create a Superuser (Admin)
bash

python manage.py createsuperuser

Follow the prompts to set username, email, and password.
2.7 Run Backend Server
bash

python manage.py runserver

The backend will be available at http://127.0.0.1:8000/.
3. Frontend Setup (React)

Open a new terminal and navigate to the frontend folder:
bash

cd frontend

3.1 Install Dependencies
bash

npm install --legacy-peer-deps

3.2 Configure Frontend Environment

Create a .env file in the frontend/ folder:
text

REACT_APP_API_URL=http://localhost:8000/api

3.3 Start the React Development Server
bash

npm start

The frontend will open at http://localhost:3000.
🔍 Testing the Application

    Register a new user at http://localhost:3000/register.

    Log in with the registered credentials.

    Admin: Log in with the superuser credentials at http://localhost:3000/login.

    Approve users via the Admin Dashboard → Pending Approvals.

    Farmers can add products, customers can browse and buy, delivery partners manage deliveries.

🐳 Using Docker (Alternative)

If you prefer to run everything with Docker:

    Make sure you have Docker and Docker Compose installed.

    In the project root, run:
    bash

docker-compose up --build

    This will start both backend and frontend containers.

    Access the app at http://localhost:3000.

📁 Project Structure
text

uzhavar-neradi/
├── backend/               # Django backend
│   ├── apps/              # Django apps
│   ├── core/              # Project settings
│   ├── manage.py
│   ├── requirements.txt
│   └── .env               # Environment variables
├── frontend/              # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env
└── docker-compose.yml

❗ Troubleshooting

    Port already in use: If port 8000 or 3000 is busy, stop the process using it or change the port in settings.

    Database connection errors: Ensure PostgreSQL is running and credentials match .env.

    Migrations fail: Run python manage.py makemigrations without app names to create migrations for all apps, then python manage.py migrate.

    Google Maps geocoding errors: Set GOOGLE_MAPS_API_KEY in .env or use fallback (Haversine). If the key is missing or invalid, distance calculation will use a flat fee from admin settings.

    Email not sending: Use console backend for testing; for production, configure SMTP properly.

📚 Additional Notes

    The project uses Geoapify for address autocomplete (free tier, no API key needed). The API key is already embedded in the frontend component.

    Delivery fee: ₹5 per km, calculated using Haversine formula (or Google Distance Matrix if API key provided). If coordinates missing, a flat fee from admin settings is used.

    Email notifications: When a new order is placed, the farmer receives an email. When a delivery partner is assigned, they also receive an email.

    Admin panel: /admin (Django admin) and /admin (React admin) – both are used.

🧪 Testing with Sample Data

You can quickly populate categories and products via the admin interface or use the provided admin endpoints.

Enjoy building your farm‑to‑customer platform! If you encounter issues, refer to the detailed documentation or contact the development team.