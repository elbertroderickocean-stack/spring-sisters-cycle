import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Gift, ShoppingBag, Brain, Crown, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { BottomNav } from '@/components/BottomNav';

interface TreasuryItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  priceAC?: number;
  category: 'essentials' | 'wellness' | 'dream' | 'legacy';
  imagePlaceholder: string;
  detailDescription: string;
}

const treasuryItems: TreasuryItem[] = [
  {
    id: 'convert-credit',
    title: 'Your Products, Your Way',
    description: 'Convert AC to credit for any meanwhile. product',
    price: '100 AC = $1',
    category: 'essentials',
    imagePlaceholder: '🛍️',
    detailDescription: 'Convert your Asset Credits directly into credit to use on any meanwhile. product. Your contribution, your choice.\n\nExchange Rate: 100 AC = $1'
  },
  {
    id: 'share-credits',
    title: 'Share Your Credits',
    description: 'Gift Asset Credits to members of your Syndicate Unit',
    price: 'Any Amount',
    category: 'essentials',
    imagePlaceholder: '💝',
    detailDescription: 'The greatest gift is support. You can gift your Asset Credits to any member of your Syndicate Unit directly from their profile.\n\nBuild each other up. This is the power of the collective.'
  },
  {
    id: 'silk-robe',
    title: 'The Alchemist\'s Robe',
    description: 'Limited edition silk robe — Exclusive to our community',
    priceAC: 20000,
    category: 'essentials',
    imagePlaceholder: '👘',
    detailDescription: 'Exclusively for our community. This limited edition silk robe cannot be bought with money, only earned through your contribution.\n\nCrafted from the finest mulberry silk with our signature embroidered logo.'
  },
  {
    id: 'meditation',
    title: '3-Month Calm Subscription',
    description: 'Guided meditations, sleep stories, and mindfulness',
    priceAC: 4000,
    category: 'wellness',
    imagePlaceholder: '🧘‍♀️',
    detailDescription: 'Invest in your mental well-being. Unlock three months of guided meditations, sleep stories, and mindfulness exercises.\n\nPartner: Calm or similar premium meditation platform.'
  },
  {
    id: 'yoga',
    title: '1-Year Online Yoga Membership',
    description: 'Access to world-class yoga and fitness instructors',
    priceAC: 15000,
    category: 'wellness',
    imagePlaceholder: '🕉️',
    detailDescription: 'Bring harmony to your body and mind with a full year of access to world-class yoga and fitness instructors.\n\nPartner: Glo, Alo Moves, or similar premium platform.'
  },
  {
    id: 'fitness',
    title: '1-Year Premium Fitness Membership',
    description: 'Full access to partner premium fitness clubs',
    priceAC: 75000,
    category: 'wellness',
    imagePlaceholder: '💪',
    detailDescription: 'Invest in your strength and vitality. A full year of access to our partner premium fitness clubs in your city.'
  },
  {
    id: 'wellness-concierge',
    title: 'Wellness Concierge Credit',
    description: 'Credit for beauty and wellness services',
    priceAC: 10000,
    category: 'wellness',
    imagePlaceholder: '📅',
    detailDescription: 'Your personal credit for beauty and wellness. Redeemable for a consultation with a top cosmetologist or a spa treatment with our certified partners.'
  },
  {
    id: 'massage-chair',
    title: 'The Sanctuary: Your Personal Massage Chair',
    description: 'State-of-the-art Yamaguchi massage chair',
    priceAC: 500000,
    category: 'dream',
    imagePlaceholder: '💺',
    detailDescription: 'The ultimate reward for your dedication. A state-of-the-art Yamaguchi massage chair, delivered to your home.\n\nFeaturing zero-gravity positioning, full-body air massage, heating therapy, and customizable programs.'
  },
  {
    id: 'retreat',
    title: 'The Annual Syndicate Retreat',
    description: 'Top 10 annual earners only',
    price: 'Top 10 Annual Earners',
    category: 'dream',
    imagePlaceholder: '🏝️',
    detailDescription: 'This isn\'t a reward you can buy. It\'s an honor you earn.\n\nThe top 10 Asset Credit earners each year are invited on a 3-day all-inclusive wellness retreat.\n\nLuxury accommodations, spa treatments, expert-led workshops.'
  }
];

