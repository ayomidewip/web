import { sharedAPI as api, API_BASE_URL } from './app.client.js';
import axios from 'axios';

// Simple auth service - just API calls
export const authService = {
    async login(credentials) {
        return await api.post('/auth/login', credentials);
    },

    async signup(userData) {
        return await api.post('/auth/signup', userData);
    },

    async logout() {
        return await api.post('/auth/logout');
    },

    async getUserProfile() {
        return await api.get('/auth/me');
    },

    async forgotPassword(email) {
        return await api.post('/auth/forgot-password', { email });
    },

    async resetPassword(resetData) {
        const { token, newPassword } = resetData;
        return await api.post(`/auth/reset-password/${token}`, { newPassword });
    },

    async refreshToken() {
        try {
            return await api.post('/auth/refresh-token');
        } catch (error) {
            throw error;
        }
    }
};

export default authService;
