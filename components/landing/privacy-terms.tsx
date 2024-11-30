// components/landing/privacy-terms.tsx

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, ChevronRight } from 'lucide-react'

interface PrivacyTermsProps {
 open: boolean
 onClose: () => void
}

const PrivacyContent = () => (
 <div className="space-y-4 text-gray-600">
   <p>Last updated: February 2024</p>
   <h3 className="text-lg font-medium text-black">1. Information We Collect</h3>
   <p>We collect information necessary to provide our Contentful management services, including account information and usage data.</p>
   <h3 className="text-lg font-medium text-black">2. Use of Information</h3>
   <p>We use your information to provide and improve our services, communicate with you, and ensure security of your account.</p>
   <h3 className="text-lg font-medium text-black">3. Data Security</h3>
   <p>We implement industry-standard security measures to protect your data. Your API keys are encrypted and securely stored.</p>
   <h3 className="text-lg font-medium text-black">4. Data Sharing</h3>
   <p>We do not sell your personal information. We only share data necessary to provide our services.</p>
   <h3 className="text-lg font-medium text-black">5. Contact Us</h3>
   <p>If you have any questions about this Privacy Policy, please contact us at privacy@documint.io</p>
 </div>
)

const TermsContent = () => (
 <div className="space-y-4 text-gray-600">
   <p>Last updated: February 2024</p>
   <h3 className="text-lg font-medium text-black">1. Acceptance of Terms</h3>
   <p>By accessing or using Documint, you agree to be bound by these Terms of Service.</p>
   <h3 className="text-lg font-medium text-black">2. Service Description</h3>
   <p>Documint provides tools for managing and editing Contentful content. We reserve the right to modify or discontinue the service at any time.</p>
   <h3 className="text-lg font-medium text-black">3. User Responsibilities</h3>
   <p>You are responsible for maintaining the security of your account and API keys.</p>
   <h3 className="text-lg font-medium text-black">4. Limitations of Liability</h3>
   <p>Documint is provided "as is" without warranties of any kind, either express or implied.</p>
   <h3 className="text-lg font-medium text-black">5. Contact</h3>
   <p>For any questions about these Terms, please contact us at legal@documint.io</p>
 </div>
)

const CookieNoticeContent = () => (
 <div className="space-y-4 text-gray-600">
   <p>Last updated: February 2024</p>
   <h3 className="text-lg font-medium text-black">Cookie Usage</h3>
   <p>We use cookies to enhance your experience on our website. These cookies help us understand how you interact with our services.</p>
   <h3 className="text-lg font-medium text-black">Types of Cookies</h3>
   <p>We use essential cookies for basic functionality and analytical cookies to improve our services.</p>
   <h3 className="text-lg font-medium text-black">Your Choices</h3>
   <p>You can manage your cookie preferences through your browser settings or our Cookie Settings page.</p>
 </div>
)

const CookieSettingsContent = () => (
 <div className="space-y-4 text-gray-600">
   <h3 className="text-lg font-medium text-black">Cookie Preferences</h3>
   <p>Manage your cookie preferences here. Changes will be saved automatically.</p>
   {/* Add toggle switches for different cookie types */}
 </div>
)

export function PrivacyTerms({ open, onClose }: PrivacyTermsProps) {
 const [currentView, setCurrentView] = useState<string>('main')

 const getContent = () => {
   switch (currentView) {
     case 'privacy':
       return <PrivacyContent />
     case 'terms':
       return <TermsContent />
     case 'cookie-notice':
       return <CookieNoticeContent />
     case 'cookie-settings':
       return <CookieSettingsContent />
     default:
       return null
   }
 }

 const menuItems = [
   { id: 'privacy', title: 'Privacy Notice' },
   { id: 'terms', title: 'Terms of Service' },
   { id: 'cookie-notice', title: 'Cookie Notice' },
   { id: 'cookie-settings', title: 'Cookie Settings' }
 ]

 return (
   <Dialog open={open} onOpenChange={onClose}>
     <DialogContent className="max-w-[700px] max-h-[400px] rounded-3xl">
       {currentView === 'main' ? (
         <>
           <DialogHeader>
             <DialogTitle className="text-2xl font-medium">
               Our dedication to your data privacy and security
             </DialogTitle>
           </DialogHeader>
           <div className="mt-6 space-y-2">
             {menuItems.map((item) => (
               <button
                 key={item.id}
                 onClick={() => setCurrentView(item.id)}
                 className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
               >
                 <span className="text-lg">{item.title}</span>
                 <ChevronRight />
               </button>
             ))}
           </div>
         </>
       ) : (
         <div>
           <button 
             onClick={() => setCurrentView('main')}
             className="flex items-center gap-2 mb-6 hover:text-gray-600 transition-colors"
           >
             <ArrowLeft size={20} />
             <span>Back</span>
           </button>
           <DialogHeader>
             <DialogTitle className="text-2xl font-medium mb-6">
               {menuItems.find(item => item.id === currentView)?.title}
             </DialogTitle>
           </DialogHeader>
           {getContent()}
         </div>
       )}
     </DialogContent>
   </Dialog>
 )
}