'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Twitter, Linkedin } from 'lucide-react'
import { PrivacyTerms } from './privacy-terms'

export function Footer({ onDialogChange }: { onDialogChange: (isOpen: boolean) => void }) {
 const [showPrivacyTerms, setShowPrivacyTerms] = useState(false)

 return (
   <footer className={`border-t transition-colors duration-300 ${showPrivacyTerms ? 'bg-[#F3F3F3]' : 'bg-white'}`}>
     <div className="container mx-auto px-4 py-12">
       <div className="flex flex-col md:flex-row justify-between items-center">
         <div className="mb-4 md:mb-0">
           <Link href="/" className="text-medium font-medium">
             documint
           </Link>
         </div>

         <div className="flex gap-8">
           <Link 
             href="#overview" 
             className="text-sm text-gray-500 hover:text-black transition-colors"
           >
             Overview
           </Link>
           <Link 
             href="/about" 
             className="text-sm text-gray-500 hover:text-black transition-colors"
           >
             About
           </Link>
           <Link 
             href="/blog" 
             className="text-sm text-gray-500 hover:text-black transition-colors"
           >
             Blog
           </Link>
           <Link 
             href="/contact" 
             className="text-sm text-gray-500 hover:text-black transition-colors"
           >
             Contact
           </Link>
           <button 
             onClick={() => {
               setShowPrivacyTerms(true)
               onDialogChange(true)
             }}
             className="text-sm text-gray-500 hover:text-black transition-colors"
           >
             Privacy and terms
           </button>
         </div>

         <div className="flex items-center gap-4 mt-4 md:mt-0">
           <Link 
             href="https://twitter.com/documint" 
             target="_blank"
             className="text-gray-500 hover:text-black transition-colors"
           >
             <Twitter size={15} />
           </Link>
           <Link 
             href="https://linkedin.com/company/documint" 
             target="_blank"
             className="text-gray-500 hover:text-black transition-colors"
           >
             <Linkedin size={15} />
           </Link>
         </div>
       </div>
       
       <div className="text-center mt-8 text-gray-600 text-xs">
         © 2024 Documint. All rights reserved.
       </div>
     </div>

     <PrivacyTerms
       open={showPrivacyTerms}
       onClose={() => {
         setShowPrivacyTerms(false)
         onDialogChange(false)
       }}
     />
   </footer>
 )
}