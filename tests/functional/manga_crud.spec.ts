import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Manga from 'App/Models/Manga'
import User from 'App/Models/User'

test.group('/mangas/:id - Manga crud', () => {
  // Write your test here
  test('can create manga', async ({ client, assert }) => {
    const user = await User.firstOrFail()
    const response = await client
      .post('/mangas')
      .json({
        title: 'Test create',
        description: 'Some test',
      })
      .loginAs(user)
    const insertedManga = await Manga.findBy('title', 'Test create')

    response.assertStatus(201)
    response.assertBodyContains({
      manga: {
        title: 'Test create',
        description: 'Some test',
      },
    })

    const responseBody = response.body()

    assert.properties(responseBody, ['manga'])
    assert.properties(responseBody.manga, ['title', 'description', 'id'])
    assert.isNotEmpty(insertedManga, 'should be inserted to db')
    assert.propertyVal(responseBody.manga, 'id', insertedManga?.id)
  })

  test('throw unauthorized when requested without access token', async ({ client }) => {
    const response = await client.post('/mangas').json({
      title: 'Test create',
      description: 'Some test',
    })

    response.assertStatus(401)
  })

  test('throw error when create with missing props', async ({ client }) => {
    const user = await User.firstOrFail()
    let response = await client
      .post('/mangas')
      .json({
        title: 'Test create',
      })
      .loginAs(user)

    response.assertStatus(422)

    response = await client
      .post('/mangas')
      .json({
        title: '',
      })
      .loginAs(user)

    response.assertStatus(422)

    response = await client
      .post('/mangas')
      .json({
        title: 'Test create',
        description: '',
      })
      .loginAs(user)

    response.assertStatus(422)

    response = await client
      .post('/mangas')
      .json({
        description: 'Some test',
      })
      .loginAs(user)

    response.assertStatus(422)

    response = await client
      .post('/mangas')
      .json({
        description: '',
      })
      .loginAs(user)

    response.assertStatus(422)

    response = await client
      .post('/mangas')
      .json({
        description: 'Some test',
        title: '',
      })
      .loginAs(user)

    response.assertStatus(422)
  })

  test('can list manga', async ({ client, assert }) => {
    const countQueryResult = await Database.from(Manga.table).count('id')
    const countData = parseInt(countQueryResult[0].count)
    const response = await client.get('/mangas').qs({
      page: 1,
      perPage: 15,
    })

    response.assertStatus(200)

    const responseBody = response.body()

    assert.properties(responseBody, ['page', 'perPage', 'total', 'data'])
    assert.propertyVal(responseBody, 'page', 1)
    assert.propertyVal(responseBody, 'perPage', 15)
    assert.propertyVal(responseBody, 'total', countData)

    // TODO: assert data content
  })
})
