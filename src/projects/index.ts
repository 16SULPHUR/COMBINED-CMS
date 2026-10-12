import { portfolio } from './portfolio'
import { suite } from './suite'

export const projects = [suite, portfolio]

export const projectCollections = projects.flatMap((p) => p.collections ?? [])
export const projectGlobals = projects.flatMap((p) => p.globals ?? [])
