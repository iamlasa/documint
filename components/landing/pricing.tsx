import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Check, X } from 'lucide-react'

interface PricingProps {
  id?: string;
}

export function Pricing({ id }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id={id} className="scroll-mt-16 py-16 px-4">
     <div className="container mx-auto max-w-6xl">
       <div className="flex justify-center mb-8">
         <div className="bg-gray-100 rounded-3xl p-3.5 flex items-center gap-2">
           <span className={`text-sm ${!isYearly ? 'text-black' : 'text-gray-500'}`}>Monthly</span>
           <Switch 
             checked={isYearly} 
             onCheckedChange={setIsYearly}
           />
           <span className={`text-sm ${isYearly ? 'text-black' : 'text-gray-500'}`}>
             Save €60 per user / year with annual plan
           </span>
         </div>
       </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="bg-[#F3F4F6] text-black rounded-3xl p-8">
            <h3 className="text-xl font-medium mb-4">Free</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">$0</span>
            </div>
            
            <ul className="space-y-4 mb-8 min-h-[300px]">
            <li className="flex gap-2 border-b pb-4">
            <Check size={17} />
            <span className="text-sm">1 Contentful space</span>
            </li>
            <li className="flex gap-2 border-b pb-4">
            <Check size={17} />
                <span className="text-sm">Basic search functionality</span>
              </li>
              <li className="flex gap-2 border-b pb-4">
            <Check size={17} />
                <span className="text-sm">Up to 100 entries</span>
              </li>
              <li className="flex gap-2 border-b pb-4">
            <Check size={17} />
                <span className="text-sm">Email support</span>
              </li>
            </ul>

            <button className="w-full py-2 bg-black text-white rounded-3xl hover:bg-gray-800 transition-colors">
              Start for free
            </button>
          </div>

          {/* Professional Tier */}
          <div className="bg-[#F3F4F6] text-black rounded-3xl p-8">
            <h3 className="text-xl font-medium mb-4">Professional</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">{isYearly ? '48' : '60'}</span>
              <span className="text-gray-400">/month</span>
            </div>
            <p className="text-gray-400 mb-8">{isYearly ? 'billed yearly' : 'billed monthly'}</p>
            
            <ul className="space-y-4 mb-8">
            <li className="flex gap-2 border-b pb-4">
            <Check size={17} />
                <span className="text-sm">3 Contentful spaces</span>
              </li>
              <li className="flex gap-2 border-b pb-4">
              <Check size={17} />
                <span className="text-sm">Advanced search</span>
              </li>
              <li className="flex gap-2 border-b pb-4">
              <Check size={17} />
                <span className="text-sm">Unlimited entries</span>
              </li>
              <li className="flex gap-2 border-b pb-4">
              <Check size={17} />
                <span className="text-sm">Bulk operations</span>
              </li>
              <li className="flex gap-2 border-b pb-4 last:border-b-0">
              <Check size={17} />
                <span className="text-sm">Unlimited spaces</span>
              </li>
            </ul>

            <button className="w-full py-2 bg-black text-white rounded-3xl hover:bg-gray-800 transition-colors">
              Get started
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-[#F3F4F6] text-black rounded-3xl p-8">
            <h3 className="text-xl font-medium mb-4">Enterprise</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">Custom</span>
            </div>
            <p className="text-gray-600 mb-8">Contact sales</p>
            
            <ul className="space-y-4 mb-8">
            <li className="flex gap-2 border-b pb-4 last:border-b-0">
            <Check size={17} />
                <span className="text-sm">Unlimited spaces</span>
              </li>
              <li className="flex gap-2 border-b pb-4 last:border-b-0">
              <Check size={17} />
                <span className="text-sm">Custom features</span>
              </li>
              <li className="flex gap-2 border-b pb-4 last:border-b-0">
              <Check size={17} />
                <span className="text-sm">API access</span>
              </li>
              <li className="flex gap-2 border-b pb-4 last:border-b-0">
              <Check size={17} />
                <span className="text-sm">Dedicated support</span>
              </li>
              <li className="flex gap-2 border-b pb-4 last:border-b-0">
              <Check size={17} />
                <span className="text-sm">Custom integrations</span>
              </li>
            </ul>

            <button className="w-full py-2 bg-black text-white rounded-3xl hover:bg-gray-800 transition-colors">
              Contact sales
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}