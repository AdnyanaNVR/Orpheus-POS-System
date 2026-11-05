import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  StoreProfile,
  UserProfile,
  CartItem,
  Order,
  CashierShift,
  AuditLog,
  PaymentMethod,
  ActiveNavTab,
  SplitPaymentDetail,
  StockMovement,
} from '../types/pos';
import {
  initialStoreProfile,
  initialUsers,
  initialCategories,
  initialProducts,
  initialOrders,
  initialActiveShift,
  initialAuditLogs,
} from './initialData';

interface PosContextType {
  // Navigation
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;

  // Active User & Auth
  currentUser: UserProfile;
  switchUser: (role: 'owner' | 'admin' | 'cashier') => void;
  users: UserProfile[];

  // Store Profile & Settings
  storeProfile: StoreProfile;
  updateStoreProfile: (updates: Partial<StoreProfile>) => void;

  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, changeQty: number, type: 'restock' | 'adjustment' | 'damaged' | 'return', reason: string) => void;
  addCategory: (name: string, color: string, icon: string) => void;
  stockMovements: StockMovement[];

  // Cart & Cashier
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartItemDiscount: (productId: string, discountAmount: number) => void;
  updateCartItemNotes: (productId: string, notes: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartDiscount: number; // nominal transaction discount
  setCartDiscount: (amount: number) => void;
  cartDiscountPercent: number;
  setCartDiscountPercent: (percent: number) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  cartSubtotal: number;
  cartTax: number;
  cartServiceCharge: number;
  cartGrandTotal: number;

  // Checkout & Orders
  orders: Order[];
  processCheckout: (
    paymentMethod: PaymentMethod,
    tenderAmount: number,
    splitDetails?: SplitPaymentDetail,
    notes?: string
  ) => Order;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;

  // Shifts
  currentShift: CashierShift | null;
  openShift: (initialCash: number, notes?: string) => void;
  closeShift: (actualCash: number, notes?: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAction: (action: string, entity: string, details: string) => void;

  // Receipt Modal trigger
  selectedReceiptOrder: Order | null;
  openReceiptModal: (order: Order) => void;
  closeReceiptModal: () => void;

  // Backup & Restore
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  resetToSampleData: () => void;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export const PosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys
  const STORAGE_KEY = 'corbel_pos_state_v1';

  // Load from local storage or defaults
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_store`);
      return saved ? JSON.parse(saved) : initialStoreProfile;
    } catch {
      return initialStoreProfile;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [users] = useState<UserProfile[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUsers[2]); // Default cashier Budi

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [currentShift, setCurrentShift] = useState<CashierShift | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_shift`);
      return saved ? JSON.parse(saved) : initialActiveShift;
    } catch {
      return initialActiveShift;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
      return saved ? JSON.parse(saved) : initialAuditLogs;
    } catch {
      return initialAuditLogs;
    }
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDiscount, setCartDiscount] = useState<number>(0);
  const [cartDiscountPercent, setCartDiscountPercent] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>('Pelanggan Umum');

  // Modal receipt
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_store`, JSON.stringify(storeProfile));
      localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
      localStorage.setItem(`${STORAGE_KEY}_shift`, JSON.stringify(currentShift));
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [storeProfile, categories, products, orders, currentShift, auditLogs]);

  // Role Switcher
  const switchUser = (role: 'owner' | 'admin' | 'cashier') => {
    const target = users.find((u) => u.role === role) || users[0];
    setCurrentUser(target);
    logAction('Ganti Pengguna Aktif', 'Auth', `Masuk sebagai ${target.name} (${target.role.toUpperCase()})`);
  };

  // Audit Logging
  const logAction = (action: string, entity: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString(),
      userName: currentUser.name,
      role: currentUser.role,
      action,
      entity,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Store Profile Update
  const updateStoreProfile = (updates: Partial<StoreProfile>) => {
    setStoreProfile((prev) => ({ ...prev, ...updates }));
    logAction('Ubah Profil Toko', 'Pengaturan', 'Memperbarui profil atau parameter perpajakan toko');
  };

  // Products CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = { ...prodData, id: newId };
    setProducts((prev) => [newProduct, ...prev]);
    logAction('Tambah Produk Baru', 'Produk', `Menambahkan ${newProduct.name} (${newProduct.sku})`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          return updated;
        }
        return p;
      })
    );
    logAction('Update Produk', 'Produk', `Memperbarui data produk ID ${id}`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logAction('Hapus Produk', 'Produk', `Menghapus produk ${target?.name || id}`);
  };

  const adjustStock = (productId: string, changeQty: number, type: 'restock' | 'adjustment' | 'damaged' | 'return', reason: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const prevStock = p.stock;
          const newStock = Math.max(0, prevStock + changeQty);
          // log movement
          const movement: StockMovement = {
            id: `mov-${Date.now()}`,
            productId,
            productName: p.name,
            type,
            quantityChange: changeQty,
            previousStock: prevStock,
            currentStock: newStock,
            reason,
            date: new Date().toISOString(),
            userName: currentUser.name,
          };
          setStockMovements((m) => [movement, ...m]);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
    logAction('Penyesuaian Stok', 'Stok', `${type.toUpperCase()} produk ID ${productId}: ${changeQty >= 0 ? '+' : ''}${changeQty} (${reason})`);
  };

  const addCategory = (name: string, color: string, icon: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      color,
      icon,
    };
    setCategories((prev) => [...prev, newCat]);
    logAction('Tambah Kategori', 'Kategori', `Kategori baru dibuat: ${name}`);
  };

  // Cart Actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, itemDiscount: 0 }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const updateCartItemDiscount = (productId: string, discountAmount: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, itemDiscount: Math.max(0, discountAmount) } : item
      )
    );
  };

  const updateCartItemNotes = (productId: string, notes: string) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, notes } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
    setCartDiscountPercent(0);
    setCustomerName('Pelanggan Umum');
  };

  // Financial calculations
  const rawSubtotal = cart.reduce((acc, item) => {
    const itemTotal = item.product.sellingPrice * item.quantity - (item.itemDiscount || 0);
    return acc + Math.max(0, itemTotal);
  }, 0);

  const calculatedDiscount = cartDiscountPercent > 0
    ? (rawSubtotal * cartDiscountPercent) / 100
    : cartDiscount;

  const cartSubtotal = Math.max(0, rawSubtotal - calculatedDiscount);

  const cartServiceCharge = storeProfile.serviceChargeEnabled
    ? Math.round((cartSubtotal * storeProfile.serviceChargeRate) / 100)
    : 0;

  const cartTax = storeProfile.taxEnabled
    ? Math.round((cartSubtotal * storeProfile.taxRate) / 100)
    : 0;

  const cartGrandTotal = cartSubtotal + cartServiceCharge + cartTax;

  // Checkout process
  const processCheckout = (
    paymentMethod: PaymentMethod,
    tenderAmount: number,
    splitDetails?: SplitPaymentDetail,
    notes?: string
  ): Order => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randSeq = Math.floor(100 + Math.random() * 900);
    const orderNumber = `INV-${dateStr}-${orders.length + 1}-${randSeq}`;

    const changeAmount = paymentMethod === 'cash' ? Math.max(0, tenderAmount - cartGrandTotal) : 0;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: now.toISOString(),
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      customerName: customerName || 'Pelanggan Umum',
      items: [...cart],
      subtotal: rawSubtotal,
      discountAmount: calculatedDiscount,
      taxAmount: cartTax,
      serviceCharge: cartServiceCharge,
      grandTotal: cartGrandTotal,
      paymentMethod,
      tenderAmount: tenderAmount || cartGrandTotal,
      changeAmount,
      paymentStatus: 'paid',
      orderStatus: 'completed',
      splitDetails,
      notes,
    };

    // Deduct stock for each cart item
    setProducts((prev) =>
      prev.map((prod) => {
        const itemInCart = cart.find((c) => c.product.id === prod.id);
        if (itemInCart) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - itemInCart.quantity),
          };
        }
        return prod;
      })
    );

    // Update shift metrics
    if (currentShift && currentShift.status === 'open') {
      const isCash = paymentMethod === 'cash';
      const cashPortion = isCash ? cartGrandTotal : (splitDetails?.cashAmount || 0);
      const nonCashPortion = !isCash && paymentMethod !== 'split' ? cartGrandTotal : (splitDetails?.nonCashAmount || 0);

      setCurrentShift((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          totalSalesCash: prev.totalSalesCash + cashPortion,
          totalSalesNonCash: prev.totalSalesNonCash + nonCashPortion,
          expectedCash: prev.expectedCash + cashPortion,
          totalTransactions: prev.totalTransactions + 1,
        };
      });
    }

    // Add to orders list
    setOrders((prev) => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);

    logAction(
      'Transaksi Berhasil',
      'Penjualan',
      `${orderNumber} Total: Rp ${cartGrandTotal.toLocaleString('id-ID')} (${paymentMethod.toUpperCase()})`
    );

    clearCart();
    return newOrder;
  };

  // Shift Management
  const openShift = (initialCash: number, notes?: string) => {
    const newShift: CashierShift = {
      id: `shift-${Date.now()}`,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      openedAt: new Date().toISOString(),
      initialCash,
      expectedCash: initialCash,
      totalSalesCash: 0,
      totalSalesNonCash: 0,
      totalTransactions: 0,
      status: 'open',
      notes: notes || 'Shift Kasir Dimulai',
    };
    setCurrentShift(newShift);
    logAction('Buka Shift Kasir', 'Shift', `Modal kasir awal: Rp ${initialCash.toLocaleString('id-ID')}`);
  };

  const closeShift = (actualCash: number, notes?: string) => {
    if (!currentShift) return;
    const expected = currentShift.expectedCash;
    const diff = actualCash - expected;

    const closed: CashierShift = {
      ...currentShift,
      closedAt: new Date().toISOString(),
      actualCash,
      cashDifference: diff,
      status: 'closed',
      notes: notes || currentShift.notes,
    };
    setCurrentShift(closed);
    logAction(
      'Tutup Shift Kasir',
      'Shift',
      `Kas Dihitung: Rp ${actualCash.toLocaleString('id-ID')}, Selisih: Rp ${diff.toLocaleString('id-ID')}`
    );
  };

  // Receipt Modal
  const openReceiptModal = (order: Order) => {
    setSelectedReceiptOrder(order);
  };
  const closeReceiptModal = () => {
    setSelectedReceiptOrder(null);
  };

  // Backup & Restore
  const exportDataJSON = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      storeProfile,
      categories,
      products,
      orders,
      currentShift,
      auditLogs,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `corbel-pos-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    logAction('Backup Data', 'Sistem', 'Ekspor cadangan database JSON');
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.storeProfile) setStoreProfile(data.storeProfile);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.orders)) setOrders(data.orders);
      if (data.currentShift) setCurrentShift(data.currentShift);
      if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
      logAction('Restore Data', 'Sistem', 'Memulihkan data dari cadangan JSON');
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetToSampleData = () => {
    setStoreProfile(initialStoreProfile);
    setCategories(initialCategories);
    setProducts(initialProducts);
    setOrders(initialOrders);
    setCurrentShift(initialActiveShift);
    setAuditLogs(initialAuditLogs);
    setCart([]);
    logAction('Reset Database', 'Sistem', 'Mengembalikan seluruh data ke sampel awal');
  };

  return (
    <PosContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        switchUser,
        users,
        storeProfile,
        updateStoreProfile,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addCategory,
        stockMovements,
        cart,
        addToCart,
        updateCartQuantity,
        updateCartItemDiscount,
        updateCartItemNotes,
        removeFromCart,
        clearCart,
        cartDiscount,
        setCartDiscount,
        cartDiscountPercent,
        setCartDiscountPercent,
        customerName,
        setCustomerName,
        cartSubtotal,
        cartTax,
        cartServiceCharge,
        cartGrandTotal,
        orders,
        processCheckout,
        lastCompletedOrder,
        setLastCompletedOrder,
        currentShift,
        openShift,
        closeShift,
        auditLogs,
        logAction,
        selectedReceiptOrder,
        openReceiptModal,
        closeReceiptModal,
        exportDataJSON,
        importDataJSON,
        resetToSampleData,
      }}
    >
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePos must be used within a PosProvider');
  }
  return context;
};
