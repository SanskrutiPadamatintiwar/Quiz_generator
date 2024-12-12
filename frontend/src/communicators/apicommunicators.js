import axios from 'axios';

export const signup = async (data) => {
    try {
        const response = await axios.post(
            "http://localhost:5050/api/users/signup",
            data
            
        );
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
}

export const login = async (data) => {
    try {
        const response = await axios.post(
            "http://localhost:5050/api/auth/login",
            data
            
        );
        if(response.status===200){
            localStorage.setItem("token",response.data.data);
        }
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
}