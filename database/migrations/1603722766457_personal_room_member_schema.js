'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonalRoomMemberSchema extends Schema {
  up () {
    this.create('personal_room_members', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('personal_room_members')
  }
}

module.exports = PersonalRoomMemberSchema
