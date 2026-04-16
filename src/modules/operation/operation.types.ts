export interface ApprovalRequest {
  _id: string
  advanceNumber: string
  payableType: 'advancePayment' | 'transactions' | 'prePayments' | 'vehicleLeaseAgreement'
  advancePaymentId?: string
  driver?: {
    _id: string
    firstName: string
    middleName?: string
    lastName?: string
  }
  createdAt: string
  shipmentCode?: string
  route?: {
    _id: string
    name: string
  }
  plateNumber?: string
  totalFuelAdvances?: number
  totalPerDiemExpenses?: number
  totalOtherExpenses?: number
  total: number
  attachments?: string[]
  attachment?: string
}

export interface ApprovalFilterParams {
  select?: string
  vehiclePlateNumber?: string
  advanceNumber?: string
  driverFirstName?: string
  driverMiddleName?: string
  routeOrigin?: string
  routeDestination?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  search?: string
}

export type ApprovalAction = 'approve' | 'reject'
export type ApprovalSubject = 'advance' | 'settlement' | 'prePayment' | 'agreement'

export interface Shipment {
  _id: string
  shipmentCode: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  route: {
    _id: string
    name: string
  }
  driver?: {
    _id: string
    firstName: string
    lastName: string
  }
  vehicle?: {
    _id: string
    plateNumber: string
  }
  total: number
  shipmentDate: string
  createdAt: string
  updatedAt: string
}

export interface ShipmentFilterParams {
  shipmentCode?: string
  status?: string
  startDate?: string
  endDate?: string
  routeOrigin?: string
  routeDestination?: string
  page?: number
  limit?: number
  search?: string
}
