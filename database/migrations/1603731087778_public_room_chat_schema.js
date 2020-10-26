'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PublicRoomChatSchema extends Schema {
  up () {
    this.create('public_room_chats', (table) => {
      table.increments()
      table.integer('from_id').unsigned()
      table.enum('room_name', ['global', 'national']).notNullable()
      table.text('chat').notNullable()
      table.string('file_url').nullable()
      table.timestamps()

      table.foreign('from_id').references('users.id').onDelete('cascade')

    })
  }

  down () {
    this.drop('public_room_chats')
  }
}

module.exports = PublicRoomChatSchema
