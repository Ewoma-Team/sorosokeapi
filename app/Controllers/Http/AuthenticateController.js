'use strict'
const TwitterLoginService = use('App/Services/Twitter/TwitterLogin')

class AuthenticateController {

    async generateTwitterAuthUrl({reuest,  response}) {

        const result = await TwitterLoginService.generateLoginUrl();

        const authUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${result.requestToken}`

        return response.status(200).json({authUrl});
    }

    async storeUser({request, response}) {

        const params = request.only(['oauthToken', 'oauthVerifier'])

        const result = await TwitterLoginService.generateData(params.oauthToken, params.oauthVerifier);

        const insertDatabase = await this.insertDatabase(result) //Save to the Database
        

        return response.status(200).json({success: true, result});
    }

    async insertDatabase(result) {

        const {oauth_token, oauth_token_secret, user_id} = result.response;

        const {name, screen_name, location, verified, profile_image_url_https, description} = result.currentUser;

        //Store to database

    }

    async generateAppAuthToken () {
        console.log()
    }
}

module.exports = AuthenticateController
