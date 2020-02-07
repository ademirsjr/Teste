import axios from 'axios'
import { json } from 'co-body'
import { Service } from '@vtex/api'

const payloadData = async (ctx: any) => {
    
    const request = await json(ctx.req);

    console.log(JSON.stringify(request));

    const customerEmail = request.email;
    
    axios.get('/api/dataentities/CL/search', { 
        baseURL: 'http://'+ctx.vtex.account+'.vtexcommercestable.com.br',
        params: {
            "_fields": "email",
            "_where": "email="+ customerEmail
        },
		headers: {
			'Content-Type': 'application/json',
			'X-Vtex-Use-Https': true
		}
	}).then (response => {

        console.log(JSON.stringify(response.data));
        
        return response.data;
        
	});
}

export default new Service({
	routes: {
		payload: payloadData
	}
})