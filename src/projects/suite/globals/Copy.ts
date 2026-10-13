import type { Field, GlobalConfig, TextareaField, TextField } from 'payload'

const publicRead = { read: () => true }

const text = (name: string, required = true): TextField => ({ name, type: 'text', required })
const area = (name: string, required = true): TextareaField => ({
  name,
  type: 'textarea',
  required,
})
const group = (name: string, description: string, fields: Field[]): Field => ({
  name,
  type: 'group' as const,
  admin: { description },
  fields,
})

const tones = ['cloth', 'gold', 'cotton', 'rose', 'rani', 'night', 'leaf']
const fabrics = [
  'paisleyIndigo',
  'paisleyNight',
  'paisleyRani',
  'paisleyGold',
  'paisleyLeaf',
  'paisleyRose',
  'paisleyCloth',
  'starCloth',
  'starNight',
  'starLeaf',
]

// The showcase site's visuals are drawn in code, so scene slugs and icon names must match what the site knows.
export const Copy: GlobalConfig = {
  slug: 'suite-copy',
  label: 'Site copy',
  access: publicRead,
  fields: [
    group(
      'seo',
      'Page title and link previews (read when the site is built, so redeploy after changing)',
      [text('title'), area('description'), text('shareTitle'), area('shareDescription')],
    ),
    group('header', 'Top bar', [
      text('brandLabel'),
      text('tillLink'),
      text('demoCta'),
      text('demoCtaShort'),
      {
        name: 'nav',
        type: 'array',
        required: true,
        fields: [
          text('label'),
          { ...text('href'), admin: { description: 'Section anchor such as #day' } },
        ],
      },
    ]),
    group('hero', 'Top of the page', [
      text('eyebrow'),
      text('titleLead'),
      text('titleHighlight'),
      text('titleTail'),
      area('body'),
      text('primaryCta'),
      text('secondaryCta'),
      text('aside'),
      text('pickerLabel'),
    ]),
    group('day', 'Intro to the day at the counter', [
      text('eyebrow'),
      text('title'),
      area('body'),
      text('badge'),
    ]),
    {
      name: 'scenes',
      type: 'array',
      required: true,
      admin: {
        description:
          'One row per scene, in page order. The picture beside each scene is picked by its slug.',
      },
      fields: [
        {
          name: 'slug',
          type: 'select',
          required: true,
          options: ['scan', 'print', 'link', 'supplier', 'stickers', 'dues', 'close', 'gst'],
        },
        { name: 'tone', type: 'select', required: true, options: tones },
        { name: 'flip', type: 'checkbox', label: 'Picture on the left' },
        text('kicker'),
        text('title'),
        area('lead'),
        {
          name: 'points',
          type: 'array',
          fields: [text('lead'), text('text')],
        },
        {
          name: 'minutes',
          type: 'number',
          admin: {
            description:
              'Minutes after midnight for the wall clock, e.g. 680 is 11:20 AM. Leave empty to use the time text.',
          },
        },
        text('timeText', false),
        text('periodText', false),
      ],
    },
    group('yours', 'Make it yours section', [
      text('eyebrow'),
      text('title'),
      area('body'),
      {
        name: 'tabs',
        type: 'array',
        required: true,
        fields: [
          {
            name: 'key',
            type: 'select',
            required: true,
            options: ['details', 'gst', 'stickers', 'values'],
          },
          text('label'),
          text('title'),
          area('text'),
        ],
      },
      text('fixedLead'),
      area('fixedText'),
      text('fixedCta'),
    ]),
    group('shelf', 'The rest of the shelf', [
      text('eyebrow'),
      text('title'),
      area('body'),
      {
        name: 'swatches',
        type: 'array',
        required: true,
        fields: [
          {
            name: 'icon',
            type: 'select',
            required: true,
            options: [
              'creditCard',
              'qrCode',
              'repeat',
              'clipboard',
              'book',
              'users',
              'calendar',
              'phone',
            ],
          },
          text('title'),
          area('text'),
          { name: 'fabric', type: 'select', required: true, options: fabrics },
        ],
      },
    ]),
    group('wired', 'What you need', [
      text('eyebrow'),
      text('title'),
      area('body'),
      {
        name: 'links',
        type: 'array',
        required: true,
        fields: [
          {
            name: 'icon',
            type: 'select',
            required: true,
            options: ['phone', 'monitor', 'printer', 'tag'],
          },
          text('title'),
          area('text'),
        ],
      },
      text('noteLead'),
      area('noteText'),
    ]),
    group('pricing', 'Price tags', [
      text('eyebrow'),
      text('title'),
      area('body'),
      text('badge'),
      {
        name: 'plans',
        type: 'array',
        required: true,
        fields: [
          text('name'),
          text('price'),
          text('period', false),
          text('description'),
          { name: 'features', type: 'text', hasMany: true, required: true },
          text('cta'),
          { name: 'featured', type: 'checkbox' },
        ],
      },
    ]),
    group('faq', 'Questions', [
      text('eyebrow'),
      text('title'),
      area('body'),
      text('cta'),
      { name: 'items', type: 'array', required: true, fields: [text('q'), area('a')] },
    ]),
    group('footer', 'Bottom of the page', [
      text('badge'),
      text('title'),
      area('body'),
      text('primaryCta'),
      text('secondaryCta'),
      text('tagline'),
      text('copyright'),
    ]),
  ],
}
