'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FriendRoomChatSchema extends Schema {
  up () {
    this.create('friends_room_chats', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('friends_room_chats')
  }
}

module.exports = FriendRoomChatSchema
