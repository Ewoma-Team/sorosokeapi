'use strict'
const PublicRoomChat = use('App/Models/PublicRoomChat')
const Database = use('Database')
const UploadFileTriggerController = use('App/Controllers/Http/FileUpload/UploadFileTriggerController')
const Env = use('Env')
const Socket = require('../../../start/socket')

class PublicRoomController {

    async chat({ request, auth, response }) {

        const user = auth.user

        const uploadFileTriggerController = new UploadFileTriggerController

        const trx = await Database.beginTransaction()

        try {

            //Upload file to Cloudiary or youtube
            const file = request.file('file_url', {
                types: ['image', 'video', 'audio'],
                size: '35mb',
                extnames: ['png', 'jpg', 'jpeg', 'mp4', 'avi', 'webm', 'mp3']
            });

            const uploadObject = await uploadFileTriggerController.fileUpload(file);

            Object.assign(request.post(), {
                user_id: auth.user.id,
                feed_id: feedId,
                uploadObject
            })

            //Store message to th database here for persistent
            const storeChat = await PublicRoomChat.create(request.post())

            Object.assign(storeChat, {
                fileOrigin: Env.get('CLOUDINARY_IMAGE_URL'),
                user: auth.user
            });
    
            trx.commit() //once done commit the transaction

            //Fire and Event to display new Feed added 
            Socket.ioObject.emit(`public.${room_name}`, storeChat)

            return response.status(200).json({ success: true, info: 'Message Send' })

        } catch (error) {

            return response.status(501).json({
                success: false,
                info: 'An error occured, this might be a network issue, please refresh and try again',
                hint: 'Try contacting admin to resolve this isssue',
                developerHint: error.message
            })
        }
    }
}

module.exports = PublicRoomController
