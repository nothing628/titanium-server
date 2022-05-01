import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PagesController {
  public async getMangaPage({ params }: HttpContextContract) {
    const mangaId = params.id
  }

  public async storePage() {}

  public async updatePage() {}

  public async deletePage() {}
}
