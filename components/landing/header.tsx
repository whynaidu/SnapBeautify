'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from './layout/container'
import { Logo } from './shared/logo'
import { ModeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Features', href: '#features', sectionId: 'features' },
  { label: 'How It Works', href: '#how-it-works', sectionId: 'how-it-works' },
  { label: 'Pricing', href: '#pricing', sectionId: 'pricing' },
  { label: 'FAQ', href: '#faq', sectionId: 'faq' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Handle scroll for header background (throttled for performance)
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll spy using Intersection Observer
  useEffect(() => {
    const sectionIds = navLinks.map(link => link.sectionId)
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (sections.length === 0) return

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sections.forEach(section => {
      observer.observe(section)
    })

    return () => {
      sections.forEach(section => {
        observer.unobserve(section)
      })
    }
  }, [])

  // Handle nav link click - smooth scroll
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)

    const wasMenuOpen = isMobileMenuOpen
    if (wasMenuOpen) {
      setIsMobileMenuOpen(false)
    }

    const scrollToTarget = () => {
      if (targetElement) {
        const headerOffset = 80
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.scrollY - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })

        setActiveSection(targetId)
      }
    }

    if (wasMenuOpen) {
      setTimeout(scrollToTarget, 100)
    } else {
      scrollToTarget()
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isMobileMenuOpen
          ? 'bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 py-4'
          : 'bg-transparent py-6'
      )}
      role="banner"
    >
      <Container>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    'relative px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm',
                    isActive
                      ? 'text-black dark:text-white bg-zinc-100 dark:bg-zinc-800'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  )}
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            <Link href="/app">
              <Button variant="ghost" size="sm" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900">
                Sign In
              </Button>
            </Link>
            <Link href="/app">
              <Button
                size="sm"
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
              >
                Try Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <button
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu - CSS-only animation */}
        <div
          id="mobile-menu"
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-out',
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4 pb-4' : 'max-h-0 opacity-0'
          )}
          role="menu"
          aria-label="Mobile navigation"
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                  className={cn(
                    'px-4 py-3 rounded-xl font-medium transition-all',
                    isActive
                      ? 'text-black dark:text-white bg-zinc-100 dark:bg-zinc-800'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  )}
                >
                  <div className="flex items-center justify-between">
                    {link.label}
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                    )}
                  </div>
                </a>
              )
            })}
            <div className="flex gap-4 pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800">
              <Link href="/app" className="flex-1" tabIndex={isMobileMenuOpen ? 0 : -1}>
                <Button variant="outline" size="sm" className="w-full border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/app" className="flex-1" tabIndex={isMobileMenuOpen ? 0 : -1}>
                <Button
                  size="sm"
                  className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  Try Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}
