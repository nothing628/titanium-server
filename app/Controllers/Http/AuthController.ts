import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Hash from '@ioc:Adonis/Core/Hash'
// import User from 'App/Models/User'

export default class AuthController {
  public async loginUser({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    // Lookup user manually
    // const user = await User.query().where('email', email).firstOrFail()

    // Verify password
    // if (!(await Hash.verify(user.password, password))) {
    // return response.badRequest('Invalid credentials')
    // }

    // Generate token
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '7days',
    })

    return {
      accessToken: token,
    }
  }

  public async getMe({ auth }: HttpContextContract) {
    const currentUser = auth.use('api').user

    return {
      user: currentUser,
    }
  }

  public async logoutUser({ auth }: HttpContextContract) {
    await auth.use('api').revoke()

    return {
      revoked: true,
    }
  }
}
