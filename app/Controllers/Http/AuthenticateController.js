'use strict'
const TwitterLoginService = use('App/Services/Twitter/TwitterLogin')
const User = use('App/Models/User')
const Database = use('Database')

class AuthenticateController {

    async generateTwitterAuthUrl({reuest, response}) {

        const result = await TwitterLoginService.generateLoginUrl();

        const authUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${result.requestToken}`

        return response.status(result.statusCode).json({success: true, info: result.info, authUrl});
    }

    async storeUser({request, auth, response}) {

        const params = request.only(['oauthToken', 'oauthVerifier'])

      
            const result = await TwitterLoginService.generateData(params.oauthToken, params.oauthVerifier);

            //Save to the Database
            const userData = await this.insertOrUpdateDatabase(result, auth) 

            if(userData.statusCode === 501) {
                return response.status(userData.statusCode).json({userData});
            }
    
            return response.status(userData.statusCode).json({success: true, info: userData.info, userData});

    }

    async insertOrUpdateDatabase(result, auth) {
        
        let userInsert = null;

        if(!result.success) {  
            return {
                success: result.success,
                statusCode: result.statusCode,
                info: result.info,
                hint: result.hint
            }
        }

        const {oauth_token, oauth_token_secret, user_id} = result.response;

        const { name, screen_name, location, 
                profile_image_url_https, 
                verified, description } = result.currentUser;
        
        const trx = await Database.beginTransaction()

        try {

            userInsert = await User.findBy('user_id', user_id);
            
            if(!userInsert) { 
                console.log('new user')
                userInsert = new User;
            };


            userInsert.user_id = user_id
            userInsert.name = name
            userInsert.screen_name = screen_name
            userInsert.location = location
            userInsert.verified = verified
            userInsert.photo = profile_image_url_https
            userInsert.description = description
            userInsert.oauth_token = oauth_token
            userInsert.oauth_token_secret = oauth_token_secret
            
            await userInsert.save(trx) //Store to database

            await trx.commit()

            //Generate Auth Token
            const token = await this.generateAppAuthToken(userInsert, auth);

            Object.assign(userInsert, {token});

            return {
                statusCode: 200,
                info: 'User Saved succesfully!',
                userInsert
            }

        } catch (error) {

            await trx.rollback()
            return {   error: false, 
                       info: 'An unexpected error occured authenticating twitter account.', 
                       hint: error.message, 
                       statusCode: 501 
               }
       }
    }

    async generateAppAuthToken (userData, auth) {
        
        const token = await auth.generate(userData)

        console.log(token)

        return token
    }
}

module.exports = AuthenticateController
