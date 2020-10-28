'use strict'

class CreateFeed {
  get rules () {
    const { id } = this.ctx.params
     
     return {
       // validation rules
       location: 'max:100',
       description: `required|min:5|max:150`,
       file_url: 'required|file|file_ext:png,jpg,jpeg,mp4,avi,webm|file_size:35mb|file_types:image,video'
     }
   }
   get messages () {
     return {
       'location.max': 'Location field must not exceed 100 characters',
       'description.required': 'Description field is require!',
       'description.max': 'Description field must not exceed 100 characters',
       'file_url.required': 'A image or video file is required to continue!',
       'file_url.file_types': 'file must be a image or video file with extention (jpeg, jpg, png, mp4, avi, webm)',
       'file_url.file_ext': 'Invalid file extention, accepted only (jpeg, jpg, png, mp4, avi, webm)',
       'file_url.file_size': 'file size too large, please image or video must be less than 10mb'
     }
   }
   async fails(errorMessages) {
    return this.ctx.response.status(422).json({
      message: errorMessages[0].message
    });
  }
}

module.exports = CreateFeed
