'use client';

import { useAuth } from '@/lib/auth/context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Loader2,
  Mail,
  ArrowLeft,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle,
  Image,
  Wand2,
  Star,
  Layers,
  Camera,
  Home
} from 'lucide-react';
import { GitHubIcon } from '@/components/ui/icons';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Mobile detection hook for performance optimization
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
}

interface AuthGateProps {
  children: React.ReactNode;
}

const features = [
  { icon: Wand2, title: 'AI-Powered', description: 'Smart enhancements in one click' },
  { icon: Shield, title: '100% Private', description: 'Images never leave your browser' },
  { icon: Image, title: 'Pro Quality', description: 'Professional results instantly' },
];

// Floating icons for background decoration
const floatingIcons = [
  { icon: Star, x: '10%', y: '20%', delay: 0 },
  { icon: Camera, x: '85%', y: '15%', delay: 0.5 },
  { icon: Layers, x: '75%', y: '70%', delay: 1 },
  { icon: Sparkles, x: '15%', y: '75%', delay: 1.5 },
  { icon: Wand2, x: '90%', y: '45%', delay: 2 },
];

// Animated background blob - static on mobile for performance
function AnimatedBlob({ className, isMobile }: { className?: string; isMobile?: boolean }) {
  // On mobile, render a static blob without animations
  if (isMobile) {
    return <div className={className} style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }} />;
  }
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 180, 270, 360],
        borderRadius: ['30% 70% 70% 30% / 30% 30% 70% 70%', '70% 30% 30% 70% / 70% 70% 30% 30%', '30% 70% 70% 30% / 30% 30% 70% 70%'],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

// Floating icon component - static on mobile for performance
function FloatingIcon({ icon: Icon, x, y, delay, isMobile }: { icon: React.ComponentType<{ className?: string }>; x: string; y: string; delay: number; isMobile?: boolean }) {
  // On mobile, render a static icon without animations
  if (isMobile) {
    return (
      <div
        className="absolute text-zinc-300 dark:text-zinc-700 opacity-40"
        style={{ left: x, top: y }}
      >
        <Icon className="w-6 h-6" />
      </div>
    );
  }
  return (
    <motion.div
      className="absolute text-zinc-300 dark:text-zinc-700"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Icon className="w-6 h-6" />
    </motion.div>
  );
}

