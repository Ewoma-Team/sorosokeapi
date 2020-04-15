'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Bot = use('App/Models/Bot')
const Database = use('Database')


class BotController {
    async index({response}) {

    }

    async chat({request, response, data}) {
        console.log('chat:', data)//This is the data from socket.io

        return response.status(200).json({
            'message': 'successfull',
            'chat': data 
        })

    }

    async saveChat({text}) {

    }
}

module.exports = BotController
