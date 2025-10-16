import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, Gift, DollarSign, ShoppingBag, Brain, Target, Crown, Users, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { BottomNav } from '@/components/BottomNav';

interface TreasuryItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  priceLP?: number;
  category: 'essentials' | 'wellness' | 'dream' | 'legacy';
  imagePlaceholder: string;
  detailDescription: string;
}

const treasuryItems: TreasuryItem[] = [
  // CATEGORY A: The Essentials
  {
    id: 'convert-credit',
    title: 'Your Products, Your Way',
    description: 'Convert LP to credit for any Spring Sisters product',
    price: '100 LP = $1',
    category: 'essentials',
    imagePlaceholder: '🛍️',
    detailDescription: 'Convert your Legacy Points directly into credit to use on any Spring Sisters product. Your loyalty, your choice.\n\nExchange Rate: 100 LP = $1'
  },
  {
    id: 'share-legacy',
    title: 'Share Your Legacy',
    description: 'Gift Legacy Points to members of your Sisterhood Pod',
    price: 'Any Amount',
    category: 'essentials',
    imagePlaceholder: '💝',
    detailDescription: 'The greatest gift is support. You can gift your Legacy Points to any member of your Sisterhood Pod directly from their profile.\n\nSpread the love. Build each other up. This is the power of sisterhood.'
  },
  {
    id: 'silk-robe',
    title: 'The Alchemist\'s Robe',
    description: 'Limited edition silk robe - Exclusive to our community',
    priceLP: 20000,
    category: 'essentials',
    imagePlaceholder: '👘',
    detailDescription: 'Exclusively for our community. This limited edition silk robe cannot be bought with money, only earned through your legacy.\n\nCrafted from the finest mulberry silk with our signature embroidered logo, this is the ultimate badge of dedication.'
  },
  // CATEGORY B: Wellness & Mind
  {
    id: 'meditation',
    title: '3-Month Calm Subscription',
    description: 'Guided meditations, sleep stories, and mindfulness',
    priceLP: 4000,
    category: 'wellness',
    imagePlaceholder: '🧘‍♀️',
    detailDescription: 'Invest in your mental well-being. Unlock three months of guided meditations, sleep stories, and mindfulness exercises.\n\nPartner: Calm or similar premium meditation platform.\n\nYour inner peace is just as important as your outer glow.'
  },
  {
    id: 'yoga',
    title: '1-Year Online Yoga Membership',
    description: 'Access to world-class yoga and fitness instructors',
    priceLP: 15000,
    category: 'wellness',
    imagePlaceholder: '🕉️',
    detailDescription: 'Bring harmony to your body and mind with a full year of access to world-class yoga and fitness instructors.\n\nPartner: Glo, Alo Moves, or similar premium platform.\n\nFlow through your practice, guided by the best.'
  },
  {
    id: 'fitness',
    title: '1-Year Premium Fitness Membership',
    description: 'Full access to partner premium fitness clubs',
    priceLP: 75000,
    category: 'wellness',
    imagePlaceholder: '💪',
    detailDescription: 'Invest in your strength and vitality. A full year of access to our partner premium fitness clubs in your city.\n\nPartner with top-tier fitness facilities nationwide.\n\nYour body is your temple. Honor it with movement.'
  },
  {
    id: 'wellness-concierge',
    title: 'Wellness Concierge Credit',
    description: 'Credit for beauty and wellness services',
    priceLP: 10000,
    category: 'wellness',
    imagePlaceholder: '📅',
    detailDescription: 'Your personal credit for beauty and wellness. Redeemable for a consultation with a top cosmetologist or a spa treatment with our certified partners.\n\nExpert care, personalized for you.\n\nBecause you deserve professional support on your journey.'
  },
  // CATEGORY C: The Dream
  {
    id: 'massage-chair',
    title: 'The Sanctuary: Your Personal Massage Chair',
    description: 'State-of-the-art Yamaguchi massage chair',
    priceLP: 500000,
    category: 'dream',
    imagePlaceholder: '💺',
    detailDescription: 'The ultimate reward for your dedication. A state-of-the-art Yamaguchi massage chair, delivered to your home.\n\nFeaturing zero-gravity positioning, full-body air massage, heating therapy, and customizable programs.\n\nThis is not just relaxation. This is your sanctuary.'
  },
  {
    id: 'retreat',
    title: 'The Annual Sisterhood Retreat',
    description: 'Top 10 annual earners only',
    price: 'Top 10 Annual Earners',
    category: 'dream',
    imagePlaceholder: '🏝️',
    detailDescription: 'This isn\'t a reward you can buy. It\'s an honor you earn.\n\nThe top 10 Legacy Point earners each year are invited on a 3-day all-inclusive wellness retreat.\n\nLuxury accommodations, spa treatments, expert-led workshops, and the chance to connect deeply with your sisters.\n\nThis is the pinnacle of dedication.'
  }
];

