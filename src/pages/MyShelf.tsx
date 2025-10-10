import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { products } from '@/data/productData';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';

const MyShelf = () => {
  const { userData, addProductToInventory, updateProductQuantity, removeProductFromInventory, getProductQuantity } = useUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const ownedProducts = userData.productInventory.map(item => ({
    ...products.find(p => p.id === item.productId)!,
    quantity: item.quantity
  })).filter(p => p);

  const availableProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    if (selectedProductId) {
      addProductToInventory(selectedProductId, quantity);
      setIsAddDialogOpen(false);
      setSelectedProductId(null);
      setQuantity(1);
      setSearchQuery('');
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-semibold text-primary">My Shelf</h1>
              <p className="text-foreground/70 mt-1">Your personal Spring Sisters collection</p>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="rounded-full"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </div>

          {ownedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="text-6xl opacity-20">🧴</div>
              <p className="text-foreground/60">Your shelf is empty</p>
              <p className="text-sm text-foreground/40">Add products to track your inventory</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ownedProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative border border-border rounded-2xl overflow-hidden bg-card hover:shadow-lg transition-all"
                >
                  {product.quantity > 1 && (
                    <Badge className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground">
                      x{product.quantity}
                    </Badge>
                  )}
                  <div className="aspect-square overflow-hidden bg-accent/20">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm text-foreground/60 mt-1">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-medium w-8 text-center">
                          {product.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeProductFromInventory(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">Add Product to My Shelf</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            {!selectedProductId ? (
              <div className="space-y-3">
                {availableProducts.map((product) => {
                  const currentQty = getProductQuantity(product.id);
                  return (
                    <div
                      key={product.id}
                      className="flex items-center space-x-4 p-4 border border-border rounded-xl hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => handleSelectProduct(product.id)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{product.name}</h4>
                        <p className="text-sm text-foreground/60">{product.price}</p>
                        {currentQty > 0 && (
                          <p className="text-xs text-primary mt-1">Currently owned: {currentQty}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const product = products.find(p => p.id === selectedProductId);
                  return product ? (
                    <>
                      <div className="flex items-start space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-heading font-semibold text-lg">{product.name}</h4>
                          <p className="text-sm text-foreground/60 mt-1">{product.description}</p>
                          <p className="text-primary font-medium mt-2">{product.price}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Quantity</label>
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setSelectedProductId(null);
                            setQuantity(1);
                          }}
                        >
                          Back
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={handleAddProduct}
                        >
                          Add to Shelf
                        </Button>
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default MyShelf;
