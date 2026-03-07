/**
 * Internationalization setup
 * Copy to: frontend/src/i18n.ts
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      "appName": "Uzhavar Neradi",
      "home": "Home",
      "products": "Products",
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "profile": "Profile",
      "dashboard": "Dashboard",
      "search": "Search",
      "cart": "Cart",
      "orders": "Orders",
      
      // Auth
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "phone": "Phone Number",
      "role": "I want to register as",
      "farmer": "Farmer",
      "customer": "Customer",
      "delivery": "Delivery Partner",
      "loginNow": "Login Now",
      "registerNow": "Register Now",
      "forgotPassword": "Forgot Password?",
      "otpVerification": "OTP Verification",
      "enterOTP": "Enter the OTP sent to your email",
      "verify": "Verify",
      "resendOTP": "Resend OTP",
      
      // Products
      "addToCart": "Add to Cart",
      "buyNow": "Buy Now",
      "price": "Price",
      "quantity": "Quantity",
      "available": "Available",
      "category": "Category",
      //"farmer": "Farmer",
      "organic": "Organic",
      "conventional": "Conventional",
      "reviews": "Reviews",
      "noReviews": "No reviews yet",
      "writeReview": "Write a Review",
      
      // Orders
      "preorder": "Preorder",
      "normalOrder": "Normal Order",
      "deliveryAddress": "Delivery Address",
      "paymentMethod": "Payment Method",
      "razorpay": "Razorpay",
      "cod": "Cash on Delivery",
      "placeOrder": "Place Order",
      "orderSummary": "Order Summary",
      "subtotal": "Subtotal",
      "deliveryFee": "Delivery Fee",
      "tax": "Tax",
      "total": "Total",
      "orderStatus": "Order Status",
      "trackOrder": "Track Order",
      
      // Status
      "pending": "Pending",
      "confirmed": "Confirmed",
      "assigned": "Assigned",
      "pickedUp": "Picked Up",
      "outForDelivery": "Out for Delivery",
      "delivered": "Delivered",
      "cancelled": "Cancelled",
      
      // Farmer
      "addProduct": "Add Product",
      "myProducts": "My Products",
      "manageOrders": "Manage Orders",
      "demandInsights": "Demand Insights",
      "assignDelivery": "Assign Delivery",
      
      // Delivery
      "myDeliveries": "My Deliveries",
      "accept": "Accept",
      "reject": "Reject",
      "updateStatus": "Update Status",
      "shareLocation": "Share Location",
      
      // Admin
      "verifyUsers": "Verify Users",
      "platformSettings": "Platform Settings",
      "uploadLogo": "Upload Logo",
      "analytics": "Analytics",
      "disputes": "Disputes",
      
      // Footer
      "aboutUs": "About Us",
      "contact": "Contact",
      "terms": "Terms & Conditions",
      "privacy": "Privacy Policy",
      "allRightsReserved": "All rights reserved",
      "directFromFarmers": "Direct from Farmers"
    }
  },
  ta: {
    translation: {
      // Common
      "appName": "உழவர் நேரடி",
      "home": "முகப்பு",
      "products": "பொருட்கள்",
      "login": "உள்நுழைக",
      "register": "பதிவு செய்க",
      "logout": "வெளியேறு",
      "profile": "சுயவிவரம்",
      "dashboard": "டாஷ்போர்டு",
      "search": "தேடுக",
      "cart": "வண்டி",
      "orders": "ஆர்டர்கள்",
      
      // Auth
      "email": "மின்னஞ்சல்",
      "password": "கடவுச்சொல்",
      "confirmPassword": "கடவுச்சொல்லை உறுதி செய்க",
      "phone": "தொலைபேசி எண்",
      "role": "நான் பதிவு செய்வது",
      "farmer": "விவசாயி",
      "customer": "வாடிக்கையாளர்",
      "delivery": "விநியோக பங்குதாரர்",
      "loginNow": "இப்போது உள்நுழைக",
      "registerNow": "இப்போது பதிவு செய்க",
      "forgotPassword": "கடவுச்சொல் மறந்துவிட்டதா?",
      "otpVerification": "OTP சரிபார்ப்பு",
      "enterOTP": "உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்ட OTP ஐ உள்ளிடுக",
      "verify": "சரிபார்",
      "resendOTP": "OTP மீண்டும் அனுப்புக",
      
      // Products
      "addToCart": "வண்டியில் சேர்க்க",
      "buyNow": "இப்போது வாங்க",
      "price": "விலை",
      "quantity": "அளவு",
      "available": "கிடைக்கும்",
      "category": "வகை",
      //"farmer": "விவசாயி",
      "organic": "இயற்கை",
      "conventional": "சாதாரண",
      "reviews": "விமர்சனங்கள்",
      "noReviews": "இதுவரை விமர்சனங்கள் இல்லை",
      "writeReview": "விமர்சனம் எழுதுக",
      
      // Orders
      "preorder": "முன் ஆர்டர்",
      "normalOrder": "சாதாரண ஆர்டர்",
      "deliveryAddress": "விநியோக முகவரி",
      "paymentMethod": "கட்டண முறை",
      "razorpay": "ரேஸர்பே",
      "cod": "பணம் செலுத்துதல்",
      "placeOrder": "ஆர்டரை உறுதி செய்க",
      "orderSummary": "ஆர்டர் சுருக்கம்",
      "subtotal": "மொத்தம்",
      "deliveryFee": "விநியோக கட்டணம்",
      "tax": "வரி",
      "total": "மொத்த தொகை",
      "orderStatus": "ஆர்டர் நிலை",
      "trackOrder": "ஆர்டரை கண்காணிக்க",
      
      // Status
      "pending": "நிலுவையில்",
      "confirmed": "உறுதி செய்யப்பட்டது",
      "assigned": "ஒதுக்கப்பட்டது",
      "pickedUp": "எடுக்கப்பட்டது",
      "outForDelivery": "விநியோகத்திற்கு",
      "delivered": "விநியோகிக்கப்பட்டது",
      "cancelled": "ரத்து செய்யப்பட்டது",
      
      // Farmer
      "addProduct": "பொருளை சேர்க்க",
      "myProducts": "எனது பொருட்கள்",
      "manageOrders": "ஆர்டர்களை நிர்வகிக்க",
      "demandInsights": "தேவை பகுப்பாய்வு",
      "assignDelivery": "விநியோகத்தை ஒதுக்க",
      
      // Delivery
      "myDeliveries": "எனது விநியோகங்கள்",
      "accept": "ஏற்க",
      "reject": "நிராகரிக்க",
      "updateStatus": "நிலையை புதுப்பிக்க",
      "shareLocation": "இருப்பிடத்தை பகிர",
      
      // Admin
      "verifyUsers": "பயனர்களை சரிபார்க்க",
      "platformSettings": "தள அமைப்புகள்",
      "uploadLogo": "லோகோவை பதிவேற்ற",
      "analytics": "பகுப்பாய்வு",
      "disputes": "சர்ச்சைகள்",
      
      // Footer
      "aboutUs": "எங்களை பற்றி",
      "contact": "தொடர்பு கொள்ள",
      "terms": "விதிமுறைகள்",
      "privacy": "தனியுரிமைக் கொள்கை",
      "allRightsReserved": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை",
      "directFromFarmers": "நேரடியாக விவசாயிகளிடமிருந்து"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ta', // Tamil as default
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;