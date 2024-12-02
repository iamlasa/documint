'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQProps {
  id?: string;
  dialogOpen: boolean;
}

export function FAQ({ id, dialogOpen }: FAQProps) {
  const faqs = [
   {
     question: "How secure is Documint?",
     answer: "We use Firebase Authentication to protect user accounts and role-based access control for team collaboration. Your API keys are stored securely and used only for communicating with Contentful."
   },
    {
      question: "Can non-technical users use Documint?",
      answer: "Yes! Our intuitive interface is designed to be easy for anyone to navigate, regardless of technical background."
    },
    {
      question: "Does Documint support CMS platforms other than Contentful?",
      answer: "Currently, we focus on Contentful CMS, but we plan to support additional platforms in future updates."
    },
    {
      question: "Can I preview changes before saving them?",
      answer: "Absolutely! You can preview bulk replacements and individual edits to ensure everything looks perfect before saving."
    },
    {
      question: "What happens if something goes wrong during an update?",
      answer: "Documint provides detailed logs and alerts if updates fail, so you'll know exactly what needs fixing."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a free trial with limited usage so you can explore Documint's features risk-free."
    },
    {
      question: "Can I collaborate with my team?",
      answer: "Yes! Documint supports role-based access control so your team can work together efficiently and securely."
    },
    {
      question: "What are your pricing options?",
      answer: "We offer flexible plans based on the number of API requests and team members. Contact us for custom pricing for agencies or large teams."
    }
  ]

  return (
    <section id={id} className={cn(
      "scroll-mt-16 py-24 transition-colors duration-200",
      dialogOpen ? "bg-[#F3F3F3]" : "bg-white"
    )}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-medium mb-16">FAQ</h2>
          
          <div>
            {faqs.map((faq, index) => (
              <details 
                key={index} 
                className="group rounded-2xl p-4 hover:bg-[#F5F5F5] transition-colors"
              >
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="text-medium text-black-600 font-medium">{faq.question}</h3>
                  <ChevronDown 
                    className="h-5 w-5 transition-transform group-open:rotate-180" 
                  />
                </summary>
                <p className="mt-4 text-gray-500 text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
 }