'use strict'
const CloudinaryUploadController = use('App/Controllers/Http/FileUpload/CloudinaryUploadController')
const YoutubeVideoApiController = use('App/Controllers/Http/FileUpload/YoutubeVideoApiController')

class UploadFileTriggerController {

    async fileUpload(file, folder) {
        
        const youtubeUpload = new YoutubeVideoApiController
        const cloudinaryUpload = new CloudinaryUploadController

        // console.log(file.type, file.extname)
        let fileRes = null;
        let file_type = null;

        if(file.type === 'video') {
            file_type = 'video';
            fileRes = await cloudinaryUpload.handleUpload(file, folder, file.type);
            // fileRes = await youtubeUpload.handleUpload(title, description, file, folder); //Second Parameter is the file folder
        }

        if(file.type === 'image') {
            file_type = 'image';
            fileRes = await cloudinaryUpload.handleUpload(file, folder, file.type); //Second Parameter is the file folder
        }

        if(!fileRes.status) {
            return response.status(fileRes.status_code).json({
                info:'An error occured while uploading file, please check your internet connection refresh and try again', 
                hint: fileRes.error.image_up_info
            })
        }

        return {
            file_type,
            file_url: `${fileRes.image_up_info.public_id}.${fileRes.image_up_info.format}`,
        }
    }
}

module.exports = UploadFileTriggerController
