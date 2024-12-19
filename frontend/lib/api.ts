import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export const hotelApi = {
    getConversations: async () => {
        const response = await api.get('/hotel/conversations');
        return response.data;
    },
    sendMessage: async (conversationId: number, message: string) => {
        const response = await api.post(`/hotel/conversations/${conversationId}/messages`, { content: message });
        return response.data;
    },
    updateConversationStatus: async (conversationId: number, status: string) => {
        const response = await api.patch(`/hotel/conversations/${conversationId}`, { status });
        return response.data;
    },
};
