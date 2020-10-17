const Env = use('Env')
const Cache = use('App/Models/Cache')
const dayjs = use("dayjs")

const twitterSignIn = use('twittersignin')({
    consumerKey: Env.get('TWITTER_API_KEY'),
    consumerSecret: Env.get('TWITTER_API_SECRET'),
    accessToken: Env.get('TWITTER_ACCESS_TOKEN'),
    accessTokenSecret: Env.get('TWITTER_ACCESS_TOKEN_SECRET')
});

module.exports = {

    generateLoginUrl: async () => {
        try {
            const response = await twitterSignIn.getRequestToken({
                oauth_callback: Env.get('TWITTER_CALLBACK_URL'),
                x_auth_access_type: "read",
            })
            console.log(response)
            if(response.oauth_callback_confirmed) {
                const requestToken = response.oauth_token;
                const requestTokenSecret = response.oauth_token_secret;

                //Store the Request token secret to the Database using the request token as key
                await Cache.create({
                    key: `token-${requestToken}`,
                    value:  requestTokenSecret,
                    expiration: dayjs().add(1, 'day').format('YYYY-MM-DD h:mm:ss a')
                })

                return {
                    success: true,
                    statusCode: 200,
                    info: 'Authentication Successful.',
                    requestToken,
                    requestTokenSecret
                }
            }

            if(!response.oauth_callback_confirmed) {
                return {
                    success: false,
                    statusCode: 501,
                    info: 'Authentication not Succesful.',
                }
            }

        } catch (error) {
            console.error(error)
        }

    },

    generateData: async (requestToken, oauthVerifier) => {

        //Get the Stroe request toke secret
        const result = await Cache.findBy('key', `token-${requestToken}`);

        if(result) {

            requestTokenSecret = result.value;
            //Generate auth token for the user
            const response = await twitterSignIn.getAccessToken(requestToken, requestTokenSecret, oauthVerifier); 

            //Get the User Profile Data
            const currentUser = await twitterSignIn.getUser(response.oauth_token, response.oauth_token_secret);

            //Delete the Token from the Database After succesful Authentication
            await result.delete();

            return {
                success: true,
                statusCode: 200,
                info: 'Twitter Data Succesfully retrieved.',
                response,
                currentUser
            }
        }
        return {
            success: false,
            statusCode: 501,
            info: 'Authentication not allowed.',
            hint: 'The twitter authentication token is not valid or have expired.'
        }
    },

}