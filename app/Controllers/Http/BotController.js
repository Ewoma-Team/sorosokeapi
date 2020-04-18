'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Bot = use('App/Models/Bot')
const Database = use('Database')
const axios = use('axios')
const Env = use('Env')


class BotController {
    async index({ response }) {

    }

    async chat({ request, response, data }) {
        console.log('chat:', data)//This is the data from socket.io
        let result = null;

        const url = 'https://api.dialogflow.com/v1/query?v=20150910';

        const body = {
            "lang": "en",
            "query": data.message,
            "sessionId": data.device_id,
            "timezone": "Africa/Lagos"
        }

        const options = {//Axios Option Parameter
            headers: {
                Authorization: `Bearer ${Env.get('DIALOG_FLOW_TOKEN')}`,
                'Content-Type': 'application/json'
            }
        }

        //call the Dialog Flow api
        
        try {
            await axios.post(url, body, options)
                .then(function (response) {
                    //console.log(response);
                    result = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });

                return JSON.stringify({
                    'message': 'successful',
                    'status': 200,
                    'device_id': data.device_id,
                    'chat-info': result
                })
         
        } catch (error) {
            console.error(error)
        }

    }

    async saveChat({ text }) {

    }
}

module.exports = BotController
