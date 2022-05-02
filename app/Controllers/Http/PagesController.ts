import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import CreatePageValidator from 'App/Validators/CreatePageValidator'
import UpdatePageValidator from 'App/Validators/UpdatePageValidator'
import Manga from 'App/Models/Manga'
import Page from 'App/Models/Page'
import { generateFilename } from '../../helper'

export default class PagesController {
  public async getMangaPage({ params }: HttpContextContract) {
    const mangaId = params.id
    const manga = await Manga.query().preload('pages').where('id', mangaId).firstOrFail()

    return {
      data: manga.pages,
    }
  }

  public async storePage({ request, response }: HttpContextContract) {
    const input = await request.validate(CreatePageValidator)
    const { file, manga_id, page_order } = input
    await Manga.findOrFail(manga_id)
    const fileExts = file.extname
    const fileName = generateFilename(fileExts)

    await file.move(Application.tmpPath('uploads'), { name: fileName })

    const pagePath = file.filePath
    const newPage = await Page.create({
      mangaId: manga_id,
      pageOrder: page_order,
      pagePath: pagePath,
    })

    response.status(201)

    return {
      page: {
        id: newPage.id,
        manga_id: newPage.mangaId,
        page_order: newPage.pageOrder,
        page_path: newPage.pagePath,
      },
    }
  }

  public async updatePage({ params, request }: HttpContextContract) {
    const input = await request.validate(UpdatePageValidator)
    const { page_order } = input
    const pageId = params.id
    const page = await Page.findOrFail(pageId)

    page.pageOrder = page_order
    await page.save()

    return {
      page: {
        id: pageId,
        manga_id: page.mangaId,
        page_order: page_order,
        page_path: page.pagePath,
      },
    }
  }

  public async deletePage({ params, response }: HttpContextContract) {
    const pageId = params.id
    const page = await Page.findOrFail(pageId)

    await page.delete()

    response.status(204)
    return {}
  }
}
