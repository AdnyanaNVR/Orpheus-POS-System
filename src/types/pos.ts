export type UserRole = 'owner' | 'admin' | 'cashier';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface StoreProfile {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  taxRate: number; // e.g. 11 (%)
  taxEnabled: boolean;
  taxInclusive: boolean;
  serviceChargeRate: number; // e.g. 5 (%)
  serviceChargeEnabled: boolean;
  receiptHeader: string;
  receiptFooter: string;
  printerPaperSize: '58mm' | '80mm';
  autoOpenDrawer: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStockAlert: number;
  unit: string;
  categoryId: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  itemDiscount: number; // nominal discount
  notes?: string;
}

export type PaymentMethod = 'cash' | 'qris' | 'debit_card' | 'credit_card' | 'split';

export interface SplitPaymentDetail {
  cashAmount: number;
  nonCashAmount: number;
  nonCashMethod: 'qris' | 'debit_card' | 'credit_card';
  referenceNo?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  cashierId: string;
  cashierName: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  serviceCharge: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  tenderAmount: number;
  changeAmount: number;
  paymentStatus: 'paid' | 'partial' | 'refunded';
  orderStatus: 'completed' | 'cancelled';
  splitDetails?: SplitPaymentDetail;
  notes?: string;
}

export interface CashierShift {
  id: string;
  cashierId: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  initialCash: number;
  expectedCash: number;
  actualCash?: number;
  cashDifference?: number;
  totalSalesCash: number;
  totalSalesNonCash: number;
  totalTransactions: number;
  status: 'open' | 'closed';
  notes?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'sale' | 'restock' | 'adjustment' | 'return' | 'damaged';
  quantityChange: number;
  previousStock: number;
  currentStock: number;
  reason: string;
  date: string;
  userName: string;
}

export interface AuditLog {
  id: string;
  date: string;
  userName: string;
  role: UserRole;
  action: string;
  entity: string;
  details: string;
}

export type ActiveNavTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'customers'
  | 'messages'
  | 'analytics'
  | 'automations'
  | 'cashier'
  | 'reports'
  | 'settings'
  | 'supabase';
