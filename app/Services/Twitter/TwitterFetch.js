const Env = use('Env')
const Twit = use('twit')


const t = new Twit({
    consumerKey: Env.get('TWITTER_API_KEY'),
    consumerSecret: Env.get('TWITTER_API_SECRET'),
    accessToken: Env.get('TWITTER_ACCESS_TOKEN'),
    accessTokenSecret: Env.get('TWITTER_ACCESS_TOKEN_SECRET')
});

module.exports = {

    

    genStatusMentionTimeLine: async () => {
        try {
            // Fetch the user's mentions
            await t.get('statuses/mentions_timeline');
            
          
        } catch (error) {
            console.error(error)
        }

    },

}