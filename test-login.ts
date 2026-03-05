import { authService } from './src/services/api';

async function test() {
    try {
        const result = await authService.login({ username: 'admin', password: 'password' }); // Assuming password or just seeing what error it gives
        console.log("Login result:", result);
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
