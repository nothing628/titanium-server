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

  test('can list manga (default)', async ({ client, assert }) => {
    const countQueryResult = await Database.from(Manga.table).count('id')
    const countData = parseInt(countQueryResult[0].count)
    const testMangas = await Manga.query().paginate(1)
    const response = await client.get('/mangas').qs({})

    response.assertStatus(200)

    const responseBody = response.body()

    assert.properties(responseBody, ['page', 'perPage', 'total', 'data'])
    assert.propertyVal(responseBody, 'page', 1)
    assert.propertyVal(responseBody, 'perPage', 20)
    assert.propertyVal(responseBody, 'total', countData)
    assert.lengthOf(responseBody.data, 20)

    for (const testManga of testMangas.all()) {
      assert.containsSubset(responseBody.data, [
        { id: testManga?.id, title: testManga?.title, description: testManga?.description },
      ])
    }
  })

  test('can list manga (next page)', async ({ client, assert }) => {
    const countQueryResult = await Database.from(Manga.table).count('id')
    const countData = parseInt(countQueryResult[0].count)
    const testMangas = await Manga.query().paginate(2)
    const response = await client.get('/mangas').qs({
      page: 2,
    })

    response.assertStatus(200)

    const responseBody = response.body()

    assert.properties(responseBody, ['page', 'perPage', 'total', 'data'])
    assert.propertyVal(responseBody, 'page', 2)
    assert.propertyVal(responseBody, 'perPage', 20)
    assert.propertyVal(responseBody, 'total', countData)
    assert.lengthOf(responseBody.data, 20)

    for (const testManga of testMangas.all()) {
      assert.containsSubset(responseBody.data, [
        { id: testManga?.id, title: testManga?.title, description: testManga?.description },
      ])
    }
  })

  test('can list manga (custom perPage)', async ({ client, assert }) => {
    const countQueryResult = await Database.from(Manga.table).count('id')
    const countData = parseInt(countQueryResult[0].count)
    const testMangas = await Manga.query().paginate(1, 10)
    const response = await client.get('/mangas').qs({
      page: 1,
      perPage: 10,
    })

    response.assertStatus(200)

    const responseBody = response.body()

    assert.properties(responseBody, ['page', 'perPage', 'total', 'data'])
    assert.propertyVal(responseBody, 'page', 1)
    assert.propertyVal(responseBody, 'perPage', 10)
    assert.propertyVal(responseBody, 'total', countData)
    assert.lengthOf(responseBody.data, 10)

    for (const testManga of testMangas.all()) {
      assert.containsSubset(responseBody.data, [
        { id: testManga?.id, title: testManga?.title, description: testManga?.description },
      ])
    }
  })

  test('can show manga', async ({ client, assert }) => {
    const testManga = await Manga.first()
    const response = await client.get('/mangas/' + testManga?.id)

    response.assertStatus(200)

    const responseBody = response.body()
    assert.properties(responseBody, ['manga'])
    assert.properties(responseBody.manga, ['id', 'title', 'description'])
    assert.propertyVal(responseBody.manga, 'id', testManga?.id)
    assert.propertyVal(responseBody.manga, 'title', testManga?.title)
    assert.propertyVal(responseBody.manga, 'description', testManga?.description)
  })

  test('throw 404 when show non-exists manga', async ({ client }) => {
    const response = await client.get('/mangas/3136b941-2f14-493d-9d3c-c070a8784422')

    response.assertStatus(404)
  })
})
