import { MemoryStore } from '@logux/core'
import { atom, cleanStores } from 'nanostores'
import { fail } from 'node:assert'

import {
  type BaseRoute,
  Category,
  client,
  enableTestTime,
  type EnvironmentAndStore,
  Feed,
  Filter,
  Post,
  setupEnvironment,
  userId
} from '../index.js'

export function enableClientTest(env: Partial<EnvironmentAndStore> = {}): void {
  setupEnvironment({ ...getTestEnvironment(), ...env })
  enableTestTime()
  userId.set('10')
}

export async function cleanClientTest(): Promise<void> {
  setupEnvironment(getTestEnvironment())
  await client.get()?.clean()
  cleanStores(Feed, Filter, Category, Post)
}

export function getTestEnvironment(): EnvironmentAndStore {
  return {
    baseRouter: atom(undefined),
    errorEvents: { addEventListener() {} },
    locale: atom('en'),
    logStoreCreator: () => new MemoryStore(),
    networkType: () => ({ saveData: undefined, type: undefined }),
    persistentEvents: { addEventListener() {}, removeEventListener() {} },
    persistentStore: {},
    restartApp: () => {},
    translationLoader: async () => ({})
  }
}

export const testRouter = atom<BaseRoute | undefined>()

export function setBaseRoute(route: BaseRoute | undefined): void {
  testRouter.set(route)
}

interface PromiseMock<Result> {
  next(): PromiseMock<Result>
  promise(): Promise<Result>
  resolve(result: Result): void
}

export function createPromise<Result>(): PromiseMock<Result> {
  let result: PromiseMock<Result> = {
    next() {
      return createPromise<Result>()
    },
    promise() {
      return new Promise<Result>(resolve => {
        result.resolve = resolve
      })
    },
    resolve() {
      fail()
    }
  }
  return result
}
