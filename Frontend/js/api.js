(function () {
    "use strict";

    class ApiError extends Error {
        constructor(message, status, detail) {
            super(message);
            this.name = "ApiError";
            this.status = status;
            this.detail = detail;
        }
    }

    const apiBase = (window.NEXUS_API_URL || "").replace(/\/+$/, "");

    function getToken() {
        return localStorage.getItem("nexus_token") || sessionStorage.getItem("nexus_token");
    }

    function clearSession() {
        localStorage.removeItem("nexus_token");
        localStorage.removeItem("nexus_user");
        sessionStorage.removeItem("nexus_token");
        sessionStorage.removeItem("nexus_user");
    }

    function setUser(user) {
        localStorage.setItem("nexus_user", user.name);
        window.dispatchEvent(new CustomEvent("nexus:authenticated", { detail: user }));
    }

    function saveSession(data, remember) {
        clearSession();
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("nexus_token", data.access_token);
        storage.setItem("nexus_user", data.user.name);
        setUser(data.user);
    }

    async function request(path, options) {
        if (!apiBase) {
            throw new Error("A URL da API não está configurada.");
        }

        const { auth, ...fetchOptions } = options || {};
        const headers = new Headers(fetchOptions.headers || {});
        if (fetchOptions.body && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }

        const token = getToken();
        if (token && auth !== false) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        const response = await fetch(`${apiBase}${path}`, {
            ...fetchOptions,
            headers
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const detail = data && data.detail;
            const message = typeof detail === "string"
                ? detail
                : "Não foi possível concluir a solicitação. Verifique os dados e tente novamente.";
            throw new ApiError(message, response.status, detail);
        }

        return data;
    }

    async function login(credentials, remember) {
        const data = await request("/auth/login", {
            method: "POST",
            auth: false,
            body: JSON.stringify(credentials)
        });
        saveSession(data, remember);
        return data;
    }

    async function register(user) {
        return request("/auth/register", {
            method: "POST",
            auth: false,
            body: JSON.stringify(user)
        });
    }

    async function currentUser() {
        const user = await request("/auth/me");
        setUser(user);
        return user;
    }

    async function requireAuth() {
        if (!getToken()) {
            window.location.replace("index.html");
            return;
        }

        try {
            await currentUser();
            document.documentElement.classList.remove("auth-pending");
        } catch (error) {
            if (error.status === 401) {
                clearSession();
                window.location.replace("index.html");
                return;
            }

            const destination = new URL("index.html", window.location.href);
            destination.searchParams.set("auth_error", "unavailable");
            window.location.replace(destination.href);
        }
    }

    window.NexusApi = {
        ApiError,
        clearSession,
        currentUser,
        getToken,
        login,
        register,
        requireAuth
    };
})();
