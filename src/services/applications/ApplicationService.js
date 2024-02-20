
import axios from 'axios';
import { BASE_URL } from '../../helpers/BaseUrl';

const APPLICATION_API_BASE_URL = `${BASE_URL}/applications`;

class ApplicationService {

    createApplication = (application) => {
        return axios.post(APPLICATION_API_BASE_URL, application);
    };


    getApplication = (applicationId) => {
        return axios.get(`${APPLICATION_API_BASE_URL}/${applicationId}`);
    };

    updateApplication = async (applicationId, body) => {
        const response = await axios.put(`${APPLICATION_API_BASE_URL}/${applicationId}`, body);
        return response.data;
    };

    deleteApplication = async (applicationId) => {
        const response = await axios.delete(`${APPLICATION_API_BASE_URL}/${applicationId}`);
        return response.data;
    };

    allApplications = async (params) => {
        let url = `${APPLICATION_API_BASE_URL}?page=${params.page+1}`
        
        if(params && params.search){
            url = `${APPLICATION_API_BASE_URL}?page=${params.page+1}`;
        }
       
       if(params && params.search!==null){
           let keys = Object.keys(params.search);
           url = `${APPLICATION_API_BASE_URL}?page=${1}&${keys[0]}=${params.search.name}`;
       }
       console.log(url)
       return await axios.get(url);
    }

    exportApplications= async (params) => {

        let url = `${APPLICATION_API_BASE_URL}/export`;
        if(params!==null){
            let keys = Object.keys(params);
            url = `${APPLICATION_API_BASE_URL}/export?${keys[0]}=${params.name}`;
        }
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const urlObject= URL.createObjectURL(blob);
        return urlObject;

      }
}

const applicationServiceInstance = new ApplicationService(); // Creamos una instancia de ApplicationService y la asignamos a una variable

export { applicationServiceInstance };  // Exportamos la variable que contiene la instancia de ApplicationService