import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { MangaFactory } from 'Database/factories'

export default class MangaSeederSeeder extends BaseSeeder {
  public async run() {
    await MangaFactory.with('pages', 4).createMany(100)
  }
}
