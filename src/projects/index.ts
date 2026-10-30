import { portfolio } from './portfolio'
import { suite } from './suite'

export const projects = [suite, portfolio]

export const projectCollections = projects.flatMap((p) => p.collections ?? [])
export const projectGlobals = projects.flatMap((p) => p.globals ?? [])
export const projectEndpoints = projects.flatMap((p) => p.endpoints ?? [])

export const projectAdmin = {
  beforeDashboard: projects.flatMap((p) => p.admin?.beforeDashboard ?? []),
  beforeNavLinks: projects.flatMap((p) => p.admin?.beforeNavLinks ?? []),
  views: Object.assign({}, ...projects.map((p) => p.admin?.views ?? {})),
}
