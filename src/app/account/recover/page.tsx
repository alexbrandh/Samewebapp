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
      setError(err.message || 'Error al enviar el correo de recuperación. Inténtalo de nuevo.');
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
              Revisa Tu Correo
            </h1>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Hemos enviado un enlace para restablecer tu contraseña a <strong className="text-foreground">{email}</strong>.
              <br />
              Haz clic en el enlace del correo para restablecer tu contraseña.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/account/login')}
                className="w-full"
              >
                Volver al Inicio de Sesión
              </Button>
              
              <button
                onClick={() => setSuccess(false)}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ¿No recibiste el correo? Intentar de nuevo
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
            Volver al Inicio de Sesión
          </Link>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ¿Olvidaste tu Contraseña?
          </h1>
          <p className="text-muted-foreground">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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
                Correo Electrónico
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
              {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </Button>
          </div>
        </motion.form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Recuerdas tu contraseña?{' '}
            <Link
              href="/account/login"
              className="text-primary hover:underline font-medium"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-muted border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            💡 ¿Necesitas Ayuda?
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Revisa tu carpeta de spam si no ves el correo</li>
            <li>• El enlace de recuperación expira después de 24 horas</li>
            <li>• Asegúrate de haber ingresado el correo correcto</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}
