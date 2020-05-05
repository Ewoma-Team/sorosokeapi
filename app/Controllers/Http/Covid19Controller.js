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
                    'message': `Please am sorry, i can't get you an adequate result on that, 
                                it may look like your data (country or status) information are incorrect or does not exist, please check and try again!`,
                    'device_id': data.device_id,
                    'status': 400,
                }

        try{
            const result = await axios.get(url);
            if(data.message.includes('/')) {
                console.log('has /')
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

    async c19CountryAndStatus({ request, response, country, status, device_id}) {
        console.log(country, status)

        const url = `https://api.covid19api.com/dayone/country/${country}/status/${status}`;
        
        try{
            const result = await axios.get(url)
            console.log(result.data);
            return JSON.stringify({
                'message': 'api successful',
                'status': 200,
                'device_id': device_id,
                'chat_info': result.data
            })
     
            // return response.status(200).json(result.data)
        }catch (error) {
            console.error(error)
            return response.status(500).json({
                message: "An error occured",
                error
            })
        }
    
    }

}

module.exports = Covid19Controller