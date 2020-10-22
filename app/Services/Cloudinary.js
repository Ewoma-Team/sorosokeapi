 
const cloudinary = use('cloudinary').v2
const Env = use('Env')

cloudinary.config({
    cloud_name: Env.get('CLOUDINARY_CLOUD_NAME'),
    api_key: Env.get('CLOUDINARY_API_KEY'),
    api_secret: Env.get('CLOUDINARY_API_SECRET')
})

module.exports ={

    upload: async (file, folder, resource_type) => {

        return new Promise(async (resolve, reject) => {

            try {

                let response = await cloudinary.uploader.upload(file.tmpPath, {
                    resource_type,
                    quality: 50,
                    folder: `${Env.get('CLOUDINARY_APP_FOLDER')}/${folder}`,
                    chunk_size: 6000000,
                    eager: [
                        { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
                        { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } 
                    ],                                   
                    eager_async: true
                })

                resolve({status: true, image_up_info: response, status_code: 200})                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

            } catch (error) {
        
                reject({status: false, image_up_info: error.message, status_code: 501})
            }
        })
    },

    destroy: async (file) => {

        return new Promise(async (resolve, reject) => {
            console.log(file)
             try {
                let response = await cloudinary.uploader.destroy(file)

                resolve({status: true, image_del_info: response, status_code: 200})

             } catch (error) {
                reject({status: false, image_del_info: error.message, status_code: 501})
             }
        })
    }   
}