import type { ArrayField, Field, GlobalConfig } from 'payload'

import { globalVersions, livePreview, publicRead, text, toggle } from '../fields'

const group = (name: string, label: string, fields: Field[], description?: string): Field => ({
  name,
  label,
  type: 'group',
  fields,
  ...(description ? { admin: { description } } : {}),
})

const sign = (name: string, label: string, title: string, sub: string, dock: string): Field =>
  group(name, label, [
    {
      type: 'row',
      fields: [text('title', title), text('sub', sub), text('dock', dock, 'Name in the bottom bar')],
    },
  ])

const postcard = (name: string, label: string, d: { title: string; body: string; sign: string; to: string[] }): Field =>
  group(name, label, [
    text('title', d.title),
    { name: 'body', type: 'textarea', defaultValue: d.body },
    {
      type: 'row',
      fields: [
        text('sign', d.sign, 'Signed by'),
        { name: 'to', label: 'Address lines', type: 'text', hasMany: true, defaultValue: d.to },
      ],
    },
  ])

const mainCards = [
  { label: 'Intro', value: 'intro' },
  { label: 'Work (one card per role)', value: 'work' },
  { label: 'Internships', value: 'internships' },
  { label: 'Projects bundle', value: 'projects' },
  { label: 'Stack', value: 'stack' },
  { label: 'Writing (first article)', value: 'writing' },
  { label: 'Education', value: 'education' },
  { label: 'Contact letter', value: 'contact' },
]

const mainLine: ArrayField = {
  name: 'mainLine',
  label: 'Main line',
  type: 'array',
  admin: {
    description: 'The cards on the main line, left to right. Drag to reorder, untick to take a card down.',
    initCollapsed: true,
    components: { RowLabel: '/projects/portfolio/admin/RowLabels#MainLineRow' },
  },
  defaultValue: [
    { card: 'intro', label: 'Intro', show: true },
    { card: 'work', label: 'Work', show: true },
    { card: 'internships', show: true },
    { card: 'projects', label: 'Projects', show: true },
    { card: 'stack', label: 'Stack', show: true },
    { card: 'writing', label: 'Writing', show: true },
    { card: 'education', label: 'Education', show: true },
    { card: 'contact', label: 'Contact', show: true },
  ],
  validate: (rows: unknown) => {
    if (!Array.isArray(rows)) return true
    const seen = new Set<string>()
    for (const row of rows as { card?: string }[]) {
      if (row.card && seen.has(row.card)) return `"${row.card}" is on the line twice`
      if (row.card) seen.add(row.card)
    }
    return true
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'card', type: 'select', required: true, options: mainCards },
        { name: 'label', type: 'text', admin: { description: 'Name in the bottom bar, empty to leave it out' } },
        { name: 'show', type: 'checkbox', label: 'Show', defaultValue: true },
      ],
    },
  ],
}

const presets: ArrayField = {
  name: 'presets',
  label: 'Clock presets',
  type: 'array',
  defaultValue: [
    { name: 'Dawn', hour: 6.25 },
    { name: 'Morning', hour: 9 },
    { name: 'Noon', hour: 13 },
    { name: 'Golden', hour: 17 },
    { name: 'Dusk', hour: 18.5 },
    { name: 'Night', hour: 22.5 },
  ],
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'hour', type: 'number', required: true, min: 0, max: 23.75, admin: { step: 0.25 } },
      ],
    },
  ],
}

