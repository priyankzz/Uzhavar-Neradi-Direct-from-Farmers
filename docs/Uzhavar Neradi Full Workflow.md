# 🌾 Uzhavar Neradi – Full Workflow & DB Structure

---

## 1️⃣ User Roles & Workflows

### Farmer (Seller + optional Buyer)

**Pages / Screens:**

1. Login / Logout
2. Dashboard – Total products, Preorders pending, Orders in delivery, Demand insights / AI predictions
3. Product Management Page – Add / Edit / Delete products, Set price, stock, preorder options, Upload images
4. Delivery Assignment Page – Assign delivery partner for each order, Update delivery status if self-handling
5. Preorders & Orders Page – View preorder list (customer name, product, quantity, status), Update status: Not Picked / Picked / Out for Delivery / Delivered
6. Purchase Page (as Customer, optional) – Browse products, Place preorder / normal order, Checkout & payment (Razorpay / COD)
7. Profile Page – Update contact, bank info, address, View verification status

**Workflow (Farmer as Seller):**

1. Login → Dashboard
2. Add products → Product visible to customers
3. Customers place orders → Farmer assigns delivery partner
4. Delivery partner updates status → Farmer can track order
5. Dashboard shows analytics & preorder insights

**Workflow (Farmer as Buyer):**

1. Login → Browse products
2. Add to cart → Checkout → Payment
3. Order recorded in Customer table
4. Delivery partner handles delivery → updates status
5. Farmer sees purchase history (Customer view)

**DB Structure (Farmer):**

```sql
Farmers(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    password_hash VARCHAR(255),
    aadhaar_no VARCHAR(12),
    land_proof VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    products JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

---

### Customer

**Pages / Screens:**

1. Login / Logout
2. Home / Browse Products
3. Product Detail Page
4. Cart & Checkout Page
5. Orders Page
6. Profile Page

**Workflow:**

1. Login → Browse products
2. Add to cart → Checkout → Payment
3. Order stored in Customer table & Order table
4. Delivery partner updates delivery status
5. Customer can track orders until delivery completion

**DB Structure (Customer):**

```sql
Customers(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    password_hash VARCHAR(255),
    address VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)

Orders(
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES Customers(id),
    farmer_id INT REFERENCES Farmers(id),
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    preorder BOOLEAN,
    status VARCHAR(50) DEFAULT 'Pending',
    delivery_partner_id INT REFERENCES DeliveryPartners(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

---

### Delivery Partner

**Pages / Screens:**

1. Login / Logout
2. Dashboard – Assigned deliveries, Pending / Completed deliveries
3. Delivery Details Page – Customer info, address, product list, Google Maps link
4. Delivery Status Update – Not Picked → Picked → Out for Delivery → Delivered
5. Profile Page

**Workflow:**

1. Login → See assigned deliveries
2. Accept assigned delivery (if needed)
3. Pick product → Update status → Deliver to customer
4. Update system → Customer & Farmer see updated status
5. Completed deliveries archived

**DB Structure (Delivery Partner):**

```sql
DeliveryPartners(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    password_hash VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    region VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

---

### Admin

**Pages / Screens:**

1. Login / Logout
2. Dashboard – Total farmers, customers, deliveries, orders, Analytics & AI insights
3. User Management Page – Verify/manage Farmers, Customers, Delivery Partners, Approve/reject verification documents, Freeze/block accounts
4. Product / Order Monitoring – View all orders, Detect middleman violations
5. Platform Settings Page – Upload/update platform logo, Payment & system settings
6. Dispute Management Page – Handle complaints & disputes

**Workflow:**

1. Login → Dashboard
2. Monitor new registrations → Approve or reject
3. Track orders, delivery, and fraud alerts
4. View analytics → Generate insights for demand & trends

**DB Structure (Admin):**

```sql
Admins(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'SuperAdmin',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

---

## 2️⃣ Full Page Flow Summary

| Role             | Pages / Screens                                                                                     | Actions / Features                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Farmer           | Login, Dashboard, Product Management, Delivery Assignment, Preorders/Orders, Purchase Page, Profile | Add products, assign delivery, track preorders, buy products (optional), view insights |
| Customer         | Login, Home/Browse, Product Detail, Cart & Checkout, Orders, Profile                                | Browse, order, track delivery, update profile                                          |
| Delivery Partner | Login, Dashboard, Delivery Details, Status Update, Profile                                          | Accept delivery, update status, navigate to customer location                          |
| Admin            | Login, Dashboard, User Management, Product/Order Monitoring, Platform Settings, Dispute Management  | Verify users, approve/reject, monitor orders, handle disputes, upload logo             |

*Login / Logout:* All roles have separate authentication. After logout, dashboards inaccessible.

---

## 3️⃣ Additional Notes

* Farmer Dual Role → automatically creates Customer entry if they buy products
* Order Table Links → Customer → Farmer → DeliveryPartner for traceable workflow
* Status Flow → Pending → Assigned → Picked → Out for Delivery → Delivered
* Verification → All roles verified via email/phone and documents where applicable
* Analytics → Admin & Farmer dashboards show order, preorder, and dual-role insights
