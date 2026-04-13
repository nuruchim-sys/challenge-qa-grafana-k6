import ApiClient from './api.js';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const BASE_URL = 'https://fakestoreapi.com/';

export let options = {
    scenarios: {
        test: {
            executor: 'constant-arrival-rate',
            rate: 20,             // Aquí defines los 20 TPS
            timeUnit: '1s',       // Indica que los 20 son por cada 1 segundo
            duration: '1m',       // Tiempo que durará la prueba
            preAllocatedVUs: 10,  // VUs iniciales
            maxVUs: 50,           // VUs máximos por si la API se pone lenta
        },
    },
    thresholds: {
        'http_req_duration': ['p(95)<1500'], 
        'success_rate': ['rate>0.97'], 
    },
};

const usersData = new SharedArray('users list', function () {
    const data = open('../data.csv'); 
    return papaparse.parse(data, { header: true }).data;
});

const authClient = new ApiClient(BASE_URL);

export default function () {
    const myVU = __VU;
    const userIndex = (myVU - 1) % usersData.length;
    const userData = usersData[userIndex];

    authClient.login(userData.user, userData.passwd);
    console.log(`## VU ${myVU} logged in with username: ${userData.user} and password: ${userData.passwd} ##`);
};