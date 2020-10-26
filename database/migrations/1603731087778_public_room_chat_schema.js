'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublicRoomChatSchema extends Schema {
  up () {
    this.create('public_room_chats', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('public_room_chats')
  }
}

module.exports = PublicRoomChatSchema
