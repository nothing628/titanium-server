import { test } from '@japa/runner'
import Drive from '@ioc:Adonis/Core/Drive'
import { createReadStream } from 'node:fs'
import Manga from 'App/Models/Manga'
import Page from 'App/Models/Page'
import User from 'App/Models/User'

test.group('Page crud', () => {
  // Write your test here
  test('can list pages', async ({ client, assert }) => {
    const testManga = await Manga.query().preload('pages').firstOrFail()
    const testPages = testManga.pages
    const response = await client.get('/mangas/' + testManga.id + '/pages')

    response.assertStatus(200)

    const responseBody = response.body()

    assert.properties(responseBody, ['data'])

    for (const testPage of testPages) {
      assert.containsSubset(responseBody.data, [
        {
          id: testPage.id,
          manga_id: testManga.id,
          page_order: testPage.pageOrder,
          page_path: testPage.pagePath,
        },
      ])
    }
  })

  test('throw 404 when try list page of non-exists manga', async ({ client }) => {
    const response = await client.get('/mangas/3136b941-2f14-493d-9d3c-c070a8784422/pages')

    response.assertStatus(404)
  })

  test('can upload page', async ({ client, assert }) => {
    const testManga = await Manga.firstOrFail()
    const testUser = await User.firstOrFail()
    const response = await client
      .post('/pages')
      .field('manga_id', testManga.id)
      .field('page_order', 999)
      .file('file', createReadStream('tmp/testfile.jpg'))
      .loginAs(testUser)

    response.assertStatus(201)

    const responseBody = response.body()

    // assert.isTrue(isFileUploaded)
    assert.properties(responseBody, ['page'])
    assert.properties(responseBody.page, ['id', 'manga_id', 'page_path', 'page_order'])

    const lastPage = await Page.query()
      .where('page_order', 999)
      .orderBy('created_at', 'desc')
      .first()

    assert.isNotNull(lastPage, 'page should be inserted to database')
    assert.equal(lastPage?.mangaId, testManga.id)
    assert.propertyVal(responseBody.page, 'id', lastPage?.id)
    assert.propertyVal(responseBody.page, 'manga_id', lastPage?.mangaId)
    assert.propertyVal(responseBody.page, 'page_path', lastPage?.pagePath)
    assert.propertyVal(responseBody.page, 'page_order', lastPage?.pageOrder)

    Drive.restore()
  })

  test('throw 401 when try upload without access token', async ({ client }) => {
    const testManga = await Manga.firstOrFail()
    const response = await client
      .post('/pages')
      .field('manga_id', testManga.id)
      .field('page_order', 999)
      .file('file', createReadStream('tmp/testfile.jpg'))

    response.assertStatus(401)
  })

  test('throw 404 when try upload with non-exists manga', async ({ client }) => {
    const randomUuid = "3136b941-2f14-493d-9d3c-c070a8784422"
    const testUser = await User.firstOrFail()
    const response = await client
      .post('/pages')
      .field('manga_id', randomUuid)
      .field('page_order', 999)
      .file('file', createReadStream('tmp/testfile.jpg'))
      .loginAs(testUser)

    response.assertStatus(404)
  })
})
