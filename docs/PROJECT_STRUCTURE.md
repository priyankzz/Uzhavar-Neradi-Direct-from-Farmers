# 🌾 Uzhavar Neradi - Project Structure

## 📁 Root Folder

uzhavar-neradi/
│
├── backend/
├── frontend/
├── docs/
└── README.md


--------------------------------------------------

## 🐍 Backend Structure (Django)

backend/
│
├── manage.py
├── requirements.txt
├── .env
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── users/
├── products/
├── orders/
├── admin_panel/
├── analytics/
└── media/


--------------------------------------------------

## 💻 Frontend Structure (React)

frontend/
│
├── public/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   │   ├── customer/
│   │   ├── seller/
│   │   └── admin/
│   │
│   ├── routes/
│   ├── context/
│   ├── i18n/
│   ├── App.js
│   └── index.js
│
└── package.json


--------------------------------------------------

## 📄 Docs

docs/
├── techspec.md
├── workflow.md
├── api-contract.md
└── presentation.pptx