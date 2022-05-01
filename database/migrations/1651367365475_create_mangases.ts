import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Mangas extends BaseSchema {
  protected tableName = 'mangas'

  public async up() {
    this.schema.raw("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";");
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw("uuid_generate_v4()"))

      table.string('title', 500).notNullable()
      table.string('description', 1024).notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