const LegacyTreasury = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<TreasuryItem | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [donationAmount, setDonationAmount] = useState([1250]);

  const userBalance = 1250; // Static demo balance

  const handleItemClick = (item: TreasuryItem) => {
    setSelectedItem(item);
  };

  const handleRedeem = () => {
    // Special handling for "convert-credit" - redirect to products
    if (selectedItem?.id === 'convert-credit') {
      setSelectedItem(null);
      navigate('/products');
      return;
    }
    
    // Special handling for "share-legacy" - redirect to pod chat
    if (selectedItem?.id === 'share-legacy') {
      setSelectedItem(null);
      navigate('/pod-chat');
      return;
    }
    
    setSelectedItem(null);
    setShowComingSoon(true);
  };

  const handleDonate = () => {
    setShowComingSoon(true);
  };

  const donationDollars = (donationAmount[0] / 100).toFixed(2);

  const categories = [
    {
      id: 'essentials',
      title: 'The Essentials',
      subtitle: 'Products & Merch',
      icon: ShoppingBag,
      items: treasuryItems.filter(item => item.category === 'essentials')
    },
    {
      id: 'wellness',
      title: 'Wellness & Mind',
      subtitle: 'Experiences',
      icon: Brain,
      items: treasuryItems.filter(item => item.category === 'wellness')
    },
    {
      id: 'dream',
      title: 'The Dream',
      subtitle: 'Aspirational Rewards',
      icon: Crown,
      items: treasuryItems.filter(item => item.category === 'dream')
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/sisterhood')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-heading font-semibold">The Legacy Treasury</h1>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Your Legacy</p>
              </div>
              <p className="text-5xl font-heading font-bold text-primary">{userBalance.toLocaleString()} LP</p>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        {categories.map((category) => (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <category.icon className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-heading font-semibold">{category.title}</h2>
                <p className="text-sm text-muted-foreground">{category.subtitle}</p>
              </div>
            </div>

            <div className="space-y-3">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="w-full text-left"
                >
                  <Card className="shadow-md hover:shadow-lg transition-all hover:border-primary/40">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{item.imagePlaceholder}</div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="text-sm font-bold text-primary">
                            {item.priceLP ? `${item.priceLP.toLocaleString()} LP` : item.price}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* The Legacy Fund - Special Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-heading font-semibold">The Legacy Fund</h2>
              <p className="text-sm text-muted-foreground">Altruism</p>
            </div>
          </div>

          <Card className="shadow-lg border-primary/30 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Transform Your Legacy into a Better World</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your dedication to yourself can now become a gift to others. Convert your Legacy Points into a direct donation to our trusted partners in women's health.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">{donationAmount[0]} LP</span>
                    <span className="text-sm font-bold text-primary">${donationDollars}</span>
                  </div>
                  <Slider
                    value={donationAmount}
                    onValueChange={setDonationAmount}
                    max={userBalance}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-center gap-4 py-3">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-2">
                      🎀
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Breast Cancer Research</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-2">
                      💜
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">The Loveland Foundation</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-2">
                      🌍
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Women for Women Intl</p>
                  </div>
                </div>

                <Button
                  onClick={handleDonate}
                  className="w-full rounded-full"
                  variant="default"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Donate Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="text-6xl text-center mb-4">{selectedItem?.imagePlaceholder}</div>
            <DialogTitle className="text-2xl font-heading text-center">{selectedItem?.title}</DialogTitle>
            <DialogDescription className="text-center text-lg font-semibold text-primary">
              {selectedItem?.priceLP ? `${selectedItem.priceLP.toLocaleString()} LP` : selectedItem?.price}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {selectedItem?.detailDescription}
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={handleRedeem}
              className="w-full rounded-full"
              variant="default"
            >
              <Gift className="h-4 w-4 mr-2" />
              Redeem
            </Button>
            <Button
              onClick={() => setSelectedItem(null)}
              className="w-full rounded-full"
              variant="outline"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coming Soon Modal */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="text-6xl text-center mb-4">✨</div>
            <DialogTitle className="text-2xl font-heading text-center">Coming Soon!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground leading-relaxed">
              This feature is coming soon! Thank you for being a part of building our future.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowComingSoon(false)}
              className="w-full rounded-full"
              variant="default"
            >
              Got It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default LegacyTreasury;