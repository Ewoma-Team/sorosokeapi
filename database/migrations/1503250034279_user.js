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
      table.string('email', 254).nullable()
      table.string('oauth_token', 254).nullable().unique()
      table.string('oauth_token_secret', 254).nullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UserSchema
