import axios from 'axios';

export const getUsers = () => { // return an axios promise
    return axios.get('/users', { // second param: passing in configuration object
        params: {
            limit: 1000 // 'cause of no control over REM REST API; no way to return unlimited 
        }
    })
};

export const createUser = ({firstName, lastName}) => {
    return axios.post('/users', {
        firstName,
        lastName
    })
};

export const deleteUser = (userId) => {
    return axios.delete(`/users/${userId}`);
};