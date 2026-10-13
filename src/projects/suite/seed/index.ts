import { getPayload } from 'payload'

import config from '../../../payload.config'
import type { SuiteCopy } from '../../../payload-types'
import copy from './data/copy.json'

const payload = await getPayload({ config })

await payload.updateGlobal({ slug: 'suite-copy', data: copy as unknown as Partial<SuiteCopy> })
payload.logger.info('suite-copy')

process.exit(0)
