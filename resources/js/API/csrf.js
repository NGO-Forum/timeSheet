import axios from "axios";

export async function ensureCsrfCookie() {
    await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
        },
    });
}