'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PrivacyTerms } from '@/components/landing/privacy-terms'

export function Navbar({ onDialogChange }: { onDialogChange: (isOpen: boolean) => void }) {
 const [showPrivacyTerms, setShowPrivacyTerms] = useState(false)
 const [activeSection, setActiveSection] = useState('overview')

 const handleScroll = (id: string) => {
   document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
   setActiveSection(id)
 }

 return (
   <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
     <nav className="container mx-auto px-4">
       <div className="flex h-16 items-center justify-between">
         <div className="flex items-center">
           <Link href="/" className="text-xl font-bold">
             documint
           </Link>
         </div>

         <div className="hidden md:flex">
           <div className="bg-[#F5F5F5] rounded-full p-1.5 flex items-center space-x-1">
             <button 
               onClick={() => handleScroll('overview')}
               className={`text-sm px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                 activeSection === 'overview' ? 'bg-white' : 'hover:bg-white'
               }`}
             >
               Overview
             </button>
             <button 
               onClick={() => handleScroll('pricing')}
               className={`text-sm px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                 activeSection === 'pricing' ? 'bg-white' : 'hover:bg-white'
               }`}
             >
               Pricing
             </button>
             <button 
               onClick={() => handleScroll('faq')}
               className={`text-sm px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                 activeSection === 'faq' ? 'bg-white' : 'hover:bg-white'
               }`}
             >
               FAQ
             </button>
             <button 
               onClick={() => {
                 setShowPrivacyTerms(true)
                 setActiveSection('privacy-terms')
                 onDialogChange(true)
               }}
               className={`text-sm px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                 activeSection === 'privacy-terms' ? 'bg-white' : 'hover:bg-white'
               }`}
             >
               Privacy and terms
             </button>
           </div>
         </div>

         <div className="flex items-center space-x-4">
           <Button variant="ghost" asChild>
             <Link href="/auth/signin">Sign in</Link>
           </Button>
           <Button className="bg-[#CEFE01] text-black hover:bg-[#CEFE01]/90" asChild>
             <Link href="/auth/signup">Get Started</Link>
           </Button>
         </div>
       </div>
     </nav>

     <PrivacyTerms 
       open={showPrivacyTerms} 
       onClose={() => {
         setShowPrivacyTerms(false)
         setActiveSection('')
         onDialogChange(false)
       }} 
     />
   </header>
 )
}