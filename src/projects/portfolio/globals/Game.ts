import type { ArrayField, Field, GlobalConfig } from 'payload'

import { globalVersions, group, livePreview, publicRead, text } from '../fields'
import { gameDefaults as d } from './gameDefaults'

const rowLabel = { RowLabel: '/projects/portfolio/admin/RowLabels#NamedRow' }

const bugIds = ['n-plus-one', 'slow-query', 'double-charge', 'webhook-storm', 'prompt-injection']

const key = (description: string): Field => ({
  name: 'key',
  type: 'text',
  admin: { readOnly: true, description },
})

const area = (name: string, label?: string, defaultValue?: string): Field => ({
  name,
  type: 'textarea',
  defaultValue,
  admin: { rows: 2 },
  ...(label ? { label } : {}),
})

const typeKey = (name = 'type'): Field => ({
  name,
  type: 'text',
  admin: { description: 'Type key, e.g. data' },
})

const lines = (name: string, label: string, defaultValue?: { line: string }[]): ArrayField => ({
  name,
  label,
  type: 'array',
  defaultValue,
  labels: { singular: 'Line', plural: 'Lines' },
  admin: { components: rowLabel },
  fields: [{ name: 'line', type: 'textarea', required: true, admin: { rows: 2 } }],
})

const answers = (name: string): ArrayField => ({
  name,
  label: 'Answers',
  type: 'array',
  labels: { singular: 'Answer', plural: 'Answers' },
  admin: { components: rowLabel, initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [text('label'), typeKey(), { name: 'ok', label: 'Right answer', type: 'checkbox' }],
    },
    area('text', 'What happens'),
  ],
})

const listOf = (
  name: string,
  label: string,
  description: string,
  fields: Field[],
  defaultValue?: unknown[],
): ArrayField => ({
  name,
  label,
  type: 'array',
  defaultValue,
  admin: { components: rowLabel, initCollapsed: true, description },
  fields,
})

const labels: Record<string, string> = {
  meet: 'A project appears',
  meetBug: 'A bug appears',
  challenge: 'A trainer challenges you',
  sendOut: 'The trainer sends in a creature',
  mossIn: 'Moss steps in',
  prompt: 'Your turn',
  packetPrompt: 'Pick a packet',
  inspect: 'Looking at a creature',
  ping: 'Ping',
  pickFix: 'Pick a fix',
  pickCounter: 'Pick a counter',
  tries: 'Moss tries a move',
  rootCause: 'Right answer',
  noEffect: 'Wrong answer',
  hitsBack: 'The other side hits back',
  lands: 'A move lands',
  patched: 'A bug is patched',
  outOfSteam: 'The other side runs out of steam',
  mossDown: 'Moss faints',
  exp: 'EXP gained',
  levelUp: 'Level up',
  run: 'Moss runs away',
  backOff: 'Moss backs off from a bug',
  noRun: "Can't run from a trainer",
  crewNone: 'No crew yet',
  crewAssist: 'The crew rules out an answer',
  crewNothing: 'Nothing left to rule out',
  crewTired: 'The crew has already helped',
  crewGuard: 'The guard points at the answer',
  synFirstAck: 'ACK before saying hi',
  synFirstFin: 'FIN before saying hi',
  synFirstRst: 'RST before saying hi',
  syn: 'Moss sends a SYN',
  lost: 'The reply gets lost',
  retry: 'The project retries',
  synAck: 'The project answers with SYN-ACK',
  ackSyn: 'SYN again instead of ACK',
  ackRst: 'RST instead of ACK',
  ackFin: 'FIN instead of ACK',
  ack: 'Moss sends the ACK',
  connected: 'Connected',
}

const sections: [string, string[]][] = [
  [
    'Meeting creatures and trainers',
    [
      'meet',
      'meetBug',
      'challenge',
      'sendOut',
      'mossIn',
      'prompt',
      'packetPrompt',
      'inspect',
      'ping',
    ],
  ],
  [
    'Battles',
    [
      'pickFix',
      'pickCounter',
      'tries',
      'rootCause',
      'noEffect',
      'hitsBack',
      'lands',
      'patched',
      'outOfSteam',
      'mossDown',
      'exp',
      'levelUp',
      'run',
      'backOff',
      'noRun',
    ],
  ],
  ['Crew', ['crewNone', 'crewAssist', 'crewNothing', 'crewTired', 'crewGuard']],
  [
    'Making friends',
    [
      'synFirstAck',
      'synFirstFin',
      'synFirstRst',
      'syn',
      'lost',
      'retry',
      'synAck',
      'ackSyn',
      'ackRst',
      'ackFin',
      'ack',
      'connected',
    ],
  ],
]

const strings = d.strings as Record<string, string>
const listed = new Set(sections.flatMap(([, keys]) => keys))
const stringFields: Field[] = [
  ...sections,
  ['More', Object.keys(strings).filter((k) => !listed.has(k))] as [string, string[]],
]
  .map(([label, keys]): [string, string[]] => [label, keys.filter((k) => k in strings)])
  .filter(([, keys]) => keys.length > 0)
  .map(([label, keys]) => ({
    type: 'collapsible',
    label,
    admin: { initCollapsed: true },
    fields: keys.map((k): Field => ({
      name: k,
      label: labels[k] ?? k,
      type: 'text',
      defaultValue: strings[k],
    })),
  }))

