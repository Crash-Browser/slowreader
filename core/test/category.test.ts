import { ensureLoaded, loadValue } from '@logux/client'
import { deepStrictEqual, equal } from 'node:assert'
import { afterEach, beforeEach, test } from 'node:test'

import {
  addCategory,
  addFeed,
  changeCategory,
  deleteCategory,
  feedCategory,
  feedsByCategory,
  getCategories,
  getFeed,
  getFeeds,
  testFeed
} from '../index.js'
import { cleanClientTest, enableClientTest } from './utils.js'

beforeEach(() => {
  enableClientTest()
})

afterEach(async () => {
  await cleanClientTest()
})

test('adds, changes and removes categories', async () => {
  let all = getCategories()
  await loadValue(all)
  deepStrictEqual(ensureLoaded(all.get()).list, [])

  let id = await addCategory({ title: 'Fun' })
  equal(typeof id, 'string')
  let added = ensureLoaded(all.get()).list
  equal(added.length, 1)
  equal(added[0]!.title, 'Fun')

  await changeCategory(id, { title: 'Memes' })
  let changed = ensureLoaded(all.get()).list
  equal(changed.length, 1)
  equal(changed[0]!.title, 'Memes')

  await deleteCategory(id)
  deepStrictEqual(ensureLoaded(all.get()).list, [])
})

test('returns category ID', async () => {
  let id = await addCategory({ title: 'A' })
  let categories = await loadValue(getCategories())

  equal(feedCategory(id, categories), id)
  equal(feedCategory(undefined, categories), 'general')
  equal(feedCategory('unknown', categories), 'general')
})

test('groups feeds', async () => {
  let idA = await addCategory({ title: 'A' })
  let idC = await addCategory({ title: 'C' })
  let idB = await addCategory({ title: 'B' })
  let feed1 = await addFeed(testFeed({ categoryId: idA, title: '1' }))
  let feed2 = await addFeed(testFeed({ categoryId: idA, title: '2' }))
  let feed3 = await addFeed(testFeed({ categoryId: idB, title: '1' }))
  let feed4 = await addFeed(testFeed({ title: '1' }))
  let feed5 = await addFeed(testFeed({ categoryId: 'unknown', title: '1' }))

  let feeds = await loadValue(getFeeds())
  let categories = await loadValue(getCategories())
  deepStrictEqual(feedsByCategory(categories, feeds.list), [
    [
      { id: 'general', title: 'General' },
      [getFeed(feed5).get(), getFeed(feed4).get()]
    ],
    [
      { id: idA, isLoading: false, title: 'A' },
      [getFeed(feed2).get(), getFeed(feed1).get()]
    ],
    [{ id: idB, isLoading: false, title: 'B' }, [getFeed(feed3).get()]],
    [{ id: idC, isLoading: false, title: 'C' }, []]
  ])
})
