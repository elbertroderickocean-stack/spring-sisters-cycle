import { useState, useEffect } from 'react';
import { products } from '@/data/productData';

const STORAGE_KEY = 'product_tracking';

export interface TrackedProduct {
  productId: string;
  startDate: string;
  lifespanDays: number;
}

export const useProductTracking = () => {
  const [trackedProducts, setTrackedProducts] = useState<TrackedProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTrackedProducts(JSON.parse(stored));
    }
  }, []);

  const startTracking = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.lifespanDays) return;

    const newTracking: TrackedProduct = {
      productId,
      startDate: new Date().toISOString(),
      lifespanDays: product.lifespanDays,
    };

    const updated = [...trackedProducts.filter((t) => t.productId !== productId), newTracking];
    setTrackedProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isTracking = (productId: string): boolean => {
    return trackedProducts.some((t) => t.productId === productId);
  };

  const getDaysUntilRunOut = (productId: string): number | null => {
    const tracked = trackedProducts.find((t) => t.productId === productId);
    if (!tracked) return null;

    const startDate = new Date(tracked.startDate);
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = tracked.lifespanDays - daysPassed;

    return daysRemaining;
  };

  const getProductsNeedingReorder = (): Array<{ productId: string; productName: string; daysLeft: number }> => {
    const needingReorder: Array<{ productId: string; productName: string; daysLeft: number }> = [];

    trackedProducts.forEach((tracked) => {
      const daysLeft = getDaysUntilRunOut(tracked.productId);
      if (daysLeft !== null && daysLeft <= 7 && daysLeft >= 0) {
        const product = products.find((p) => p.id === tracked.productId);
        if (product) {
          needingReorder.push({
            productId: tracked.productId,
            productName: product.name,
            daysLeft,
          });
        }
      }
    });

    return needingReorder;
  };

  return {
    startTracking,
    isTracking,
    getDaysUntilRunOut,
    getProductsNeedingReorder,
  };
};
