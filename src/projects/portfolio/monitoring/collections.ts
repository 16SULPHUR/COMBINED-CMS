import type { CollectionConfig } from 'payload'

import { isAdmin } from '../fields'

const group = 'Portfolio logs'
const readOnly = { readOnly: true }
const logAccess = { read: isAdmin, create: () => false, update: () => false, delete: isAdmin }

export const Visits: CollectionConfig = {
  slug: 'portfolio-visits',
  labels: { singular: 'Visit', plural: 'Visits' },
  access: logAccess,
  admin: {
    group,
    useAsTitle: 'label',
    defaultColumns: ['label', 'startedAt', 'landing', 'duration', 'actions'],
    description: 'One row per visit to the portfolio. What each visitor opened is listed inside the visit.',
  },
  fields: [
    { name: 'label', type: 'text', admin: readOnly },
    { name: 'sid', type: 'text', required: true, unique: true, admin: { ...readOnly, hidden: true } },
    { name: 'visitor', type: 'text', index: true, admin: { ...readOnly, description: 'Anonymous id that changes every day. No IP address is stored.' } },
    {
      type: 'row',
      fields: [
        { name: 'startedAt', type: 'date', index: true, admin: { ...readOnly, date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'lastSeenAt', type: 'date', index: true, admin: { ...readOnly, date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'duration', type: 'number', admin: { ...readOnly, description: 'Seconds on the page' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'views', type: 'number', defaultValue: 0, admin: readOnly },
        { name: 'actions', type: 'number', defaultValue: 0, admin: readOnly },
        { name: 'returning', label: 'Came back', type: 'checkbox', admin: { ...readOnly, description: 'Same browser and network visited earlier that day' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'landing', type: 'text', admin: readOnly },
        { name: 'source', type: 'text', index: true, admin: readOnly },
        { name: 'referrer', type: 'text', admin: readOnly },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'country', type: 'text', index: true, admin: readOnly },
        { name: 'region', type: 'text', admin: readOnly },
        { name: 'city', type: 'text', admin: readOnly },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'device', type: 'text', admin: readOnly },
        { name: 'browser', type: 'text', admin: readOnly },
        { name: 'os', type: 'text', admin: readOnly },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'screen', type: 'text', admin: readOnly },
        { name: 'language', type: 'text', admin: readOnly },
        { name: 'timezone', type: 'text', admin: readOnly },
        { name: 'style', type: 'text', admin: readOnly },
      ],
    },
    {
      name: 'events',
      type: 'join',
      collection: 'portfolio-events',
      on: 'visit',
      defaultSort: 'createdAt',
      defaultLimit: 50,
      admin: { defaultColumns: ['createdAt', 'type', 'target', 'label'] },
    },
  ],
}

export const Events: CollectionConfig = {
  slug: 'portfolio-events',
  labels: { singular: 'Event', plural: 'Events' },
  access: logAccess,
  admin: {
    group,
    useAsTitle: 'target',
    defaultColumns: ['createdAt', 'type', 'target', 'label', 'path'],
    description: 'Everything visitors did: pages, opened cards, links, resume, style switches, island game moves and page speed.',
  },
  fields: [
    { name: 'visit', type: 'relationship', relationTo: 'portfolio-visits', index: true, admin: readOnly },
    {
      type: 'row',
      fields: [
        { name: 'type', type: 'text', required: true, index: true, admin: readOnly },
        { name: 'target', type: 'text', index: true, admin: readOnly },
        { name: 'label', type: 'text', admin: readOnly },
      ],
    },
    { type: 'row', fields: [{ name: 'path', type: 'text', admin: readOnly }, { name: 'value', type: 'number', admin: readOnly }] },
    { name: 'meta', type: 'json', admin: readOnly },
  ],
}

export const Errors: CollectionConfig = {
  slug: 'portfolio-errors',
  labels: { singular: 'Site error', plural: 'Site errors' },
  access: { ...logAccess, update: isAdmin },
  admin: {
    group,
    useAsTitle: 'message',
    defaultColumns: ['message', 'kind', 'count', 'lastSeen', 'resolved'],
    description: 'Errors visitors hit on the portfolio, grouped by message. Tick Resolved once fixed; it reopens if it happens again.',
  },
  fields: [
    { name: 'fingerprint', type: 'text', required: true, unique: true, admin: { ...readOnly, hidden: true } },
    { name: 'message', type: 'text', required: true, admin: readOnly },
    {
      type: 'row',
      fields: [
        { name: 'kind', type: 'text', admin: readOnly },
        { name: 'count', type: 'number', defaultValue: 1, admin: readOnly },
        { name: 'firstSeen', type: 'date', admin: { ...readOnly, date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'lastSeen', type: 'date', index: true, admin: { ...readOnly, date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { type: 'row', fields: [{ name: 'path', type: 'text', admin: readOnly }, { name: 'browser', type: 'text', admin: readOnly }] },
    { name: 'stack', type: 'textarea', admin: readOnly },
    { name: 'resolved', type: 'checkbox', defaultValue: false, index: true, admin: { position: 'sidebar' } },
  ],
}
