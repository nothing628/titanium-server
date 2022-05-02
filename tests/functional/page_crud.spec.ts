import { test } from '@japa/runner'
import Manga from 'App/Models/Manga'

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

  test('throw 404 when try list page of non-exists manga', async ({client}) => {
    const response = await client.get('/mangas/3136b941-2f14-493d-9d3c-c070a8784422/pages')

    response.assertStatus(404)
  })
})
