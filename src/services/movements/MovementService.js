import { BASE_URL } from "../../helpers/BaseUrl"
import axios from 'axios';

const MOVEMENTS_API_BASE_URL = `${BASE_URL}/bills`;
const API_DOLAR = 'https://api.bluelytics.com.ar/v2/latest'


class MovementService {

    createMovement = (movement) => {
        return axios.post(MOVEMENTS_API_BASE_URL, movement);
    };


    getMovement = (movementId) => {
        return axios.get(`${MOVEMENTS_API_BASE_URL}/${movementId}`);
    };

    updateMovement = async (movementId, body) => {
        const response = await axios.put(`${MOVEMENTS_API_BASE_URL}/${movementId}`, body);
        return response.data;
    };

    deleteMovement = async (movementId) => {
        const response = await axios.delete(`${MOVEMENTS_API_BASE_URL}/${movementId}`);
        return response.data;
    };

    allMovements = async (params) => {

        let url = `${MOVEMENTS_API_BASE_URL}`
        
        if(params && params.page!==null){
            url = `${MOVEMENTS_API_BASE_URL}?page=${params.page+1}`;
        }
       
       if(params && params.search!==null && params.search?.name !== null){
           let keys = Object.keys(params.search);
           url = `${MOVEMENTS_API_BASE_URL}?page=${1}&${keys[0]}=${params.search.name}`;
       }
       return await axios.get(url);
    }

    allBillsIncomesTotalPerMonth = async (params) => {

        let url = `${MOVEMENTS_API_BASE_URL}/allByMonth`
        
        if (Object.keys(params).length > 0) {
            url += `?`;
            const queryParams = [];
            for (const key in params) {
              if (params.hasOwnProperty(key)) {
                if(params[key] !== null){
                    queryParams.push(`${key}=${params[key]}`);
                }
              }
            }
            url += queryParams.join('&');
        }
       
    //    if(params && params.search!==null && params.search?.name !== null){
    //        let keys = Object.keys(params.search);
    //        url = `${MOVEMENTS_API_BASE_URL}?page=${1}&${keys[0]}=${params.search.name}`;
    //    }
       return await axios.get(url);
    }

    allBillsIncomesTotalPerYear = async (params) => {

        let url = `${MOVEMENTS_API_BASE_URL}/allByYear`
        
        if (Object.keys(params).length > 0) {
            url += `?`;
            const queryParams = [];
            for (const key in params) {
              if (params.hasOwnProperty(key)) {
                if(params[key] !== null){
                    queryParams.push(`${key}=${params[key]}`);
                }
              }
            }
            url += queryParams.join('&');
        }
       
    //    if(params && params.search!==null && params.search?.name !== null){
    //        let keys = Object.keys(params.search);
    //        url = `${MOVEMENTS_API_BASE_URL}?page=${1}&${keys[0]}=${params.search.name}`;
    //    }
       return await axios.get(url);
    }

    exportMovements= async (params) => {

        let url = `${MOVEMENTS_API_BASE_URL}/export`;
        // if(params.search!==null){
        //     let keys = Object.keys(params.search);
        //     url = `${MOVEMENTS_API_BASE_URL}/export?${keys[0]}=${params.search.name}`;
        // }
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const urlObject= URL.createObjectURL(blob);
        return urlObject;

      }


      getDolar= async (params) => {

        let url = `${API_DOLAR}`;
        return await axios.get(url);

      }

    
}

export default new MovementService();