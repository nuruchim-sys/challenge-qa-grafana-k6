import http from 'k6/http';
import { Counter, Trend, Rate } from 'k6/metrics';

// --- DEFINE METRICS HERE ---
const reqTiming = new Trend('request_timing');
const successRate = new Rate('success_rate');
const stepErrors = new Counter('step_errors');

export default class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
        this.params = {
            headers: {
                'User-Agent': 'k6-load-tester',
                'Content-Type': 'application/json',
            },
            redirects: 0,
        };
    };

    _record(res, stepName, mustStatus = 200) {
        if (!res || !res.status || !res.timings) {
            stepErrors.add(1, { step: stepName });
            successRate.add(false, { step: stepName });
            return false;
        }
        // --- ADD TIMINGS ---
        reqTiming.add(res.timings.duration, { step: stepName });
        const ok = res.status === mustStatus;
        successRate.add(ok, { step: stepName });
        if (!ok) 
            stepErrors.add(1, { step: stepName });
        return ok;
    }


    login(username, password) {
        const endpoint = this.baseUrl + 'auth/login';
        const payload = JSON.stringify({
            username: username,
            password: password
        });
        
        const res = http.post(endpoint, payload, this.params);
        this._record(res, 'login', 201);

        console.log(`Status de respuesta: ${res.status}`);
        console.log(`Cuerpo de respuesta: ${res.body}`);
        
        try {
            const jsonResponse = JSON.parse(res.body);
            return jsonResponse;
        } catch (e) {
            return null;
        }
    }
};