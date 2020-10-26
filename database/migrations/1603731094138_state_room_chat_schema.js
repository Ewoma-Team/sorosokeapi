'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StateRoomChatSchema extends Schema {
  up () {
    this.create('state_room_chats', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('state_room_chats')
  }
}

module.exports = StateRoomChatSchema
