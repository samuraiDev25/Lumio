export type PaymentStatus = 'completed' | 'pending' | 'failed';

export type Payment = {
  id: number;
  createdAt: string;
  amount: number;
  subscriptionType: string;
  paymentService: string;
  currency?: string;
  status?: PaymentStatus;
};

export type GetMyPaymentsRequest = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};
export type DataOfPayment = {
  datePayment: string;
  endDate: string;
  amount: number;
  currency: string;
  paymentType: string;
  subscriptionType: string;
};
export type GetMyPaymentsResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: DataOfPayment[];
};
