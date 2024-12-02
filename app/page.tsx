'use client'

import { useState } from 'react'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Navbar } from '@/components/landing/navbar'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [navDialogOpen, setNavDialogOpen] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dialogOpen || navDialogOpen ? 'bg-[#F3F3F3]' : 'bg-white'}`}>
      <Navbar 
        onDialogChange={setNavDialogOpen}
      />
      <main>
        <Hero id="overview" dialogOpen={dialogOpen || navDialogOpen} />
        <Features />
        <Pricing id="pricing" />
        <FAQ id="faq" dialogOpen={dialogOpen} />
      </main>
      <Footer onDialogChange={setDialogOpen} />
    </div>
  )
}