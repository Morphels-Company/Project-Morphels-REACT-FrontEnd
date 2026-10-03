import api from "./api.js";

class MainRequests  {
    async onGet (route, search) {
        const response = await api.get(`/${route}`)
        return response.data
    }

    async onFilter(route, params) {
        const response = await api.post(`/${route}/filter`, params);
        return response.data
    }

    async onPost (route, params) {
        return await api.post(`/${route}`, params)

    }

    async onPut (route, params) {
        const response = await api.put(`/${route}`, params)
        return response.data
    }
    async onDelete (route, id) {
        await api.delete(`/${route}/${id}`)
    }

    async onLogin (route, params) {
        const response = await api.post(`/${route}/login`, params)
        return response.data
    }
}


export default MainRequests;