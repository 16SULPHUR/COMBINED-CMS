import type { CollectionConfig, Config, Endpoint, GlobalConfig } from 'payload'

type AdminComponents = NonNullable<NonNullable<Config['admin']>['components']>

export type CMSProject = {
  slug: string
  label: string
  collections?: CollectionConfig[]
  globals?: GlobalConfig[]
  endpoints?: Endpoint[]
  admin?: Pick<AdminComponents, 'beforeDashboard' | 'beforeNavLinks' | 'views'>
}

// Enforces the `<project>-` slug prefix (and `/<project>/` for endpoints) and groups the project's content in the admin sidebar.
export const defineProject = (project: CMSProject): CMSProject => {
  const withGroup = <T extends { slug: string; admin?: object }>(item: T): T => {
    if (!item.slug.startsWith(`${project.slug}-`)) {
      throw new Error(`"${item.slug}" must be prefixed with "${project.slug}-"`)
    }
    return { ...item, admin: { group: project.label, ...item.admin } }
  }

  project.endpoints?.forEach((e) => {
    if (!e.path.startsWith(`/${project.slug}/`)) {
      throw new Error(`Endpoint "${e.path}" must start with "/${project.slug}/"`)
    }
  })

  return {
    ...project,
    collections: project.collections?.map(withGroup),
    globals: project.globals?.map(withGroup),
  }
}
