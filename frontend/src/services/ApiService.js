import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const LoginService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/accounts/login/`, {
                email,
                password,
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error("API Error:", error.response.data);
                throw new Error(error.response.data.non_field_errors[0]);
            } else if (error.request) {
                console.error("No response received:", error.request);
                throw new Error("サーバーからの応答がありません");
            } else {
                console.error("Request failed:", error.message);
                throw new Error("リクエストが失敗しました");
            }
        }
    },

    register: async (email, password, password_confirm, nick_name) => {
        try {
            const response = await axios.post(`${BASE_URL}/accounts/register/`, {
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
                throw new Error(data.non_field_errors[0]);
            } else if (error.request) {
                console.error("No response received:", error.request);
                throw new Error("レスポンスがありません");
            } else {
                console.error("Request failed:", error.message);
                throw new Error("リクエストが失敗しました");
            }
        }
    }
}
