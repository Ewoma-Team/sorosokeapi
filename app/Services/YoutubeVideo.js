const Youtube = require("youtube-api");
const fs = require("fs");
const readJson = require('r-json');
const Lien = require("lien");
const Logger = require("bug-killer");
const opn = require("opn");
const prettyBytes = require("pretty-bytes");

const Env = use('Env')
const Config = use("Config");

module.exports = {

    upload: async (title, description, file, folder) => {
        
        const CREDENTIALS = readJson(`${__dirname}/sorosokeCredentials.json`);

        console.log(CREDENTIALS)
        

        return true;
        // initialize Lien server
        let server = new Lien({
            host: "localhost",
            port: 8200
        });
        
        let oauth = Youtube.authenticate({
            type: "oauth",
            client_id: CREDENTIALS.web.client_id,
            client_secret: CREDENTIALS.web.client_secret,
            redirect_url: CREDENTIALS.web.redirect_uris[0]
        });
        
        opn(oauth.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/youtube.upload"]
        }));

        server.addPage("/response", lien => {
            Logger.log("Trying to get the token using the following code: " + lien.query.code);
            oauth.getToken(lien.query.code, (err, tokens) =>{
        
                if (err){
                    lien.lien(err, 400);
                    return Logger.log(err);
                }
                Logger.log("Got the tokens");
                oauth.setCredentials(tokens);
                lien.end("The video is being uploaded.");
                var req = Youtube.videos.insert({
                    resource:{
                        snippet:{
                            title,
                            description
                        },
                        status: {privacyStatus: "private"}
                    },
                    part: "snippet, status",
                    media: {
                        body: fs.createReadStream(file.tmp)
                    }
                },(err, data) => {
                    console.log("Done." + data);
                    process.exit();
                });
                setInterval(function(){
                    Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
                }, 250);
            });
        });
        
    }

}
