'use strict'
const Feed = use('App/Models/Feed')
const Database = use('Database')
const CloudinaryUploadController = use('App/Controllers/Http/FileUpload/CloudinaryUploadController')
const Env = use('Env')

class FeedController {

    constructor() { this.feedIdBreakOut = 0; }

    //Get All Feeds 
    async fetchFeeds({response, params: { page }}) {

        const feeds = await Feed.query().paginate(page)
    
        response.status(200).json({
          success: true,
          info: 'Top 50 Feeds',
          feeds
        });
        
    }

    async createFeed ({request, auth, response}) {

        
        const trx = await Database.beginTransaction()

        try {

          //Generate a verification code
          const feedId = await this.createFeedId();

          if(this.feedIdBreakOut === 3){
                this.feedIdBreakOut = 0
                return response.status(501).json({
                    success: false, 
                    info: 'An error occured, this might be a network issue or issue generating with the server, please refresh and try again'
                })
          }
          
          const feedInfo = await Feed.create(request.post(), trx)
    
          const feedLink = `${Env.get('FRONTEND_URL')}/single-feed.html?feed-id=${feedId}`;
    
          Object.assign(customerInfo, code) //attach a code value for mail since verify_code is inaccesble 
    
          if(!mailOut.status) {
              return {error: false, message: 'Please there was an error sending you a verification mail, this could be a bad network connection, please refresh and try again or contact support to report this issue.', hint: mailOut.hint, status:501}
          }
    
          trx.commit() //once done commit the transaction
          
          customerInfo.code = null; //Remove the code value from the payload
          customerInfo.link = null; 
    
          return {success: true, message: `Hurray! Your registration was successful, please go to (${customer.email_default}) confirm, Thank you.`, customer: customerInfo, status: 201}
        } catch (error) {
    
          await trx.rollback()
          return {error: false, message: 'An unexpected error occured when creating a customer.', hint: error.message, status:501}
        }
    
    }

    async createFeedId () {

        const verify_code = Math.floor(1000000000 + Math.random() * 9000000000);

        const checkIfExist = await Customer.findBy('verify_code', verify_code)

        if(checkIfExist) {

            if(this.verifyCodeBreakOut < 3) {

                this.verifyCodeBreakOut++;

                await this.createVerifyCode(); 

            }

        }

        return verify_code;
    }

}

module.exports = FeedController
