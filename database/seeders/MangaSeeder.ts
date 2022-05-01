import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Manga from 'App/Models/Manga'

export default class MangaSeederSeeder extends BaseSeeder {
  public async run() {
    await Manga.create({
      title: 'This is test 1',
      description: 'description 1',
    })

    await Manga.create({
      title: 'This is test 2',
      description: 'description 2',
    })
  }
}