export const Game: GlobalConfig = {
  slug: 'portfolio-game',
  label: 'Island game',
  access: publicRead,
  versions: globalVersions,
  admin: {
    description:
      'The text of the island game: title screen, creatures, trainers, the health check, battle lines and bugs. Words in braces such as {first}, {moss} or {name} are filled in by the game. Until this is saved once, the island uses its own built-in text.',
    livePreview: livePreview('/island'),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Title and Moss',
          fields: [
            group('title', 'Title screen', [
              {
                type: 'row',
                fields: [text('subtitle', d.title.subtitle), text('tagline', d.title.tagline)],
              },
              area('blurb', 'Blurb', d.title.blurb),
            ]),
            group('moss', 'Moss', [
              {
                type: 'row',
                fields: [
                  text('name', d.moss.name),
                  {
                    name: 'types',
                    type: 'text',
                    hasMany: true,
                    defaultValue: d.moss.types,
                    admin: { description: 'Type keys' },
                  },
                ],
              },
            ]),
            group('exp', 'EXP', [
              {
                type: 'row',
                fields: [
                  {
                    name: 'friend',
                    label: 'For befriending a project',
                    type: 'number',
                    min: 0,
                    defaultValue: d.exp.friend,
                  },
                  {
                    name: 'fix',
                    label: 'For fixing a bug',
                    type: 'number',
                    min: 0,
                    defaultValue: d.exp.fix,
                  },
                ],
              },
            ]),
          ],
        },
        {
          label: 'Creatures',
          fields: [
            listOf(
              'species',
              'Creatures',
              'Each row is one of the island’s creatures. Removing a row puts back the island’s own text for it.',
              [
                {
                  type: 'row',
                  fields: [
                    key('Used by trainers and bugs'),
                    { name: 'no', label: 'Number', type: 'number', min: 0 },
                    text('name'),
                    text('kind'),
                  ],
                },
                {
                  name: 'types',
                  type: 'text',
                  hasMany: true,
                  admin: { description: 'Type keys, e.g. data, net' },
                },
                text('happy', undefined, 'What it does when you befriend it'),
                area('entry', 'Entry'),
              ],
              d.species,
            ),
            listOf(
              'types',
              'Types',
              'Move and creature types. Removing a row puts back the island’s own label and colour.',
              [
                {
                  type: 'row',
                  fields: [
                    key('Used by creatures and answers'),
                    text('label'),
                    text('color', undefined, 'Hex colour, e.g. #4c86d0'),
                  ],
                },
              ],
              d.types,
            ),
          ],
        },
        {
          label: 'Trainers',
          fields: [
            listOf(
              'trainers',
              'Trainers',
              'Each row is one of the island’s trainers. Their place on the map stays in code.',
              [
                {
                  type: 'row',
                  fields: [
                    key('Trainer'),
                    text('name'),
                    text('title'),
                    { name: 'exp', label: 'EXP for beating them', type: 'number', min: 0 },
                  ],
                },
                {
                  name: 'off',
                  label: 'Take this trainer off the island',
                  type: 'checkbox',
                  defaultValue: false,
                },
                group('mon', 'Their creature', [
                  {
                    type: 'row',
                    fields: [
                      {
                        name: 'species',
                        type: 'text',
                        required: true,
                        admin: { description: 'Creature key' },
                      },
                      text('name', undefined, 'Nickname'),
                      { name: 'level', type: 'number', required: true, min: 1 },
                    ],
                  },
                ]),
                lines('intro', 'Before the battle'),
                {
                  type: 'row',
                  fields: [area('win', 'When you win'), area('lose', 'When you lose')],
                },
                lines('again', 'Talking to them again'),
                {
                  name: 'rounds',
                  type: 'array',
                  minRows: 1,
                  labels: { singular: 'Round', plural: 'Rounds' },
                  admin: { components: rowLabel, initCollapsed: true },
                  fields: [
                    { type: 'row', fields: [text('move'), typeKey()] },
                    area('ready', 'Before the move'),
                    {
                      type: 'row',
                      fields: [area('hit', 'After the right answer'), area('hint', 'Hint')],
                    },
                    answers('options'),
                  ],
                },
              ],
              d.trainers,
            ),
          ],
        },
        {
          label: 'Health check',
          fields: [
            group('nurse', 'Health check', [
              text('name', d.nurse.name),
              lines('greet', 'Greeting', d.nurse.greet),
              {
                type: 'row',
                fields: [
                  area('healed', 'After healing', d.nurse.healed),
                  area('full', 'Already healthy', d.nurse.full),
                ],
              },
              lines('wake', 'Waking up after fainting', d.nurse.wake),
            ]),
          ],
        },
        {
          label: 'Battle text',
          fields: [
            group(
              'strings',
              'Battle text',
              stringFields,
              'Lines shown during encounters, battles and the handshake.',
            ),
          ],
        },
        {
          label: 'Bugs',
          fields: [
            listOf(
              'bugs',
              'Bug changes',
              'Bugs are written from your portfolio content. Add a row to change one; empty fields keep the island’s text.',
              [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'key',
                      label: 'Bug',
                      type: 'text',
                      required: true,
                      validate: (v: unknown) =>
                        (typeof v === 'string' && bugIds.includes(v)) ||
                        `Use one of: ${bugIds.join(', ')}`,
                      admin: { description: bugIds.join(', ') },
                    },
                    text('name'),
                    text('attack', undefined, 'Its attack'),
                    typeKey(),
                    { name: 'level', type: 'number', min: 1 },
                  ],
                },
                {
                  name: 'off',
                  label: 'Take this bug off the island',
                  type: 'checkbox',
                  defaultValue: false,
                },
                { type: 'row', fields: [area('intro', 'When it appears'), area('hint', 'Hint')] },
                {
                  type: 'row',
                  fields: [area('win', 'When it is fixed'), area('lesson', 'The lesson')],
                },
                answers('moves'),
              ],
            ),
          ],
        },
      ],
    },
  ],
}
