import { defineProject } from '../types'
import { Articles } from './collections/Articles'
import { Internships } from './collections/Internships'
import { Projects } from './collections/Projects'
import { Roles } from './collections/Roles'
import { Skills } from './collections/Skills'
import { Contact } from './globals/Contact'
import { Education } from './globals/Education'
import { Game } from './globals/Game'
import { Profile } from './globals/Profile'
import { Resume } from './globals/Resume'
import { Site } from './globals/Site'
import { Errors, Events, Visits } from './monitoring/collections'
import { endpoints } from './monitoring/endpoints'

const admin = '/projects/portfolio/admin'

export const portfolio = defineProject({
  slug: 'portfolio',
  label: 'Portfolio',
  collections: [Projects, Roles, Internships, Skills, Articles, Visits, Events, Errors],
  globals: [Site, Game, Profile, Resume, Education, Contact],
  endpoints,
  admin: {
    beforeDashboard: [`${admin}/Pulse#Pulse`],
    beforeNavLinks: [`${admin}/NavLinks#NavLinks`],
    views: {
      portfolioInsights: { Component: `${admin}/Insights#Insights`, path: '/portfolio/insights', meta: { title: 'Portfolio insights' } },
      portfolioHealth: { Component: `${admin}/Health#Health`, path: '/portfolio/health', meta: { title: 'Portfolio health' } },
    },
  },
})
