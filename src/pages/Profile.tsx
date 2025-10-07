import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { BottomNav } from '@/components/BottomNav';
import { User as UserIcon, Calendar, Droplet, RotateCcw } from 'lucide-react';
import { products } from '@/data/productData';

const Profile = () => {
  const { userData, getCurrentDay, updateUserData } = useUser();
  const navigate = useNavigate();

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
            <div className="flex items-center gap-3">
              <Droplet className="h-6 w-6 text-primary" />
              <CardTitle className="font-heading text-2xl">My Products</CardTitle>
            </div>
            <CardDescription>
              {userData.ownedProducts.length} product{userData.ownedProducts.length !== 1 ? 's' : ''} in your collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userData.ownedProducts.length > 0 ? (
              <ul className="space-y-2">
                {userData.ownedProducts.map((productId) => {
                  const product = products.find((p) => p.id === productId);
                  return (
                    <li key={productId} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-base">{product?.name || productId}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No products in your collection yet.</p>
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

      <BottomNav />
    </div>
  );
};

export default Profile;
