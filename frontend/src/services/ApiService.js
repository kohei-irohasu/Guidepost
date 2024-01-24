import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const LoginService = {
    login: async (email, password) => {
        try {
            const response = await api.post(`${BASE_URL}/auth/login/`, {
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
            const response = await api.post(`${BASE_URL}/accounts/register/`, {
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

export const UserService = {

    getUserProfile: async() => {
        try {
          const response = await api.get(`${BASE_URL}/accounts/profile/`);
          return response.data; 
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
};

const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

// 共通前処理
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `JWT ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        switch (error.response?.status) {
            case 400: {
                const message = Object.values(error.response.data).flat();
                return Promise.reject({ level: "warning", message: message });
            }
            case 401: {
                const token = localStorage.getItem("access");
                if (token) {
                    localStorage.removeItem("access");
                    return Promise.reject(new Error("ログイン有効期限切れです。"));
                } else {
                    return Promise.reject(new Error("認証エラーです。"));
                }
            }
            case 403: {
                return Promise.reject(new Error("権限エラーです"));
            }
            default:
                return Promise.reject(new Error("想定外のエラーが発生しました。"));
        }
    }
);