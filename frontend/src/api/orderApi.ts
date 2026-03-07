/**
 * Order API
 * Copy to: frontend/src/api/orderApi.ts
 */

import axiosInstance from './axiosConfig';

export const orderApi = {
  getOrders: () => axiosInstance.get('/orders/'),
  getOrder: (id: number) => axiosInstance.get(`/orders/${id}/`),
  createOrder: (data: any) => axiosInstance.post('/orders/create/', data),
  updateOrderStatus: (orderId: number, status: string) => 
    axiosInstance.post(`/orders/${orderId}/update-status/`, { status }),
  assignDelivery: (orderId: number, deliveryPartnerId: number) =>
    axiosInstance.post(`/orders/${orderId}/assign-delivery/`, { delivery_partner_id: deliveryPartnerId }),
  trackOrder: (orderId: number) => axiosInstance.get(`/orders/${orderId}/track/`),
  
  // Delivery
  getAssignments: () => axiosInstance.get('/orders/delivery/assignments/'),
  updateDeliveryStatus: (assignmentId: number, status: string, location?: any) =>
    axiosInstance.post(`/orders/delivery/${assignmentId}/update-status/`, { status, ...location }),
};