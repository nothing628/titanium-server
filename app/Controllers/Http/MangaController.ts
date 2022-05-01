import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Manga from 'App/Models/Manga'
import CreateMangaValidator from 'App/Validators/CreateMangaValidator'

export default class MangaController {
  public async storeManga({ response, request }: HttpContextContract) {
    const input = await request.validate(CreateMangaValidator)
    const { title, description } = input
    const insertedManga = await Manga.create({
      title: title,
      description: description,
    })

    response.status(201)

    return {
      manga: {
        id: insertedManga.id,
        title: title,
        description: description,
      },
    }
  }

  public async listManga({ request }: HttpContextContract) {
    const page = request.input('page') || 1
    const perPage = request.input('perPage')
    const mangaResult = await Manga.query().paginate(page, perPage)

    return {
      page: mangaResult.currentPage,
      perPage: mangaResult.perPage,
      total: mangaResult.total,
      data: mangaResult.all(),
    }
  }
}
