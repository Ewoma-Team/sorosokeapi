'use strict'

class Chat {
  get rules () {
    const { id } = this.ctx.params
     
     return {
       // validation rules
       message: 'required',
       room_name: 'required',
       file_url: 'file|file_ext:png,jpg,jpeg,mp4,mp3,avi,webm|file_size:35mb|file_types:image,video,audio'
     }
   }
   get messages () {
     return {
       'message.required': 'message field is required!',
       'room_name.required': 'Room name field is require!',
       'file_url.file': 'file is required',
       'file_url.file_types': 'file must be a video, image or audio file with extention (jpeg, jpg, png, mp4, avi, webm, mp3)',
       'file_url.file_ext': 'Invalid file extention, accepted only (jpeg, jpg, png, mp4, avi, webm, mp3)',
       'file_url.file_size': 'file size too large, please image,video or audio must be less than 30mb'
     }
   }
   async fails(errorMessages) {
      return this.ctx.response.status(422).json({
        message: errorMessages[0].message
      });
  }
}

module.exports = Chat
