/**
 * @monaco
 */
export interface DeliveryWindowPayload {
  deliveryScheduleId: string;
  startDate: string;
  expirationDate: string;
  endDate: string;
  vendorId: string | null;
  id: string;
  alternative: boolean | null;
}
