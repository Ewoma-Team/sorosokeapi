'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonalRoomChatSchema extends Schema {
  up () {
    this.create('personal_room_chats', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('persoal_room_chats')
  }
}

module.exports = PersonalRoomChatSchema
