# 🌾 Uzhavar Neradi - Team Based Technical Specification

## Direct from Farmers

--------------------------------------------------

# 👑 CORE SYSTEM (Admin + AI + Delivery)
Handled By: Praveenkanth

## 📌 Architecture
- Backend: Django + Django REST Framework
- Database: PostgreSQL
- Authentication: Email + Password + Email OTP
- Payment Integration: Razorpay + COD
- Role-Based Access Control
- Logo Upload (Admin Only)

## 🔐 Farmer Verification System
- Land proof + Aadhaar upload
- Automated duplication & format check
- Admin final approval
- No Middleman Policy enforcement

## 🚚 Delivery Management
- Order status flow:
  - Assigned
  - Picked up
  - Out for delivery
  - Delivered
- Delivery partner assignment
- Basic Google Maps location sharing logic

## 📊 AI & Analytics
Phase 1:
- Historical order aggregation
- Seasonal comparison
- Festival demand mapping
- Region-wise preorder trend analysis

Phase 2 (Future):
- Time-series ML forecasting
- Confidence score
- Region-based crop suggestions
- Weather data integration (future)

## 🔒 Security & System Control
- Direct farmer pricing logic
- Preorder-first enforcement
- Middleman monitoring
- Complaint & dispute handling
- Platform monitoring dashboard

--------------------------------------------------

# 🛒 CUSTOMER MODULE (2 Members)

## Responsibilities

### User Features
- Customer Registration UI
- Login UI
- Browse Products Page
- Place Preorder Page
- Normal Order Page
- Choose Delivery / Pickup
- Track Order Page

### UI Requirements
- Responsive design
- Tamil-first interface
- English toggle support
- Order history display

Note:
Backend integration handled by Admin.

--------------------------------------------------

# 🌾 SELLER (FARMER) MODULE (2 Members)

## Responsibilities

### Farmer Features
- Farmer Registration UI
- Upload verification documents UI
- Add Product Page
- Set Price Page
- Manage Preorders Page
- Assign Delivery Partner UI
- View Demand Insights Page (UI only)

### UI Requirements
- Simple dashboard layout
- Order management screen
- Delivery preference configuration screen

Note:
Backend logic, verification approval, AI integration handled by Admin.

--------------------------------------------------

# 🚛 DELIVERY PARTNER (Integrated under Core System)

Managed by: Praveenkanth

Features:
- Delivery Partner Registration
- Accept Assigned Orders
- Update Delivery Status
- Basic Location Sharing

--------------------------------------------------

# 🌐 Bilingual Support (Shared Module)

- Tamil-first UI
- English toggle
- React i18n implementation
- Dynamic language switching

--------------------------------------------------

# 🚀 Phase-wise Development Responsibility

## Phase 1
- Backend setup (Admin)
- Customer UI
- Seller UI
- Preorder system
- Basic delivery status
- Verification system
- Razorpay integration

## Phase 2
- AI ML Upgrade
- Advanced Analytics Dashboard
- Delivery Tracking Enhancement

## Phase 3 & 4 (Future)
- Weather advisory
- Cold storage integration
- Farmer rating system
- Android mobile app
- Government scheme integration

--------------------------------------------------

# 🌱 Vision

Empower real farmers, enable fair pricing, reduce food waste, build a transparent Tamil-first agricultural marketplace.

Respect Farmers. Support Direct Trade.