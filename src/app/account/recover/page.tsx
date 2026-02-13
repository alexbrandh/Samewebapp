'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/ui/page-container';
import { ArrowLeft, EnvelopeSimple, CheckCircle } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { recoverPassword } from '@/lib/shopify-customer';

export default function RecoverPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await recoverPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error sending recovery email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageContainer className="overflow-x-hidden">
        <div className="max-w-md mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-lg p-8 text-center"
          >
            <div className="mb-6">
              <CheckCircle size={64} weight="fill" className="text-primary mx-auto" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Check Your Email
            </h1>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>.
              <br />
              Click the link in the email to reset your password.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/account/login')}
                className="w-full"
              >
                Back to Login
              </Button>
              
              <button
                onClick={() => setSuccess(false)}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="overflow-x-hidden">
      <div className="max-w-md mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Forgot Password?
          </h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <EnvelopeSimple size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </motion.form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link
              href="/account/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-muted border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            💡 Need Help?
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Check your spam folder if you don't see the email</li>
            <li>• The reset link expires after 24 hours</li>
            <li>• Make sure you entered the correct email address</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}
