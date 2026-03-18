import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Hexagon } from 'lucide-react';

interface ProductCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productPrice: number;
  userBalance: number;
}

const ProductCheckoutModal: React.FC<ProductCheckoutModalProps> = ({ isOpen, onClose, productName, productPrice, userBalance }) => {
  const [applyAC, setApplyAC] = useState(false);
  const [acAmount, setAcAmount] = useState([0]);

  const maxACApplicable = Math.min(userBalance, productPrice * 100);
  const acDiscount = applyAC ? acAmount[0] / 100 : 0;
  const finalPrice = Math.max(0, productPrice - acDiscount);

  const handleConfirm = () => {
    alert('This feature is coming soon! Thank you for being a part of building our future.');
    onClose();
  };

  const handleToggleAC = (checked: boolean) => {
    setApplyAC(checked);
    if (checked && acAmount[0] === 0) setAcAmount([Math.min(1000, maxACApplicable)]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">Checkout</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Product Price</span>
            <span className="text-lg font-mono-data font-semibold">${productPrice.toFixed(2)}</span>
          </div>
          <div className="space-y-4 p-4 rounded-[12px] bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hexagon className="h-5 w-5 text-primary" />
                <Label htmlFor="apply-ac" className="text-sm font-semibold">Apply Asset Credits</Label>
              </div>
              <Switch id="apply-ac" checked={applyAC} onCheckedChange={handleToggleAC} />
            </div>
            {applyAC && (
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Available: {userBalance.toLocaleString()} AC</span>
                  <span className="font-mono-data font-semibold text-primary">{acAmount[0].toLocaleString()} AC = ${(acAmount[0] / 100).toFixed(2)}</span>
                </div>
                <Slider value={acAmount} onValueChange={setAcAmount} max={maxACApplicable} min={0} step={100} />
                <p className="text-xs text-muted-foreground">100 AC = $1.00</p>
              </div>
            )}
          </div>
          {applyAC && acDiscount > 0 && (
            <div className="flex justify-between items-center text-primary">
              <span className="text-sm font-medium">AC Discount</span>
              <span className="text-lg font-mono-data font-semibold">-${acDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold">Total Due</span>
              <span className="text-2xl font-mono-data font-bold text-primary">${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button onClick={handleConfirm} className="w-full rounded-full" size="lg">Confirm Purchase</Button>
          <Button onClick={onClose} variant="outline" className="w-full rounded-full">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCheckoutModal;
