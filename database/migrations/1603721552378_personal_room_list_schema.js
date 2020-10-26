'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonalRoomListSchema extends Schema {
  up () {
    this.create('personal_room_lists', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('personal_room_lists')
  }
}

module.exports = PersonalRoomListSchema
