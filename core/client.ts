import type { ClientOptions } from '@logux/client'
import { Client } from '@logux/client'
import { TestPair, TestTime } from '@logux/core'
import { SUBPROTOCOL } from '@slowreader/api'
import { computed, type ReadableAtom } from 'nanostores'

import { onEnvironment } from './environment.js'
import { SlowReaderError } from './error.js'
import { userId } from './settings.js'

let testTime: TestTime | undefined

export function enableTestTime(): TestTime {
  testTime = new TestTime()
  return testTime
}

function getServer(): ClientOptions['server'] {
  return testTime ? new TestPair().left : 'ws://localhost:31337/'
}

let prevClient: Client | undefined
export let client: ReadableAtom<Client | undefined>

onEnvironment(({ logStoreCreator }) => {
  client = computed(userId, user => {
    prevClient?.destroy()

    if (user) {
      let logux = new Client({
        prefix: 'slowreader',
        server: getServer(),
        store: logStoreCreator(),
        subprotocol: SUBPROTOCOL,
        time: testTime,
        userId: user
      })
      logux.start(false)
      prevClient = logux
      return logux
    } else {
      return undefined
    }
  })
  return () => {
    prevClient?.destroy()
  }
})

export function getClient(): Client {
  let logux = client.get()
  if (!logux) {
    throw new SlowReaderError('NoClient')
  }
  return logux
}