const LegacyTreasury = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<TreasuryItem | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [donationAmount, setDonationAmount] = useState([1250]);

  const userBalance = 1250;

  const handleRedeem = () => {
    if (selectedItem?.id === 'convert-credit') {
      setSelectedItem(null);
      navigate('/products');
      return;
    }
    if (selectedItem?.id === 'share-credits') {
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
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/sisterhood')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-heading font-semibold">The Asset Hub</h1>
        </div>

        {/* Balance */}
        <Card className="border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your Asset Credits</p>
              <p className="text-4xl font-mono-data font-bold text-primary">{userBalance.toLocaleString()} AC</p>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        {categories.map((category) => (
          <div key={category.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <category.icon className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-heading font-semibold">{category.title}</h2>
                <p className="text-xs text-muted-foreground">{category.subtitle}</p>
              </div>
            </div>
            <div className="space-y-2">
              {category.items.map((item) => (
                <button key={item.id} onClick={() => setSelectedItem(item)} className="w-full text-left">
                  <Card className="border border-border hover:border-primary/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{item.imagePlaceholder}</div>
                        <div className="flex-1 space-y-1">
                          <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                          <p className="text-xs font-mono-data font-bold text-primary">
                            {item.priceAC ? `${item.priceAC.toLocaleString()} AC` : item.price}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* The meanwhile. Fund */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-heading font-semibold">The meanwhile. Fund</h2>
              <p className="text-xs text-muted-foreground">Longevity Research</p>
            </div>
          </div>
          <Card className="border border-primary/30 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-5 space-y-5">
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">Transform Your Credits into Impact</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Convert your Asset Credits into a direct donation to our trusted partners in longevity research.
                </p>
              </div>
              <div className="p-4 rounded-[12px] bg-background border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-mono-data">{donationAmount[0]} AC</span>
                  <span className="text-sm font-mono-data font-bold text-primary">${donationDollars}</span>
                </div>
                <Slider value={donationAmount} onValueChange={setDonationAmount} max={userBalance} min={100} step={100} />
              </div>
              <div className="flex items-center justify-center gap-4 py-2">
                {[
                  { emoji: '🎀', label: 'Breast Cancer Research' },
                  { emoji: '💜', label: 'The Loveland Foundation' },
                  { emoji: '🌍', label: 'Women for Women Intl' },
                ].map((org, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl mb-1">{org.emoji}</div>
                    <p className="text-[10px] text-muted-foreground font-medium">{org.label}</p>
                  </div>
                ))}
              </div>
              <Button onClick={handleDonate} className="w-full rounded-full">
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="text-6xl text-center mb-4">{selectedItem?.imagePlaceholder}</div>
            <DialogTitle className="text-xl font-heading text-center">{selectedItem?.title}</DialogTitle>
            <DialogDescription className="text-center font-mono-data font-semibold text-primary">
              {selectedItem?.priceAC ? `${selectedItem.priceAC.toLocaleString()} AC` : selectedItem?.price}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{selectedItem?.detailDescription}</p>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button onClick={handleRedeem} className="w-full rounded-full">
              <Gift className="h-4 w-4 mr-2" /> Redeem
            </Button>
            <Button onClick={() => setSelectedItem(null)} className="w-full rounded-full" variant="outline">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coming Soon */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="text-6xl text-center mb-4">✨</div>
            <DialogTitle className="text-xl font-heading text-center">Coming Soon!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">This feature is coming soon! Thank you for being a part of building our future.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowComingSoon(false)} className="w-full rounded-full">Got It</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default LegacyTreasury;
