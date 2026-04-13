import ApiClient from './api.js';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const BASE_URL = 'https://fakestoreapi.com/';

export let options = {
    scenarios: {
        test: {
            executor: 'constant-arrival-rate',
            rate: 20,             
            timeUnit: '1s',       
            duration: '1m',       
            preAllocatedVUs: 10,  
            maxVUs: 50,           
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