export type Payment = {
  id: number;
  name: string;
  price: number;
  paymentDatetime: string;
  paymentCategoryId: number;
  paymentUserId: number;
  loadRate: number;
};

export type GetPayment = {
  id: number;
  name: string;
  price: number;
  paymentDatetime: string;
  paymentCategoryId: number;
  paymentUserId: number;
  loadRate: number;
  paymentCategoryName: string;
  paymentCategoryColor: string;
  paymentDate: string;
  paymentUserName: string;
  paymentUserGroupId: string;
};