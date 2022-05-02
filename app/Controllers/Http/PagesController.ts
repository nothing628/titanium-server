import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Manga from 'App/Models/Manga'

export default class PagesController {
  public async getMangaPage({ params }: HttpContextContract) {
    const mangaId = params.id
    const manga = await Manga.query().preload('pages').where('id', mangaId).firstOrFail()

    return {
      data: manga.pages
    }
  }

  public async storePage() {}

  public async updatePage() {}

  public async deletePage() {}
}