export const Site: GlobalConfig = {
  slug: 'portfolio-site',
  label: 'Site settings',
  access: publicRead,
  versions: globalVersions,
  admin: {
    description: 'Everything on the site that is not a project, role or resume entry: labels, card order, sound, sky, the style switch and tracking.',
    livePreview: livePreview(),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Line and cards',
          fields: [
            group('brand', 'Name tag', [
              {
                type: 'row',
                fields: [
                  text('name', 'Ankit Patil'),
                  text('main', 'portfolio', 'Shown on the main line'),
                  text('projects', 'projects', 'Shown on the projects line'),
                ],
              },
            ]),
            mainLine,
            group('projectsLine', 'Projects line', [
              sign('work', 'Work sign', 'At work', 'built at WeframeTech', 'At WeframeTech'),
              sign('side', 'Side projects sign', 'Side projects', 'built for fun, used for real', 'Side projects'),
              sign('back', 'Back tag', '↓ back down', 'to the main line', 'Main line'),
            ]),
            group('hint', 'Drift hint', [
              { type: 'row', fields: [text('mouse', 'scroll to drift along the line →'), text('touch', 'swipe to drift along the line ←')] },
            ]),
            group('cards', 'Card text', [
              group('bundle', 'Projects bundle', [
                {
                  type: 'row',
                  fields: [
                    text('title', 'Projects'),
                    text('count', '{n} on the upper line', '{n} becomes the number of projects'),
                    text('cta', 'tap to float up'),
                  ],
                },
              ]),
              group('stack', 'Stack', [
                { type: 'row', fields: [text('title', 'Stack'), text('logo', 'AP', 'Letters on the laptop lid')] },
                {
                  name: 'stickers',
                  label: 'Extra stickers',
                  type: 'array',
                  defaultValue: [
                    { text: 'works on my machine ✓', tilt: -6 },
                    { text: '200 OK', tilt: 5 },
                  ],
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'text', type: 'text', required: true },
                        { name: 'tilt', type: 'number', defaultValue: 0, min: -20, max: 20, admin: { description: 'Degrees' } },
                      ],
                    },
                  ],
                },
              ]),
              group('internships', 'Internships', [{ type: 'row', fields: [text('title', 'Internships'), text('year', '2024')] }]),
              group('writing', 'Writing', [{ type: 'row', fields: [text('byline', 'by Ankit Patil'), text('cta', 'Read the post ↗')] }]),
              group('contact', 'Contact letter', [
                { type: 'row', fields: [text('to', 'To: you'), text('from', 'from Ankit Patil'), text('stamp', 'AP')] },
                { type: 'row', fields: [text('copy', 'Copy email'), text('copied', 'Copied'), text('copyFailed', 'Select and copy')] },
              ]),
              group('preview', 'Open card', [text('back', '← Back')]),
            ]),
          ],
        },
        {
          label: 'Resume',
          fields: [
            group('resume', 'Resume popup', [
              {
                type: 'row',
                fields: [toggle('share', 'Show Share', true), toggle('download', 'Show Download PDF', true)],
              },
              {
                type: 'row',
                fields: [text('shareLabel', 'Share'), text('copiedLabel', 'Link copied'), text('downloadLabel', 'Download PDF')],
              },
              text('downloadHint', 'Opens the print dialog, choose Save as PDF'),
              {
                name: 'pdf',
                label: 'PDF file',
                type: 'upload',
                relationTo: 'media',
                admin: { description: 'Optional. When set, Download PDF opens this file instead of the print dialog.' },
              },
              group('headings', 'Section headings', [
                {
                  type: 'row',
                  fields: [
                    text('skills', 'Technical Skills'),
                    text('experience', 'Experience'),
                    text('projects', 'Projects'),
                    text('education', 'Education'),
                  ],
                },
              ]),
            ]),
          ],
        },
        {
          label: 'Sound and sky',
          fields: [
            group('music', 'Music', [
              {
                type: 'row',
                fields: [
                  toggle('enabled', 'Play the ambient music', true),
                  toggle('muted', 'Start muted', false),
                  toggle('clicks', 'Soft click when cards move', true),
                ],
              },
              { name: 'volume', type: 'number', defaultValue: 55, min: 0, max: 100, admin: { description: 'Starting volume, 0 to 100' } },
            ]),
            group('sky', 'Sky and clock', [
              { type: 'row', fields: [toggle('clock', 'Show the clock', true)] },
              {
                type: 'row',
                fields: [
                  {
                    name: 'mode',
                    type: 'select',
                    defaultValue: 'live',
                    options: [
                      { label: "Follow the visitor's local time", value: 'live' },
                      { label: 'Always the same time', value: 'fixed' },
                    ],
                  },
                  { name: 'hour', type: 'number', defaultValue: 17, min: 0, max: 23.75, admin: { step: 0.25, description: 'Used when the time is fixed, e.g. 17.5 is 5:30 PM' } },
                ],
              },
              { type: 'row', fields: [text('title', 'what time is it?'), text('live', 'Live, your local time')] },
              presets,
            ]),
          ],
        },
        {
          label: 'Styles',
          description: 'The switch between the card site and the island game.',
          fields: [
            group('styles', 'Style switch', [
              {
                type: 'row',
                fields: [
                  {
                    name: 'default',
                    label: 'Opens with',
                    type: 'select',
                    defaultValue: 'cards',
                    options: [
                      { label: 'Cards on the clothesline', value: 'cards' },
                      { label: 'Island game', value: 'island' },
                    ],
                  },
                  {
                    name: 'transition',
                    type: 'select',
                    defaultValue: 'postcard',
                    options: [
                      { label: 'Postcard', value: 'postcard' },
                      { label: 'Fade', value: 'fade' },
                      { label: 'None', value: 'none' },
                    ],
                  },
                ],
              },
              {
                type: 'row',
                fields: [toggle('switch', 'Show the switch', true), toggle('remember', "Remember each visitor's choice", false)],
              },
              group('labels', 'Switch labels', [{ type: 'row', fields: [text('cards', 'Cards'), text('island', 'Island')] }]),
              group(
                'postcard',
                'Postcard',
                [
                  postcard('island', 'Going to the island', {
                    title: 'Greetings from Localhost!',
                    body: 'The projects roam free here, the marsh is full of bugs, and a boat leaves whenever you like. Come say hi.',
                    sign: 'Moss',
                    to: ['To: you', '127.0.0.1', 'Localhost Island'],
                  }),
                  postcard('cards', 'Going back to the cards', {
                    title: 'Back to the clothesline!',
                    body: 'Thanks for visiting the island. The cards are hanging right where you left them.',
                    sign: 'Moss',
                    to: ['To: you', 'The clothesline', 'First peg on the left'],
                  }),
                ],
                'The card that flips over during the postcard transition.',
              ),
            ]),
          ],
        },
        {
          label: 'Notice',
          fields: [
            group('banner', 'Banner', [
              { type: 'row', fields: [toggle('show', 'Show the banner', false)] },
              text('text', undefined, 'e.g. "New post: Stripe SEPA payments in Medusa v2"'),
              { type: 'row', fields: [text('linkLabel'), text('linkHref')] },
              { name: 'until', type: 'date', admin: { description: 'Optional. Hides itself after this day.', date: { pickerAppearance: 'dayOnly' } } },
            ]),
            group('notFound', 'Page not found', [
              { type: 'row', fields: [text('title', '404'), text('text', 'Oops! Page not found'), text('link', 'Return to Home')] },
            ]),
          ],
        },
        {
          label: 'SEO',
          description: 'Read when the site is built. Empty fields keep what the site already has. Rebuild the site after changing them.',
          fields: [
            group('seo', 'Search and link previews', [
              text('title'),
              { name: 'description', type: 'textarea' },
              { name: 'image', label: 'Link preview image', type: 'upload', relationTo: 'media', admin: { description: '1200 × 630' } },
            ]),
          ],
        },
        {
          label: 'Tracking',
          description: 'Visits and clicks go to Portfolio logs and the Insights page. No IP addresses or cookies are stored.',
          fields: [
            group('tracking', 'Tracking', [
              {
                type: 'row',
                fields: [
                  toggle('enabled', 'Record visits', true),
                  toggle('clicks', 'Record opened cards and links', true),
                  toggle('game', 'Record island game moves', true),
                ],
              },
              {
                type: 'row',
                fields: [
                  toggle('vitals', 'Record page speed', true),
                  toggle('errors', 'Record site errors', true),
                  toggle('dnt', 'Skip visitors with Do Not Track', true),
                ],
              },
              {
                name: 'retention',
                label: 'Keep data for (days)',
                type: 'number',
                defaultValue: 365,
                min: 7,
                max: 1095,
              },
              {
                name: 'origins',
                label: 'Sites allowed to send data',
                type: 'text',
                hasMany: true,
                defaultValue: ['https://ankit.varietyheaven.in', 'https://ankit.ninja', 'http://localhost:5173', 'http://localhost:8080'],
                admin: { description: 'Origins, e.g. https://ankit.ninja. Anything else is ignored.' },
              },
              toggle('legacyWorker', 'Also send visits to the old Cloudflare worker', true, 'portfolio-worker.varietyheaven.in, with its own dashboard and daily Discord summary'),
            ]),
          ],
        },
      ],
    },
  ],
}
