import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeederSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      email: 'admin@admin.com',
      password: 'secret1234',
    })
  }
}
