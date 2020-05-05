'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const axios = use('axios')
const Env = use('Env')

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

}

module.exports = Covid19Controller