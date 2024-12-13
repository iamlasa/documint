'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroProps {
  dialogOpen: boolean
  id?: string
}

export function Hero({ dialogOpen, id }: HeroProps) {
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => clearInterval(interval)
  }, [])

  return (
    <section 
      id={id}
      className={`transition-colors duration-300 ${dialogOpen ? 'bg-[#F3F3F3]' : 'bg-white'}`}
    >
      <div className="container mx-auto py-32 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-light leading-tight">
            Manage your{' '}
            <span className="text-gray-500">Contentful content</span>
            {' '}with precision
            <span 
              className="inline-block w-[2px] h-[1em] bg-black ml-1 -mb-1 align-middle" 
              style={{ opacity: showCursor ? 1 : 0 }}
            />
          </h1>
          
          <p className="text-xl text-gray-500 mt-8 max-w-3xl mx-auto">
            Search, edit, and replace content across your entire Contentful CMS with ease. Make bulk updates while maintaining full control.
          </p>

          <Button 
            size="lg"
            className="mt-12 bg-[#F3F3F3] hover:bg-[#F3F3F3] text-black rounded-full px-8 shadow-none border-0"
            asChild
          >
            <Link href="/auth/signup">
              Start for free
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}