import Factory from '@ioc:Adonis/Lucid/Factory'
import Manga from 'App/Models/Manga'

export const MangaFactory = Factory.define(Manga, ({ faker }) => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
  }
}).build()
