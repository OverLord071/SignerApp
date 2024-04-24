import axios from "axios";

const BASE_URL = "https://localhost:7159/api/DW/";

export const instance = axios.create({
    baseURL: BASE_URL,
})