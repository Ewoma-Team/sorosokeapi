'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CacheSchema extends Schema {
  up () {
    this.create('caches', (table) => {
      table.increments()
      table.string('key').unique()
      table.text('value')
      table.dateTime('expiration')
    })
  }

  down () {
    this.drop('caches')
  }
}

module.exports = CacheSchema
