import axios from "axios";

const BASE_URL = "http://localhost:8000";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

// 共通前処理
api.interceptors.request.use((config) => {
    if (!config.url.endsWith('/accounts/register/') && !config.url.endsWith('/auth/login/')) {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `JWT ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        switch (error.response?.status) {
            case 400:
            case 401: 
            case 403:
                const message = Object.values(error.response.data).flat();
                return Promise.reject({ level: "warning", message: message });
            default:
                return Promise.reject(new Error("想定外のエラーが発生しました。"));
        }
    }
);

// ログイン関係
export const LoginService = {
    login: async (email, password) => {
        try {
            const response = await api.post("/auth/login/", {
                email,
                password,
            });
            console.log("response:", response);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error("API Error:", error.response.data);
                throw new Error(error.response.data.non_field_errors[0]);
            } else if (error.request) {
                console.error("No response received:", error.request);
                throw new Error("サーバーからの応答がありません");
            } else {
                console.error("Request failed:", error);
                throw new Error(error.message);
            }
        }
    },

    register: async (email, password, password_confirm, nick_name) => {
        try {
            const response = await api.post("/accounts/register/", {
                email,
                password,
                password_confirm,
                nick_name,
            });
            return response.data;
        }   catch (error) {
            if (error.response) {
                const { data } = error.response;
                console.error("API Error:", data);
                throw new Error(data.email[0]);
            } else if (error.request) {
                console.error("No response received:", error.request);
                throw new Error("レスポンスがありません");
            } else {
                console.error("Request failed:", error);
                throw new Error(error.message);
            }
        }
    },
};

// ユーザー関係
export const UserService = {

    getUserProfile: async() => {
        try {
          const response = await api.get("/accounts/profile/");
          return response.data; 
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    updateUserProfile: async(editedUser) => {
        try {
            const response = await api.put("/accounts/update/", editedUser);
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    deleteUser: async(password) => {
        try {
            const response = await api.delete("/accounts/delete/",{
                data: { password },
            });
            
            if (response.status === 204) {
                return true;
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },
};