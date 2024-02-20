
import axios from 'axios';
import { BASE_URL } from '../../helpers/BaseUrl';

const CONTACT_API_BASE_URL = `${BASE_URL}/contacts`;

class ContactService {

    createContact = (user) => {
        return axios.post(CONTACT_API_BASE_URL, user);
    };


    getContact = (contactId) => {
        return axios.get(`${CONTACT_API_BASE_URL}/${contactId}`);
    };

    updateContact = async (contactId, body) => {
        const response = await axios.put(`${CONTACT_API_BASE_URL}/${contactId}`, body);
        return response.data;
    };

    deleteContact = async (contactId) => {
        const response = await axios.delete(`${CONTACT_API_BASE_URL}/${contactId}`);
        return response.data;
    };

    allContacts = async (params) => {
        let url = `${CONTACT_API_BASE_URL}?page=${params.page+1}`
        
        if(params && params.search){
            url = `${CONTACT_API_BASE_URL}?page=${params.page+1}`;
        }
       
       if(params && params.search!==null){
           let keys = Object.keys(params.search);
           url = `${CONTACT_API_BASE_URL}?page=${1}&${keys[0]}=${params.search.name}`;
       }
       console.log(url)
       return await axios.get(url);
    }

    exportContacts= async (params) => {

        let url = `${CONTACT_API_BASE_URL}/export`;
        if(params!==null){
            let keys = Object.keys(params);
            url = `${CONTACT_API_BASE_URL}/export?${keys[0]}=${params.name}`;
        }
        const response = await axios.get(url, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const urlObject= URL.createObjectURL(blob);
        return urlObject;

      }
}

const contactServiceInstance = new ContactService(); // Creamos una instancia de ContactService y la asignamos a una variable

export { contactServiceInstance };  // Exportamos la variable que contiene la instancia de ContactService