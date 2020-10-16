'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('user_id', 254).notNullable().unique()
      table.string('name').nullable()
      table.string('screen_name').notNullable()
      table.string('location').nullable()
      table.boolean('verified').defaultTo(false);
      table.boolean('photo').nullable()
      table.text('description').nullable()
      table.string('user_name', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
