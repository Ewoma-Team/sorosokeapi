

const Cloudinary = use('App/Services/Cloudinary')

class CloudinaryUploadController {

    async handleUpload (file, folder,resource_type) {
        //Connect to cloudinary Storage 
        try {
            if(file){
                let cloudinary_response = await Cloudinary.upload(file, folder, resource_type)
                return cloudinary_response;
            }
            return {status: false, error: 'Please upload a video or image', status_code: 400};
        } catch (error) {
            return {status: false, error, status_code: 501}
        }
    }

    async handleDelete (file) {
        
        try {
            console.log('here')
            if(file) {
                let cloudinary_response = await Cloudinary.destroy(file)
                return cloudinary_response;
            }
            return {status: false, error: 'Please provide a file to delete', status_code: 400}
        } catch (error) {
            return {status: false, error: error.message, status_code: 501}
        }
    }
}

module.exports = CloudinaryUploadController
