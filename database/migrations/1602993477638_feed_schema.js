'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FeedSchema extends Schema {
  up () {
    this.create('feeds', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.string('feed_id').notNullable().unique().index()
      table.string('file_type').notNullable();
      table.string('file_url').notNullable();
      table.string('title').notNullable();
      table.string('location').notNullable();
      table.text('description').nullable();
      table.timestamps()

      table.foreign('user_id').references('user.id')

    })
  }

  down () {
    this.drop('feeds')
  }
}

module.exports = FeedSchema
