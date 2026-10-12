import { getPayload, type CollectionSlug, type GlobalSlug, type Payload } from 'payload'

import config from '../../../payload.config'
import articles from './data/articles.json'
import contact from './data/contact.json'
import education from './data/education.json'
import internships from './data/internships.json'
import profile from './data/profile.json'
import projects from './data/projects.json'
import resume from './data/resume.json'
import roles from './data/roles.json'
import skills from './data/skills.json'

type Doc = Record<string, unknown>
type ResumePoint = string | { lead?: string; text: string; link?: { label: string; href: string } }

const toPoints = (points: ResumePoint[]) => points.map((p) => (typeof p === 'string' ? { text: p } : p))

// Upserts by `key` so re-running the seed updates existing entries instead of duplicating them.
const upsert = async (payload: Payload, collection: CollectionSlug, key: string, docs: Doc[]) => {
  for (const data of docs) {
    const { docs: found } = await payload.find({
      collection,
      where: { [key]: { equals: data[key] } },
      limit: 1,
      depth: 0,
    })
    if (found[0]) {
      await payload.update({ collection, id: found[0].id, data })
    } else {
      await payload.create({ collection, data })
    }
  }
  payload.logger.info(`${collection}: ${docs.length}`)
}

const setGlobal = async (payload: Payload, slug: GlobalSlug, data: Doc) => {
  await payload.updateGlobal({ slug, data })
  payload.logger.info(slug)
}

const payload = await getPayload({ config })

await setGlobal(payload, 'portfolio-profile', profile)
await setGlobal(payload, 'portfolio-contact', contact)
await setGlobal(payload, 'portfolio-education', education)
await setGlobal(payload, 'portfolio-resume', {
  ...resume,
  experience: resume.experience.map((e) => ({ ...e, points: toPoints(e.points) })),
  projects: resume.projects.map((p) => ({ ...p, points: toPoints(p.points) })),
})

await upsert(
  payload,
  'portfolio-projects',
  'slug',
  projects.map(({ id, shot, ...p }) => ({
    ...p,
    slug: id,
    shot: { ...shot, lines: shot.lines.map(({ kind, ...line }) => ({ blockType: kind, ...line })) },
  })),
)
await upsert(payload, 'portfolio-roles', 'company', roles)
await upsert(payload, 'portfolio-internships', 'company', internships)
await upsert(payload, 'portfolio-skills', 'name', skills)
await upsert(payload, 'portfolio-articles', 'href', articles)

process.exit(0)
