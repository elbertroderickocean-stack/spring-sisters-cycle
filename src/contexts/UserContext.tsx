import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PhaseType = 'calm' | 'glow' | 'balance';

export interface ScannedProduct {
  name: string;
  brand: string;
  analysis: string;
}

export interface ProductInventory {
  productId: string;
  quantity: number;
}

export interface UserData {
  name: string;
  email: string;
  lastPeriodDate: Date | null;
  cycleLength: number;
  ageRange: string;
  skinType: string;
  skinConcerns: string[];
  ownedProducts: string[]; // Legacy - kept for backward compatibility
  productInventory: ProductInventory[]; // New inventory with quantities
  scannedProducts: ScannedProduct[];
  isDemoMode: boolean;
  checkIn?: {
    energy: string;
    skin: string;
    date: string;
  };
  customRituals?: {
    morning: string[];
    evening: string[];
    auraNote?: string;
  };
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  getCurrentPhase: () => PhaseType;
  getCurrentDay: () => number;
  addScannedProduct: (product: ScannedProduct) => void;
  enableDemoMode: () => void;
  exitDemoMode: () => void;
  updateCheckIn: (energy: string, skin: string) => void;
  needsCheckIn: () => boolean;
  addProductToInventory: (productId: string, quantity: number) => void;
  removeProductFromInventory: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  getProductQuantity: (productId: string) => number;
  isProductOwned: (productId: string) => boolean;
  updateCustomRituals: (morning: string[], evening: string[], auraNote?: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUserData: UserData = {
  name: '',
  email: '',
  lastPeriodDate: null,
  cycleLength: 28,
  ageRange: '',
  skinType: '',
  skinConcerns: [],
  ownedProducts: [],
  productInventory: [],
  scannedProducts: [],
  isDemoMode: false,
};

const demoUserData: UserData = {
  name: 'Kate',
  email: 'kate@demo.com',
  lastPeriodDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  cycleLength: 28,
  ageRange: '25-34',
  skinType: 'combination',
  skinConcerns: ['Dark Spots & Uneven Tone', 'Fine Lines & Wrinkles'],
  ownedProducts: ['serum-trio', 'cleanser'],
  productInventory: [
    { productId: 'serum-trio', quantity: 1 },
    { productId: 'cleanser', quantity: 2 }
  ],
  scannedProducts: [],
  isDemoMode: true,
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const addScannedProduct = (product: ScannedProduct) => {
    setUserData((prev) => ({
      ...prev,
      scannedProducts: [...prev.scannedProducts, product],
    }));
  };

  const getCurrentDay = (): number => {
    if (!userData.lastPeriodDate) return 1;
    
    const today = new Date();
    const lastPeriod = new Date(userData.lastPeriodDate);
    const diffTime = Math.abs(today.getTime() - lastPeriod.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return (diffDays % userData.cycleLength) || userData.cycleLength;
  };

  const getCurrentPhase = (): PhaseType => {
    const day = getCurrentDay();
    const cycleLength = userData.cycleLength;
    
    // Phase 1 (Calm & Renew): Days 1-7
    if (day <= 7) return 'calm';
    
    // Phase 2 (Glow & Energize): Days 8-14 (follicular/ovulation)
    if (day <= Math.floor(cycleLength / 2)) return 'glow';
    
    // Phase 3 (Balance & Clarify): Days 15+ (luteal)
    return 'balance';
  };

  const enableDemoMode = () => {
    setUserData(demoUserData);
  };

  const exitDemoMode = () => {
    setUserData(defaultUserData);
  };

  const updateCheckIn = (energy: string, skin: string) => {
    const today = new Date().toISOString().split('T')[0];
    updateUserData({
      checkIn: {
        energy,
        skin,
        date: today
      }
    });
  };

  const needsCheckIn = () => {
    if (!userData.checkIn) return true;
    const today = new Date().toISOString().split('T')[0];
    return userData.checkIn.date !== today;
  };

  const addProductToInventory = (productId: string, quantity: number) => {
    setUserData((prev) => {
      const existing = prev.productInventory.find(p => p.productId === productId);
      if (existing) {
        return {
          ...prev,
          productInventory: prev.productInventory.map(p =>
            p.productId === productId ? { ...p, quantity: p.quantity + quantity } : p
          ),
          ownedProducts: Array.from(new Set([...prev.ownedProducts, productId]))
        };
      }
      return {
        ...prev,
        productInventory: [...prev.productInventory, { productId, quantity }],
        ownedProducts: Array.from(new Set([...prev.ownedProducts, productId]))
      };
    });
  };

  const removeProductFromInventory = (productId: string) => {
    setUserData((prev) => ({
      ...prev,
      productInventory: prev.productInventory.filter(p => p.productId !== productId),
      ownedProducts: prev.ownedProducts.filter(id => id !== productId)
    }));
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromInventory(productId);
      return;
    }
    setUserData((prev) => ({
      ...prev,
      productInventory: prev.productInventory.map(p =>
        p.productId === productId ? { ...p, quantity } : p
      )
    }));
  };

  const getProductQuantity = (productId: string): number => {
    const item = userData.productInventory.find(p => p.productId === productId);
    return item?.quantity || 0;
  };

  const isProductOwned = (productId: string): boolean => {
    return userData.productInventory.some(p => p.productId === productId);
  };

  const updateCustomRituals = (morning: string[], evening: string[], auraNote?: string) => {
    updateUserData({
      customRituals: {
        morning,
        evening,
        auraNote
      }
    });
  };

  return (
    <UserContext.Provider value={{ 
      userData, 
      updateUserData, 
      getCurrentPhase, 
      getCurrentDay, 
      addScannedProduct,
      enableDemoMode,
      exitDemoMode,
      updateCheckIn,
      needsCheckIn,
      addProductToInventory,
      removeProductFromInventory,
      updateProductQuantity,
      getProductQuantity,
      isProductOwned,
      updateCustomRituals
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
