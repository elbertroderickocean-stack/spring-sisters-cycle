import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PhaseType = 'calm' | 'glow' | 'balance';

export interface ScannedProduct {
  name: string;
  brand: string;
  analysis: string;
}

export interface UserData {
  name: string;
  email: string;
  lastPeriodDate: Date | null;
  cycleLength: number;
  ageRange: string;
  skinType: string;
  skinConcerns: string[];
  ownedProducts: string[];
  scannedProducts: ScannedProduct[];
  isDemoMode: boolean;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  getCurrentPhase: () => PhaseType;
  getCurrentDay: () => number;
  addScannedProduct: (product: ScannedProduct) => void;
  enableDemoMode: () => void;
  exitDemoMode: () => void;
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

  return (
    <UserContext.Provider value={{ 
      userData, 
      updateUserData, 
      getCurrentPhase, 
      getCurrentDay, 
      addScannedProduct,
      enableDemoMode,
      exitDemoMode
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
