'use client';

/**
 * Customer Context - Gestiona el estado de autenticación del cliente
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Customer, LoginCredentials, SignupCredentials } from '@/lib/types/customer';
import {
  loginCustomer,
  signupCustomer,
  getCustomer,
  validateToken,
} from '@/lib/shopify-customer';

interface CustomerContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<{ needsActivation: boolean }>;
  logout: () => void;
  refreshCustomer: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

const STORAGE_KEY = 'shopify_customer_token';
const STORAGE_EXPIRY_KEY = 'shopify_customer_token_expiry';

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar token al iniciar
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEY);
        const storedExpiry = localStorage.getItem(STORAGE_EXPIRY_KEY);

        if (!storedToken || !storedExpiry) {
          setIsLoading(false);
          return;
        }

        // Verificar si el token expiró
        const expiryDate = new Date(storedExpiry);
        if (expiryDate < new Date()) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_EXPIRY_KEY);
          setIsLoading(false);
          return;
        }

        // Validar token con Shopify
        const isValid = await validateToken(storedToken);
        if (!isValid) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_EXPIRY_KEY);
          setIsLoading(false);
          return;
        }

        // Cargar datos del cliente
        const customerData = await getCustomer(storedToken);
        if (customerData) {
          setCustomer(customerData);
          setAccessToken(storedToken);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_EXPIRY_KEY);
        }
      } catch (error) {
        console.error('Error loading customer:', error);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_EXPIRY_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomer();
  }, []);

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const tokenData = await loginCustomer(credentials);

      if (!tokenData) {
        throw new Error('Failed to login');
      }

      // Guardar token
      localStorage.setItem(STORAGE_KEY, tokenData.accessToken);
      localStorage.setItem(STORAGE_EXPIRY_KEY, tokenData.expiresAt);
      setAccessToken(tokenData.accessToken);

      // Cargar datos del cliente
      const customerData = await getCustomer(tokenData.accessToken);
      setCustomer(customerData);
    } catch (error: any) {
      // Don't log expected auth errors as system errors
      if (!error.message?.includes('Unidentified customer')) {
        console.error('Login error:', error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup
  const signup = async (credentials: SignupCredentials): Promise<{ needsActivation: boolean }> => {
    try {
      setIsLoading(true);
      const result = await signupCustomer(credentials);

      // Check if signupCustomer returned an emailVerificationSent flag
      if (result?.emailVerificationSent) {
        return { needsActivation: true };
      }

      // Después de crear la cuenta, intentar login automáticamente
      // Shopify puede requerir activación por email primero
      try {
        await login({
          email: credentials.email,
          password: credentials.password,
        });
        return { needsActivation: false };
      } catch (loginError: any) {
        // Broad check for login failures after successful creation.
        // If login fails here, it's almost certainly because of activation requirement or immediate token issues.
        // We should err on the side of telling the user "Account created", rather than "Error".
        const errorMessage = loginError.message?.toLowerCase() || '';

        if (errorMessage.includes('unidentified customer') ||
          errorMessage.includes('invalid') ||
          errorMessage.includes('customer not found')) {
          console.log('Account created, login skipped (likely needs activation)');
          return { needsActivation: true };
        }

        // Even for other errors, since account IS created, we might want to just show success?
        // Let's stick to the activation check for now but be broader.
        console.warn('Post-signup login failed:', loginError);
        return { needsActivation: true }; // Fallback: Assume success but login failed
      }
    } catch (error: any) {
      // Check if the error message is actually the email verification message from Shopify
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('we have sent an email') ||
        msg.includes('verify your email') ||
        msg.includes('please click the link')) {
        return { needsActivation: true };
      }

      if (msg.includes('unidentified customer')) {
        // Expected error if activation is required, suppress console.error
        console.log('Signup completed but login pending activation.');
      } else {
        console.error('Signup error:', error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
    setCustomer(null);
    setAccessToken(null);
  };

  // Refresh customer data
  const refreshCustomer = async () => {
    if (!accessToken) return;

    try {
      const customerData = await getCustomer(accessToken);
      setCustomer(customerData);
    } catch (error) {
      console.error('Error refreshing customer:', error);
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        accessToken,
        login,
        signup,
        logout,
        refreshCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

// Hook para usar el context
export function useCustomer() {
  const context = useContext(CustomerContext);

  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }

  return context;
}