// Pre-generated particle positions for stable rendering (reduced count for performance)
const particleData = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 5) % 100}%`,
  top: `${(i * 23 + 10) % 100}%`,
  duration: 3 + (i % 5) * 0.4,
  delay: (i % 4) * 0.5,
}));

// Particle effect - disabled on mobile for performance
function Particles({ isMobile }: { isMobile?: boolean }) {
  // Skip particles entirely on mobile
  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particleData.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-zinc-400/30 dark:bg-zinc-600/30 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Inner component that uses useSearchParams - must be wrapped in Suspense
function AuthGateInner({ children }: AuthGateProps) {
  const { isAuthenticated, isLoading, signIn, signUp, signInWithGoogle, signInWithGithub } = useAuth();
  const searchParams = useSearchParams();
  const fromLogout = searchParams.get('fromLogout') === 'true';
  const isMobile = useIsMobile(); // For disabling heavy animations on mobile
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Track if initial auth check is done to prevent flicker
  const [authCheckDone, setAuthCheckDone] = useState(fromLogout);

  // Mark auth check as done when loading completes
  useEffect(() => {
    if (!isLoading && !authCheckDone) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setAuthCheckDone(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, authCheckDone]);

  // Clean up the fromLogout parameter from URL
  useEffect(() => {
    if (fromLogout) {
      const url = new URL(window.location.href);
      url.searchParams.delete('fromLogout');
      window.history.replaceState({}, '', url.toString());
    }
  }, [fromLogout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please try again.');
          } else if (error.message.includes('Email not confirmed')) {
            setError('Please verify your email before logging in.');
          } else {
            setError(error.message);
          }
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            setError('This email is already registered. Try logging in instead.');
          } else {
            setError(error.message);
          }
        } else {
          setEmailSent(true);
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    setEmailSent(false);
    setMode('login');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError(null);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Show loading state until auth check is complete
  // Skip loader if coming from logout (authCheckDone is initialized to true in that case)
  if (!authCheckDone) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated rings */}
          <div className="relative">
            <motion.div
              className="absolute inset-0 w-24 h-24 rounded-full border-4 border-zinc-200 dark:border-zinc-800"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 w-24 h-24 rounded-full border-4 border-zinc-300 dark:border-zinc-700"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.div
              className="relative w-24 h-24 rounded-2xl bg-black dark:bg-white flex items-center justify-center"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-12 h-12 text-white dark:text-black" />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-lg font-medium">Loading SnapBeautify...</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    // Show email confirmation screen after signup
    if (emailSent) {
      return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-4 overflow-hidden">
          <Particles isMobile={isMobile} />
          <motion.div
            className="w-full max-w-md relative z-10"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          >
            <motion.div
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center relative overflow-hidden"
              whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Success Icon with pulse rings */}
              <div className="relative mb-6">
                <motion.div
                  className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-green-200 dark:bg-green-900/50"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="relative w-20 h-20 mx-auto rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Mail className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </motion.div>
                </motion.div>
              </div>

              <motion.h1
                className="text-2xl font-bold text-black dark:text-white mb-2 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Check your email
              </motion.h1>

              <motion.p
                className="text-zinc-600 dark:text-zinc-400 mb-2 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                We&apos;ve sent a confirmation link to
              </motion.p>

              <motion.p
                className="font-semibold text-black dark:text-white mb-6 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {email}
              </motion.p>

              <motion.div
                className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 mb-6 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Click the link in your email to verify your account and start using SnapBeautify.
                </p>
              </motion.div>

              <motion.p
                className="text-xs text-zinc-500 dark:text-zinc-500 mb-6 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Didn&apos;t receive the email? Check your spam folder.
              </motion.p>

              <motion.button
                onClick={handleBackToLogin}
                className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ x: -8, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex overflow-hidden">
        {/* Left Side - Branding (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
          </div>

          {/* Animated blobs */}
          <AnimatedBlob isMobile={isMobile} className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-zinc-200/50 to-zinc-300/50 dark:from-zinc-800/50 dark:to-zinc-700/50 blur-3xl" />
          <AnimatedBlob isMobile={isMobile} className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-zinc-300/30 to-zinc-200/30 dark:from-zinc-700/30 dark:to-zinc-800/30 blur-3xl" />

          {/* Floating icons */}
          {floatingIcons.map((item, index) => (
            <FloatingIcon key={index} {...item} isMobile={isMobile} />
          ))}

          {/* Particles */}
          <Particles isMobile={isMobile} />

          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
            {/* Logo with animation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            >
              <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
                <motion.div
                  className="w-14 h-14 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="w-7 h-7 text-white dark:text-black" />
                  </motion.div>
                </motion.div>
                <motion.span
                  className="text-2xl font-bold text-black dark:text-white"
                  whileHover={{ x: 5 }}
                >
                  SnapBeautify
                </motion.span>
              </Link>
            </motion.div>

            {/* Headline with stagger */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.h1
                className="text-4xl xl:text-5xl font-bold text-black dark:text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Transform your photos
              </motion.h1>
              <motion.h1
                className="text-4xl xl:text-5xl font-bold text-zinc-400 dark:text-zinc-500 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                in seconds
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Professional-quality image enhancement powered by AI.
              Everything happens in your browser - your images stay private.
            </motion.p>

            {/* Features with stagger animation */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 group cursor-pointer"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.15, type: 'spring', stiffness: 100 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    <feature.icon className="w-7 h-7 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-black dark:text-white text-lg">{feature.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Animated stats */}
            <motion.div
              className="mt-12 flex gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              {[
                { value: '10K+', label: 'Happy Users' },
                { value: '100%', label: 'Private' },
                { value: '5s', label: 'Avg. Edit Time' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <motion.div
                    className="text-2xl font-bold text-black dark:text-white"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + index * 0.1, type: 'spring' }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
          {/* Mobile particles */}
          <div className="lg:hidden">
            <Particles isMobile={isMobile} />
          </div>

          <motion.div
            className="w-full max-w-md relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          >
            {/* Back to Landing Page Link */}
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Back to Landing Page</span>
              </Link>
            </motion.div>

            {/* Mobile Logo */}
            <motion.div
              className="lg:hidden flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
            >
              <Link href="/" className="inline-flex items-center gap-2">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-white dark:text-black" />
                </motion.div>
                <span className="text-xl font-bold text-black dark:text-white">SnapBeautify</span>
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                {mode === 'login'
                  ? 'Sign in to access your Pro features'
                  : 'Start enhancing your photos today'}
              </p>
            </motion.div>

            {/* Tab Switcher with smooth sliding animation */}
            <motion.div
              className="relative p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-6 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Sliding background indicator */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-3px)] bg-black dark:bg-white rounded-xl shadow-lg"
                animate={{
                  x: mode === 'login' ? 0 : 'calc(100% + 6px)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                style={{ left: '6px' }}
              />

              {/* Tab buttons */}
              <div className="relative flex z-10">
                <button
                  onClick={() => handleModeSwitch('login')}
                  className={`flex-1 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                    mode === 'login'
                      ? 'text-white dark:text-black'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleModeSwitch('signup')}
                  className={`flex-1 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                    mode === 'signup'
                      ? 'text-white dark:text-black'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </motion.div>

            {/* Error Message with shake animation */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: [0, -10, 10, -10, 10, 0]
                  }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="mb-4"
                >
                  <div className="flex items-center gap-2 p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    </motion.div>
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* OAuth Buttons with hover effects */}
            <motion.div
              className="flex gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => signInWithGoogle()}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-black dark:text-white transition-all disabled:opacity-50 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </motion.svg>
                <span className="group-hover:translate-x-1 transition-transform">Google</span>
              </motion.button>
              <motion.button
                onClick={() => signInWithGithub()}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-black dark:text-white transition-all disabled:opacity-50 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <GitHubIcon className="w-5 h-5" />
                </motion.div>
                <span className="group-hover:translate-x-1 transition-transform">GitHub</span>
              </motion.button>
            </motion.div>

            {/* Divider with animated line */}
            <motion.div
              className="relative my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute inset-0 flex items-center">
                <motion.span
                  className="w-full border-t border-zinc-200 dark:border-zinc-800"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <motion.span
                  className="bg-white dark:bg-zinc-950 px-4 text-zinc-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  or continue with email
                </motion.span>
              </div>
            </motion.div>

            {/* Form with animated inputs */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-black dark:text-white">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-black dark:text-white">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                      required
                      disabled={isSubmitting}
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Signup only) - Animated container */}
                <motion.div
                  initial={false}
                  animate={{
                    height: mode === 'signup' ? 'auto' : 0,
                    opacity: mode === 'signup' ? 1 : 0,
                    marginTop: mode === 'signup' ? 16 : 0,
                  }}
                  transition={{
                    height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.2, delay: mode === 'signup' ? 0.1 : 0 },
                    marginTop: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-black dark:text-white">
                      Confirm Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-11 pr-11 h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                        required={mode === 'signup'}
                        disabled={isSubmitting || mode === 'login'}
                        tabIndex={mode === 'signup' ? 0 : -1}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                        tabIndex={mode === 'signup' ? 0 : -1}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button with enhanced animation */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full h-12 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group"
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 dark:from-zinc-200 dark:via-zinc-100 dark:to-zinc-200"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ opacity: 0.3 }}
                  />

                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 className="w-5 h-5" />
                        </motion.div>
                        {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                      </>
                    ) : (
                      <>
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </>
                    )}
                  </span>
                </motion.button>
            </form>

            {/* Trust Badges with stagger */}
            <motion.div
              className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { icon: Zap, text: 'Instant access' },
                { icon: Shield, text: '100% private' },
                { icon: CheckCircle, text: 'No credit card' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-xs text-zinc-500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="w-4 h-4" />
                  </motion.div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Terms */}
            <motion.p
              className="text-center text-xs text-zinc-500 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-black dark:hover:text-white transition-colors">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-black dark:hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  // User is authenticated - show the app
  return <>{children}</>;
}

// Loading fallback for Suspense - matches the AuthGate loading animation to prevent flicker
function AuthGateLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-6">
        {/* Static version of the animated rings (no motion to avoid hydration issues) */}
        <div className="relative">
          <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-zinc-200 dark:border-zinc-800 opacity-50" />
          <div className="relative w-24 h-24 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white dark:text-black" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-lg font-medium">Loading SnapBeautify...</span>
        </div>
      </div>
    </div>
  );
}

// Exported component with Suspense boundary for useSearchParams
export function AuthGate({ children }: AuthGateProps) {
  return (
    <Suspense fallback={<AuthGateLoading />}>
      <AuthGateInner>{children}</AuthGateInner>
    </Suspense>
  );
}
