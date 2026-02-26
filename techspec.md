# 🌾 Uzhavar Neradi - Techspec

## Direct from Farmers

---

# 📌 Platform Architecture

* **Type:** Web Application (Responsive)
* **Frontend:** React + i18n (Tamil-first, English toggle)
* **Backend:** Django + Django REST Framework
* **Database:** PostgreSQL
* **Authentication:** Email + Password + Email OTP
* **Payment:** Razorpay + Cash on Delivery (COD)
* **Hosting:** TBD
* **Logo Upload:** Only Admin can upload or update the platform logo (visible on frontend)

---

# 🌾 Farmer Verification

* Hybrid model:

  * Document upload: Land proof + Aadhaar
  * Automated verification (duplication, format, fraud detection)
  * Admin final approval
* Supports strict **No Middleman Policy** enforcement

---

# 🛒 Ordering & Delivery

* **Ordering Models:**

  * Mandatory Preorder (Primary)
  * Normal Orders (Secondary)
* **Delivery:**

  * Manual status updates (Assigned, Picked up, Out for delivery, Delivered)
  * Basic Google Maps location sharing for delivery partner
* Farmer controls assignment and delivery mode

---

# 📊 AI & Analytics

* **Phase 1:** Rule-based demand insights

  * Historical order aggregation
  * Seasonal trend comparison
  * Festival-based demand mapping
  * Region-wise preorder trends
* **Phase 2:** ML-based prediction

  * Time-series forecasting
  * Demand prediction confidence score
  * Region-specific crop suggestions
  * Future: Weather data integration

---

# 👥 User Roles & Features

## Farmer

* Register & verify
* Add products, set price
* Configure delivery
* Assign delivery partner
* Manage preorders
* View demand insights & AI predictions

## Customer

* Register & verify
* Browse products
* Place preorder & normal orders
* Choose delivery/pickup
* Track orders

## Delivery Partner

* Register & verify
* Accept assigned deliveries
* Update delivery status
* Basic location sharing

## Admin

* Verify and manage **Farmers, Customers, and Delivery Partners**
* Upload / update platform **logo**
* Monitor middleman violations
* Handle disputes & complaints
* View analytics & AI system
* Platform monitoring

---

# 🌐 Bilingual Support

* Tamil-first UI with English toggle
* React i18n dynamic language switching

---

# 🔒 Security & Trust

* No middlemen
* Direct farmer pricing
* Preorder-first model
* Farmer-controlled delivery
* Assignable delivery partners
* AI & demand insights advisory only

---

# 🚀 Future Roadmap

* **Phase-wise:**

  * Phase 1: Preorder system, basic delivery, user verification, Tamil-first UI, Razorpay + COD
  * Phase 2: AI ML upgrade, delivery tracking, analytics dashboard improvements
  * Phase 3: Weather-based crop advisory, cold storage integration, farmer rating system
  * Phase 4: Android mobile app, government scheme integration
* **Ideas List:**

  * Expansion to other regional languages
  * Advanced AI insights
  * Real-time GPS delivery
  * Social/community features for farmers

---

# 🌱 Vision

Empower real farmers, enable fair pricing, reduce food waste, build a transparent Tamil-first agricultural marketplace.

**Respect Farmers. Support Direct Trade.**
