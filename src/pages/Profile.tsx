import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { BottomNav } from '@/components/BottomNav';
import { User as UserIcon, Calendar, Droplet, RotateCcw, Plus, Minus, Trash2 } from 'lucide-react';
import { products } from '@/data/productData';

const Profile = () => {
  const { 
    userData, 
    getCurrentDay, 
    updateUserData, 
    addProductToInventory, 
    updateProductQuantity, 
    removeProductFromInventory, 
    getProductQuantity 
  } = useUser();
  const navigate = useNavigate();
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

  const handleStartOver = () => {
    // Reset all user data
    updateUserData({
      name: '',
      email: '',
      lastPeriodDate: null,
      cycleLength: 28,
      ageRange: '',
      skinType: '',
      ownedProducts: [],
      productInventory: [],
    });
    // Navigate back to splash screen
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-4xl font-heading font-semibold text-primary animate-fade-in">
          Profile
        </h1>

        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserIcon className="h-6 w-6 text-primary" />
              <CardTitle className="font-heading text-2xl">Personal Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-base font-medium">{userData.name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-base font-medium">{userData.email || 'Not set'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" />
              <CardTitle className="font-heading text-2xl">Cycle Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Cycle Day</p>
              <p className="text-base font-medium">Day {getCurrentDay()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cycle Length</p>
              <p className="text-base font-medium">{userData.cycleLength} days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age Range</p>
              <p className="text-base font-medium">{userData.ageRange || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Skin Type</p>
              <p className="text-base font-medium">{userData.skinType || 'Not set'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Droplet className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="font-heading text-2xl">My Products</CardTitle>
                  <CardDescription>
                    {ownedProducts.length} product{ownedProducts.length !== 1 ? 's' : ''} in your collection
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ownedProducts.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="text-4xl opacity-20">🧴</div>
                <p className="text-sm text-muted-foreground">No products in your collection yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {ownedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate">{product.name}</h4>
                      <p className="text-xs text-foreground/60">{product.price}</p>
                    </div>
                    {product.quantity > 1 && (
                      <Badge variant="secondary" className="text-xs">
                        x{product.quantity}
                      </Badge>
                    )}
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">
                        {product.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeProductFromInventory(product.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="animate-slide-up border-destructive/50" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-6 w-6 text-destructive" />
              <CardTitle className="font-heading text-2xl">Reset Application</CardTitle>
            </div>
            <CardDescription>
              Start fresh and go through the onboarding process again
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleStartOver}
              variant="destructive"
              className="w-full"
            >
              Start Over / Reset
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">Add Product to My Products</DialogTitle>
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
                          Add to My Products
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

export default Profile;
