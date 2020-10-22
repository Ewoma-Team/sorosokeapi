'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const dayjs = use("dayjs")
const relativeTime = use("dayjs/plugin/relativeTime")
dayjs.extend(relativeTime);

class Feed extends Model {
    

    user () {
        return this.belongsTo('App/Models/User')
    }

    static get computed () {
        return ['humanreadabletime']
    }

    getHumanreadabletime ({created_at}) {
        return dayjs(created_at).fromNow()
    }

}

module.exports = Feed
