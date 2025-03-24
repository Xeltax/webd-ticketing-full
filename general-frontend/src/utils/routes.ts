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
    },
    EVENT : {
        CRUD: API_URL + '/event',
        CRUD_BY_ID : (id : string) => {
            if (id !== "") {
                return API_URL + "/event/" + id;
            } else {
                return API_URL + "/event";
            }
        },
        GET_BY_USER_ID : (id : string) => {
            if (id !== "") {
                return API_URL + "/event/user/" + id;
            } else {
                return API_URL + "/event";
            }
        }
    },
    TICKETS : {
        CRUD: API_URL + '/ticket',
        CRUD_BY_ID : (id : string) => {
            if (id !== "") {
                return API_URL + "/ticket/" + id;
            } else {
                return API_URL + "/ticket";
            }
        }
    },
    CATEGORY: {
        CRUD: API_URL + '/categories',
        CRUD_BY_ID : (id : string) => {
            if (id !== "") {
                return API_URL + "/categories/" + id;
            } else {
                return API_URL + "/categories";
            }
        }
    },
    RESERVATION: {
        CRUD: API_URL + '/reservation',
        CRUD_BY_ID : (id : string) => {
            if (id !== "") {
                return API_URL + "/reservation/" + id;
            } else {
                return API_URL + "/reservation";
            }
        }
    }
}