'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const dayjs = use("dayjs")
const relativeTime = use("dayjs/plugin/relativeTime")
dayjs.extend(relativeTime);

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }
  static get hidden () {
      return ['oauth_token', 'oauth_token_secret']
  }

  
  static get dateFormat () {
    return 'YYYY-MM-DD HH:mm:ss'
  }

  getHumanReadableTime ({created_at}) {
    return dayjs(created_at).fromNow()
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  feeds () {
      return this.hasMany('App/Models/Feed')
  }
}

module.exports = User
