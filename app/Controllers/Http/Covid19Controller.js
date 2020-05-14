'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const axios = use('axios')
const Env = use('Env')
const nodemailer = use('nodemailer');
// const sgTransport =  use('nodemailer-sendgrid-transport');

class Covid19Controller {

    async c19SummaryGlobal({request, response, data}) {
        const url = `https://api.covid19api.com/summary`;

        try{
            const result = await axios.get(url);
            return JSON.stringify({
                'message': 'api successful',
                'device_id': data.device_id,
                'global': result.data.Global,
                'status': 200,
            })
        }catch(e) {
            console.error(e)
        }
    }
    async c19CurrentCountry({request, response, data}) {
        const url = `https://api.covid19api.com/summary`;
        let  output = {
                    'message': `Oh no!, I can't get you an adequate result on that, 
                                it may look like your data (country or status) information are incorrect or does not exist, please check and try again!`,
                    'device_id': data.device_id,
                    'status': 400,
                }

        try{
            const result = await axios.get(url);
            if(data.message.includes('/')) {
                data.message = data.message.split('/').join("-");
                console.log(data.message)
            }
            await result.data.Countries.map(x => {
                if(x.Slug == data.message){
                    console.log(x)
                    output = {
                        'message': 'api successful',
                        'device_id': data.device_id,
                        'country_summary': x,
                        'status': 200,
                    }
                }
            });
    
            return JSON.stringify(output)
        }catch(e) {
            console.error(e)
        }
    }
    async c19SummaryCountries({request, response, data}) {
        const url = `https://api.covid19api.com/summary`;

        try{
            const result = await axios.get(url);
            return JSON.stringify({
                'message': 'api successful',
                'device_id': data.device_id,
                'countries': result.data.Countries,
                'status': 200,
            })
        }catch(e) {
            console.error(e)
        }
    }

    async c19DayOneCountry({ request, response, data}) {
        console.log(data)
        const url = `https://api.covid19api.com/dayone/country/${data.message.country}`;
        let output = {
                    'message': `Oh no!, I can't get you an adequate information on that, 
                                it may look like your country name is incorrect or does not exist, 
                                please visit country list to get correct country name and try again!`,
                    'device_id': data.device_id,
                    'status': 400,
                }
        try{
            const result = await axios.get(url)
            console.log(result.data);
            if(result.data){
                output = {
                    'message': 'api successful',
                    'status': 200,
                    'device_id': data.device_id,
                    'dayone': result.data
                }
            }
            // return response.status(200).json(result.data)
        }catch (error) {
            console.error(error)
        }
        return JSON.stringify(output)
    }
   
    async c19DayOneCountryStatus({ request, response, data}) {
        console.log(data)

        const url = `https://api.covid19api.com/dayone/country/${data.message.country}/status/${data.message.status}`;
        let output = {
                'message': `Oh no!, I can't get you an adequate information on that, 
                            it may look like your country name is incorrect or does not exist, 
                            please visit country list to get correct country name and try again!`,
                'device_id': data.device_id,
                'status': 400,
            }
        try{
            const result = await axios.get(url)
            // console.log(result)
            if(result.data){
                output = {
                    'message': 'api successful',
                    'status': 200,
                    'device_id': data.device_id,
                    'dayone': result.data,
                    'caseStatus': data.message.status.charAt(0).toUpperCase() + data.message.status.slice(1) 
                }
            }
           
            // return response.status(200).json(result.data)
        }catch (error) {
            console.error(error)
        }
        return JSON.stringify(output)
    }
    async makeMeBetter({request, response}) {

        const {questions} = request.post();

        console.log('question', questions)
       
        let body = `<b>All Questions Submitted:</b> <br><br><br>`;
        await questions.map((x, i) => {
            body += `<b>(${i + 1})</b> ${x}<br>`;
        });

        const mailMessage = {
            from: Env.get('EWOMA_EMAIL'),
            to: Env.get('EWOMA_EMAIL'),
            subject: 'Make Ewoma Better',
            html: `<div>${body}</div>`
        };
       
        let resp = await this.mailOut(mailMessage);

        resp ? response.status(200).json({message: 'Successfully email sent!'}): null;

        !resp ? response.status(502).json({message: 'Mail Not sent!'}): null;
   
    }
    async reachOut({request, response}) {
        const {subject, email, message} = request.post();

        console.log(request.post())
       
        let body = `<b>Reach Out Mail From: (${email})</b> <br><br>
                    <b>Subject: ${subject} </b><br><br>
                        ${message}
                    `;

        const mailMessage = {
            from: email,
            to: Env.get('EWOMA_EMAIL'),
            subject: 'Reach Out To Ewoma',
            html: `<div>${body}</div>`
        };
       
        let resp = await this.mailOut(mailMessage);
        resp ? response.status(200).json({message: 'Successfully email sent!'}): null;

        !resp ? response.status(502).json({message: 'Mail Not sent!'}): null;
       
    }

    
    async mailOut(mailMessage) {
        return new Promise((resolve, reject) => {
            const options = {
                service: 'gmail',
                auth: {
                  user: Env.get('GMAIL_USER'),
                  pass:  Env.get('GMAIL_PASS'),
                }
              }
            try {
                //Generate the client
                const client = nodemailer.createTransport(options);
                //Send the mail Trigger here
                client.sendMail(mailMessage, function(err, info){
                    if (err ){
                    console.log(err);
                        resolve(false)
                    }
                    else {
                    console.log('Message sent: ' + info.response);
                      resolve(true)
                    }
                });       	
                client.close();
                console.log('p')
                
            }catch (error) {
    
                response.status(501).json({
                    message: 'An unexpected error occured when creating a customer.', 
                    hint:  error.message
                })
            }
        })
    }
}

module.exports = Covid19Controller