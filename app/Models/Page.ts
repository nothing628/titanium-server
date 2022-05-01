import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Manga from 'App/Models/Manga'

export default class Page extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public mangaId: string

  @column()
  public pageOrder: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Manga)
  public manga: BelongsTo<typeof Manga>
}
