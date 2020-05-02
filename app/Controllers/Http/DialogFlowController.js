'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Config = use("Config");
const dialogflow = use('dialogflow');
// const {google} = use('googleapis');

class DialogFlowController {

    async v2Bot({ request, response, data }) {
        console.log('chat:', data)//This is the data from socket.io
        const text = data.message;
        const sessionId = data.device_id;

        
        try{
             const result = await this.trigger({text, sessionId})  
             console.log(result)
             return JSON.stringify({
                'message': 'successful',
                'status': 200,
                'device_id': sessionId,
                'chat_info': result
            })
        }catch(err) {
            console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
            throw err
        }
    }

    async trigger({text, sessionId}) {
        console.log(text, sessionId)
        const projectId = Config.get('ewoma.project_id')
		const privateKey = Config.get('ewoma.private_key')
        const clientEmail = Config.get('ewoma.client_email')

		let config = {
			credentials: {
				private_key: privateKey,
				client_email: clientEmail
			}
        }
        console.log(config)
	
        const sessionClient = new dialogflow.SessionsClient(config)
        // Define session path
		const sessionPath = sessionClient.sessionPath(projectId, sessionId);
		// The text query request.
		const body = {
			session: sessionPath,
			queryInput: {
				text: {
					text: text,
					languageCode:  'en-US',
				}
			}
        }
        try {
			let responses = await sessionClient.detectIntent(body)			
            console.log('DialogFlow.sendTextMessageToDialogFlow: Detected intent');
            return responses;
		}
		catch(err) {
			console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
			throw err
		}


    }
}

module.exports = DialogFlowController
