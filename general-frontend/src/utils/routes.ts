const API_URL = 'http://localhost:5000';

export const ROUTES = {
    AUTH : {
        LOGIN: API_URL + '/auth/login',
        REGISTER: API_URL +  '/auth/register'
    },
    USER : {
        CRUD: API_URL + '/user',
        CRUD_BY_ID : (id : string) => {
            if (id !== "") {
                return API_URL + "/user/" + id;
            } else {
                return API_URL + "/user/login";
            }
        },
        ME: API_URL + '/user/me'
    }
}