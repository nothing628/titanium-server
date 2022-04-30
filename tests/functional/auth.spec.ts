import { test } from '@japa/runner'
import User from 'App/Models/User'

test('/auth can generate token', async ({ client, assert }) => {
  const response = await client.post('/auth').json({
    email: 'admin@admin.com',
    password: 'secret1234',
  })

  response.assertStatus(200)

  const responseBody = response.body()

  assert.properties(responseBody, ['accessToken'])
  assert.properties(responseBody.accessToken, ['expires_at', 'token', 'type'])
})

test('/auth throw 400 error when request with empty body', async ({ client }) => {
  const response = await client.post('/auth').json({})

  response.assertStatus(400)
})

test('/auth throw 400 error when request with wrong email', async ({ client }) => {
  const response = await client
    .post('/auth')
    .json({ email: 'someone@admin.com', password: 'secret1234' })

  response.assertStatus(400)
})

test('/auth throw 400 error when request with wrong password', async ({ client }) => {
  const response = await client
    .post('/auth')
    .json({ email: 'admin@admin.com', password: 'secret12345' })

  response.assertStatus(400)
})

test('/auth/me can show current user', async ({ client, assert }) => {
  const user = await User.firstOrFail()
  const response = await client.get('/auth/me').loginAs(user)

  response.assertStatus(200)
  const responseBody = response.body()

  assert.properties(responseBody, ['user'])
  assert.properties(responseBody.user, ['id', 'email', 'created_at', 'updated_at'])
  assert.propertyVal(responseBody.user, 'id', user.id)
  assert.propertyVal(responseBody.user, 'email', user.email)
})

test('/auth/me throw 401 error when request without access token', async ({ client }) => {
  const response = await client.get('/auth/me')

  response.assertStatus(401)
})
