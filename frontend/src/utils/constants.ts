/**
 * Constants
 * Copy to: frontend/src/utils/constants.ts
 */

export const USER_ROLES = {
  FARMER: 'FARMER',
  CUSTOMER: 'CUSTOMER',
  DELIVERY: 'DELIVERY',
  ADMIN: 'ADMIN'
} as const;

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export const ORDER_TYPES = {
  NORMAL: 'NORMAL',
  PREORDER: 'PREORDER'
} as const;

export const PAYMENT_METHODS = {
  RAZORPAY: 'RAZORPAY',
  COD: 'COD'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
} as const;

export const PRODUCT_UNITS = {
  KG: 'KG',
  GRAM: 'GRAM',
  DOZEN: 'DOZEN',
  PIECE: 'PIECE',
  BAG: 'BAG',
  LITRE: 'LITRE'
} as const;

export const FARMING_TYPES = {
  ORGANIC: 'ORGANIC',
  CONVENTIONAL: 'CONVENTIONAL',
  MIXED: 'MIXED'
} as const;

export const VEHICLE_TYPES = {
  BIKE: 'BIKE',
  SCOOTER: 'SCOOTER',
  CAR: 'CAR',
  VAN: 'VAN',
  TRUCK: 'TRUCK'
} as const;

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const APP_NAME = 'Uzhavar Neradi';
export const APP_TAGLINE = 'Direct from Farmers';

export const SUPPORT_EMAIL = 'support@uzhavarneradi.com';
export const SUPPORT_PHONE = '+91 98765 43210';