'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BotSchema extends Schema {
  up () {
    this.create('bots', (table) => {
      table.increments()
      table.string('Context')
      table.text('info')
      table.timestamps()
    })
  }

  down () {
    this.drop('bots')
  }
}

module.exports = BotSchema
