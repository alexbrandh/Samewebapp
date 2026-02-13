'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Users, ShieldCheck, ChartLine } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { useCustomer } from '@/contexts/customer-context';
import Link from 'next/link';

export default function ReferAFriendPage() {
  const { customer, isAuthenticated, accessToken } = useCustomer();
  const [referralCode, setReferralCode] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fetch code when authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken && !referralCode) {
      fetchReferralCode();
    }
  }, [isAuthenticated, accessToken]);

  // Fetch usage stats when we have a code
  useEffect(() => {
    if (referralCode) {
      fetchUsageStats();
    }
  }, [referralCode]);

  const fetchReferralCode = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/referral/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load referral code');
      }

      setReferralCode(data.code);
    } catch (err: any) {
      console.error("Referral Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageStats = async () => {
    try {
      const response = await fetch(`/api/referral/stats?code=${encodeURIComponent(referralCode)}`);
      const data = await response.json();
      if (data.usageCount !== undefined) {
        setUsageCount(data.usageCount);
      }
    } catch (err) {
      console.error("Error fetching usage stats:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
      }).catch((err) => {
        console.error("Failed to copy:", err);
        prompt("Copy this code:", text);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert("Copied to clipboard!");
      } catch (err) {
        prompt("Copy this code:", text);
      }
      document.body.removeChild(textArea);
    }
  };

  // 1. GUEST STATE (Not Logged In)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-8 p-8 border border-border rounded-xl shadow-lg bg-card">
          <div className="mx-auto h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Users size={48} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Join our Referral Program
          </h2>
          <p className="text-sm text-muted-foreground">
            Please sign in to get your unique referral code. You'll earn rewards for every friend you invite!
          </p>
          <div className="gap-4 flex flex-col pt-4">
            <Link href="/account/login?return_url=/pages/refer-a-friend" className="w-full">
              <Button className="w-full" size="lg">Log In</Button>
            </Link>
            <Link href="/account/register?return_url=/pages/refer-a-friend" className="w-full">
              <Button variant="outline" className="w-full" size="lg">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED STATE
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-6">
              <Gift size={16} weight="fill" />
              <span>Give 10%, Get Rewards</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-serif text-foreground">
              Refer a Friend & <br />
              <span className="text-primary">
                Earn Rewards
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Give your friends 10% off their first order.
              When they buy, you help grow our community!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl shadow-lg p-6 md:p-10"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 text-primary font-serif">Your Unique Referral Code</h3>
            <p className="text-muted-foreground">It never expires. Share it as much as you like!</p>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center border border-destructive/20">
              <p className="mb-2">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchReferralCode}>Try Again</Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Code Display */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-linear-to-r from-primary/50 to-secondary/50 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative flex items-center gap-4 bg-background p-6 rounded-lg border border-border">
                  <code className="flex-1 text-3xl md:text-4xl font-mono font-bold text-center tracking-wider text-primary break-all">
                    {referralCode || 'LOADING...'}
                  </code>
                  <Button size="icon" variant="ghost" onClick={() => copyToClipboard(referralCode)} title="Copy Code" disabled={!referralCode}>
                    <Copy size={24} />
                  </Button>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <ChartLine size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">People who used your code</p>
                      <p className="text-3xl font-bold text-foreground">{usageCount}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchUsageStats}>
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Social Sharing */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Users /> Share on Social Media
                </label>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                    onClick={() => window.open(`https://wa.me/?text=Get 10% off at SAME.! Use my code: ${referralCode} at checkout. Visit: https://www.sameperfumes.com`, '_blank')}
                    disabled={!referralCode}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    className="flex-1 bg-[#1877F2] hover:bg-[#166FE5] text-white border-none"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?quote=Get 10% off at SAME. with my code ${referralCode}!&u=https://www.sameperfumes.com`, '_blank')}
                    disabled={!referralCode}
                  >
                    Facebook
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-border">
            <h4 className="font-semibold mb-6 flex items-center gap-2 text-lg text-foreground">
              <ShieldCheck size={24} className="text-primary" />
              How It Works
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-4 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span><strong>Share your code:</strong> Send your unique code to friends, family, or followers.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span><strong>They get 10% OFF:</strong> When they use your code at checkout on their first order.</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span><strong>You help us grow:</strong> We're building a rewards system for top referrers. Stay tuned!</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
