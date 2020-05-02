'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const axios = use('axios')
var Config = use("Config");
// const {google} = use('googleapis');
const dialogflow = use('dialogflow');
const uuid = use('uuid');

class WebhookController {
    async trigger({request, response}) {
        const projectId = Config.get('ewoma.project_id')
         // A unique identifier for the given session
            const sessionId = uuid.v4();
            console.log(Config.get('ewoma.private_key'));

		let privateKey =  Config.get('ewoma.private_key')
		let clientEmail = Config.get('ewoma.client_email')
		let config = {
			credentials: {
				private_key: privateKey,
				client_email: clientEmail
			}
        }
        console.log(sessionId)
	
        const sessionClient = new dialogflow.SessionsClient(config)
        // Define session path
		const sessionPath = sessionClient.sessionPath(projectId, sessionId);
		// The text query request.
		const data = {
			session: sessionPath,
			queryInput: {
				text: {
					text: 'prevent',
					languageCode:  'en-US',
				}
			}
        }
        try {
			let responses = await sessionClient.detectIntent(data)			
            console.log('DialogFlow.sendTextMessageToDialogFlow: Detected intent');
            return response.status(200).json(responses)
		}
		catch(err) {
			console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
			throw err
		}


    }
}

module.exports = WebhookController
