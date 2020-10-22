'use strict'

const YouTubeService = use('App/Services/YoutubeVideo')

class YoutubeVideoApiController {

    async handleUpload (title, description, file, folder) {
        //Connect to YouTubeService Storage 
        try {
            if(file){
                let youTubeServiceResponse = await YouTubeService.upload(title, description, file, folder)
                return youTubeServiceResponse;
            }
            return {status: false, error: 'Please upload a video or image', status_code: 400};
        } catch (error) {
            return {status: false, error, status_code: 501}
        }
    }
}

module.exports = YoutubeVideoApiController
