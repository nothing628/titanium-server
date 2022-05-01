import { test } from '@japa/runner'
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
})
