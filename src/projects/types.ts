import type { CollectionConfig, GlobalConfig } from 'payload'

export type CMSProject = {
  slug: string
  label: string
  collections?: CollectionConfig[]
  globals?: GlobalConfig[]
}

// Enforces the `<project>-` slug prefix and groups the project's content in the admin sidebar.
export const defineProject = (project: CMSProject): CMSProject => {
  const withGroup = <T extends { slug: string; admin?: object }>(item: T): T => {
    if (!item.slug.startsWith(`${project.slug}-`)) {
      throw new Error(`"${item.slug}" must be prefixed with "${project.slug}-"`)
    }
    return { ...item, admin: { group: project.label, ...item.admin } }
  }

  return {
    ...project,
    collections: project.collections?.map(withGroup),
    globals: project.globals?.map(withGroup),
  }
}
