import { defineProject } from '../types'
import { Articles } from './collections/Articles'
import { Internships } from './collections/Internships'
import { Projects } from './collections/Projects'
import { Roles } from './collections/Roles'
import { Skills } from './collections/Skills'
import { Contact } from './globals/Contact'
import { Education } from './globals/Education'
import { Profile } from './globals/Profile'
import { Resume } from './globals/Resume'

export const portfolio = defineProject({
  slug: 'portfolio',
  label: 'Portfolio',
  collections: [Projects, Roles, Internships, Skills, Articles],
  globals: [Profile, Resume, Education, Contact],
})
