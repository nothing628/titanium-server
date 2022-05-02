/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Application from '@ioc:Adonis/Core/Application'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.post('/auth', 'AuthController.loginUser')
Route.get('/auth/me', 'AuthController.getMe').middleware('auth')
Route.post('/uploads', async ({ request }) => {
  const currentFile = request.file('file', {
    extnames: ['jpg', 'png'],
  })

  if (currentFile) {
    console.log(currentFile)
    // await currentFile.move(Application.startPath('uploads'))
    await currentFile.move(Application.tmpPath('uploads'))
  }
})

Route.group(() => {
  Route.post('/', 'MangaController.storeManga').middleware('auth')
  Route.get('/', 'MangaController.listManga')
  Route.get(':id', 'MangaController.showManga')
  Route.patch(':id', 'MangaController.updateManga').middleware('auth')
  Route.delete(':id', 'MangaController.deleteManga').middleware('auth')

  Route.get(':id/pages', 'PagesController.getMangaPage')
}).prefix('/mangas')

Route.group(() => {
  Route.post('/', 'PagesController.storePage').middleware('auth')
  Route.patch(':id', 'PagesController.updatePage').middleware('auth')
  Route.delete(':id', 'PagesController.deletePage').middleware('auth')
}).prefix('/pages')

Route.get('/', async () => {
  return { hello: 'world' }
})
