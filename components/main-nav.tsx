'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function MainNav() {
  const pathname = usePathname()

  const items = [
    {
      title: 'Spaces',
      href: '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      title: 'Teams',
      href: '/dashboard/teams',
      active: pathname === '/dashboard/teams',
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            item.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}