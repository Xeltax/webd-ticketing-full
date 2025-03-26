    import axios from 'axios';
    import {getCookie} from "cookies-next";

    const Client = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add an interceptor to include the bearer token from the cookie
    Client.interceptors.request.use(
        (config) => {
            let cookie = getCookie("JWT");
            let orgaPref = getCookie("OrganizationPreference");

            if (typeof cookie === "string") {
                config.headers['Authorization'] = `Bearer ${cookie}`
            }

            if (typeof orgaPref === "string") {
                config.headers['X-Organization-ID'] = JSON.parse(orgaPref).id
            }
            return config;
        },
        (error) => {

            return Promise.reject(error);
        }
    );

    export function setBearerToken(token: any) {
        if (token) {
            Client.defaults.headers['Authorization'] = `Bearer ${token}`;
        } else {
            delete Client.defaults.headers['Authorization'];
        }
    }

    export default Client;