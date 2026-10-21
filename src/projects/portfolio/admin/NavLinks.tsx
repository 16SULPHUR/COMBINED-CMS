'use client'

import { Link, NavGroup } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React from 'react'

const links = [
  { href: '/admin/portfolio/insights', label: 'Insights' },
  { href: '/admin/portfolio/health', label: 'Health' },
]

export const NavLinks = () => {
  const pathname = usePathname()
  return (
    <NavGroup label="Portfolio monitoring">
      {links.map((l) =>
        pathname === l.href ? (
          <div key={l.href} className="nav__link">
            <div className="nav__link-indicator" />
            <span className="nav__link-label">{l.label}</span>
          </div>
        ) : (
          <Link key={l.href} className="nav__link" href={l.href} prefetch={false}>
            <span className="nav__link-label">{l.label}</span>
          </Link>
        ),
      )}
    </NavGroup>
  )
}
