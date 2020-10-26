'use strict'
const Feed = use('App/Models/Feed')
const Database = use('Database')
const CloudinaryUploadController = use('App/Controllers/Http/FileUpload/CloudinaryUploadController')
const YoutubeVideoApiController = use('App/Controllers/Http/FileUpload/YoutubeVideoApiController')
const Env = use('Env')
const Socket = require('../../../start/socket')


class FeedController {

    constructor() { this.feedIdBreakOut = 0; }

    //Get All Feeds 
    async fetchFeeds({response, params: { page }}) {

        const feeds = await Feed.query().with('user').orderBy('created_at','desc').paginate(page)
    
        response.status(200).json({
          success: true,
          info: 'Top 50 Feeds',
          fileOrigin: {
              imageOrigin: Env.get('CLOUDINARY_IMAGE_URL'),
              videoOrigin: Env.get('CLOUDINARY_VIDEO_URL')
            },
          feeds
        });
        
    }a

    async createFeed ({request, auth, response}) {

        const youtubeUpload = new YoutubeVideoApiController
        const cloudinaryUpload = new CloudinaryUploadController

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


          //Upload file to youtube
          const file = request.file('file_url', {
                types: ['image', 'video'],
                size: '35mb',
                extnames: ['png', 'jpg', 'jpeg', 'mp4', 'avi', 'webm']
          });

            // console.log(file.type, file.extname)
            let fileRes = null;
            let file_type = null;

            if(file.type === 'video') {
                file_type = 'video';
                fileRes = await cloudinaryUpload.handleUpload(file, "feeds", file.type);
                // fileRes = await youtubeUpload.handleUpload(title, description, file, "feeds"); //Second Parameter is the file folder
            }

            if(file.type === 'image') {
                file_type = 'image';
                fileRes = await cloudinaryUpload.handleUpload(file, "feeds", file.type); //Second Parameter is the file folder
            }

            if(!fileRes.status) {
                return response.status(fileRes.status_code).json({
                    info:'An error occured while uploading file, please check your internet connection refresh and try again', 
                    hint: fileRes.error.image_up_info
                })
            }

            Object.assign(request.post(), {
                user_id: auth.user.id,
                feed_id: feedId,
                file_type,
                file_url: `${fileRes.image_up_info.public_id}.${fileRes.image_up_info.format}`,
            }) 

             const feedInfo = await Feed.create(request.post(), trx) //Save feed to database



             Object.assign(feedInfo, {
                fileOrigin: Env.get('CLOUDINARY_IMAGE_URL'),
                user: auth.user
            }) 
    
          trx.commit() //once done commit the transaction


          //Fire and Event to display new Feed added 
          Socket.ioObject.emit('new-feed', feedInfo)
            
          return response.status(201).json({
                success: true,
                info: `Feed succesfully created`, 
                feedInfo,
            })

        } catch (error) {
    
          await trx.rollback()
          return {error: false, info: 'An unexpected error occured when creating feed.', hint: error.message, status:501}
        }
    
    }

    async createFeedId () {

        const feedId = Math.floor(10000000000000000 + Math.random() * 90000000000000000);

        const checkIfExist = await Feed.findBy('feed_id', feedId)

        if(checkIfExist) {

            if(this.verifyCodeBreakOut < 3) {

                this.verifyCodeBreakOut++;

                await this.createVerifyCode(); 

            }

        }

        return feedId;
    }

}

module.exports = FeedController
