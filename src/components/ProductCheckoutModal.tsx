import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface ProductCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productPrice: number;
  userBalance: number;
}

const ProductCheckoutModal: React.FC<ProductCheckoutModalProps> = ({
  isOpen,
  onClose,
  productName,
  productPrice,
  userBalance,
}) => {
  const [applyLP, setApplyLP] = useState(false);
  const [lpAmount, setLpAmount] = useState([0]);

  const maxLPApplicable = Math.min(userBalance, productPrice * 100);
  const lpDiscount = applyLP ? lpAmount[0] / 100 : 0;
  const finalPrice = Math.max(0, productPrice - lpDiscount);

  const handleConfirm = () => {
    // Show coming soon message
    alert('This feature is coming soon! Thank you for being a part of building our future.');
    onClose();
  };

  const handleToggleLP = (checked: boolean) => {
    setApplyLP(checked);
    if (checked && lpAmount[0] === 0) {
      setLpAmount([Math.min(1000, maxLPApplicable)]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">Checkout</DialogTitle>
          <DialogDescription className="text-base">
            {productName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Original Price */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Product Price</span>
            <span className="text-lg font-semibold">${productPrice.toFixed(2)}</span>
          </div>

          {/* Legacy Points Toggle */}
          <div className="space-y-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <Label htmlFor="apply-lp" className="font-semibold">Apply Legacy Points</Label>
              </div>
              <Switch
                id="apply-lp"
                checked={applyLP}
                onCheckedChange={handleToggleLP}
              />
            </div>

            {applyLP && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available: {userBalance.toLocaleString()} LP</span>
                  <span className="font-semibold text-primary">
                    {lpAmount[0].toLocaleString()} LP = ${(lpAmount[0] / 100).toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={lpAmount}
                  onValueChange={setLpAmount}
                  max={maxLPApplicable}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  100 LP = $1.00
                </p>
              </div>
            )}
          </div>

          {/* LP Discount */}
          {applyLP && lpDiscount > 0 && (
            <div className="flex justify-between items-center text-primary">
              <span className="text-sm font-medium">LP Discount</span>
              <span className="text-lg font-semibold">-${lpDiscount.toFixed(2)}</span>
            </div>
          )}

          {/* Final Total */}
          <div className="pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Due</span>
              <span className="text-2xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={handleConfirm}
            className="w-full rounded-full"
            size="lg"
          >
            Confirm Purchase
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full rounded-full"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCheckoutModal;
