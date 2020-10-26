'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FriendRoomMemberSchema extends Schema {
  up () {
    this.create('friend_room_members', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('friend_room_members')
  }
}

module.exports = FriendRoomMemberSchema
