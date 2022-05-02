import Factory from '@ioc:Adonis/Lucid/Factory'
import Manga from 'App/Models/Manga'
import Page from 'App/Models/Page'

export const PageFactory = Factory.define(Page, ({ faker }) => {
  return {
    pageOrder: faker.datatype.number({ min: 1, max: 100 }),
    pagePath: faker.system.filePath(),
  }
}).build()

export const MangaFactory = Factory.define(Manga, ({ faker }) => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
  }
})
  .relation('pages', () => PageFactory)
  .build()
