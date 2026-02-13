'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/ui/page-container';
import { useCustomer } from '@/contexts/customer-context';
import { Button } from '@/components/ui/button';
import { Envelope, Lock, User, Phone } from 'phosphor-react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, isLoading, customer } = useCustomer();

  useEffect(() => {
    if (customer) {
      router.push('/account');
    }
  }, [customer, router]);

  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    acceptsMarketing: true,
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsSignup(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isSignup) {
        if (!agreedToTerms) {
          setError('You must agree to the Terms of Use and Privacy Policy to create an account.');
          return;
        }
        const result = await signup({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          acceptsMarketing: formData.acceptsMarketing,
        });

        if (result.needsActivation) {
          setSuccess(`Account created successfully! We've sent a verification email to ${formData.email}. Please check your inbox (and spam folder) and click the link to activate your account before signing in.`);
          setIsSignup(false); // Switch to login view
          window.scrollTo(0, 0);
          return; // Stop here, don't redirect
        }
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }

      // Redirigir al dashboard después del login exitoso
      router.push('/account');
    } catch (err: any) {
      // Special case: If we are in signup mode and get "Unidentified customer" (or similar), it means 
      // signup succeeded but auto-login failed. Treat as success.
      if (isSignup && (
        err.message?.includes('Unidentified customer') ||
        err.message?.includes('invalid')
      )) {
        setSuccess(`Account created successfully! We've sent a verification email to ${formData.email}. Please check your inbox (and spam folder) and click the link to activate your account before signing in.`);
        setIsSignup(false);
        // Scroll to top
        window.scrollTo(0, 0);
        return;
      }

      let errorMessage = err.message || 'Authentication failed. Please try again.';

      // Improve error messages for common cases
      if (errorMessage.includes('Unidentified customer')) {
        errorMessage = 'The email or password you entered is incorrect. If you recently created an account, please check your email to verify it first.';
      } else if (errorMessage.toLowerCase().includes('invalid email or password')) {
        errorMessage = 'The email or password you entered is incorrect. Please try again.';
      }

      setError(errorMessage);
      console.log('Auth attempt failed:', errorMessage); // Info log instead of error
    }
  };

  return (
    <PageContainer className="overflow-x-hidden flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignup
                ? 'Sign up to access your account'
                : 'Sign in to access your account'}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
              <span className="text-lg flex-shrink-0 mt-0.5">✉️</span>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Almost there!</p>
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Signup fields */}
            {isSignup && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={20}
                    />
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John"
                      required={isSignup}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={20}
                    />
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Doe"
                      required={isSignup}
                    />
                  </div>
                </div>
              </div>
            )}

            {isSignup && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone (optional, must start with +)
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+971501234567"
                  />
                </div>
              </div>
            )}

            {isSignup && (
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="acceptsMarketing"
                      checked={formData.acceptsMarketing}
                      onChange={(e) => setFormData({ ...formData, acceptsMarketing: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </div>
                  <label htmlFor="acceptsMarketing" className="text-sm text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-0.5">
                    Sign up for our newsletter and get 10% off your first order.
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="agreedToTerms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      required={isSignup}
                    />
                  </div>
                  <label htmlFor="agreedToTerms" className="text-sm text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-0.5">
                    I agree to the <Link href="/terms" className="underline hover:text-primary">Terms of Use</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                  </label>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Envelope
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
              )}
            </Button>
          </form>

          {/* Forgot Password Link - FUERA del form */}
          {!isSignup && (
            <div className="mt-4 text-center">
              <Link
                href="/account/recover"
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          )}

          {/* Toggle entre Login y Signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setSuccess('');
              }}
              className="text-primary hover:underline"
            >
              {isSignup
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
