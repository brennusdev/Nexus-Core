/* ==========================================================================
   NEXUS CORE — Lógica do Login/Cadastro
   ==========================================================================
   FASE 2:
   - Alternância de abas Entrar/Cadastrar
   - Validação dos formulários
   - Redirecionamento para dashboard.html após autenticação
   ========================================================================== */

(function () {
    "use strict";

    const tabs = document.querySelectorAll("[data-tab]");
    const forms = { login: null, register: null };
    const loader = document.getElementById("loader");
    const yearEl = document.getElementById("year");

    document.querySelectorAll("[data-form]").forEach((form) => {
        forms[form.dataset.form] = form;
    });

    /* --- Abas --- */
    function activateTab(tabName) {
        tabs.forEach((tab) => {
            const isActive = tab.dataset.tab === tabName;
            tab.classList.toggle("auth-tabs__tab--active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
        });
        Object.entries(forms).forEach(([name, form]) => {
            if (!form) return;
            form.hidden = name !== tabName;
        });
    }

    tabs.forEach((tab) => tab.addEventListener("click", () => activateTab(tab.dataset.tab)));

    /* --- Validação --- */
    function setError(form, fieldName, message) {
        const input = form.querySelector(`[name="${fieldName}"]`);
        const err = form.querySelector(`[data-error="${form.dataset.form}-${fieldName}"]`);
        if (err) err.textContent = message;
        if (input) input.style.borderColor = message ? "var(--color-error)" : "";
        return !message;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateLogin(form) {
        const email = form.email.value.trim();
        const password = form.password.value;
        let ok = true;

        ok = setError(form, "email", !email
            ? "Informe seu e-mail." : !emailRe.test(email) ? "E-mail inválido." : "") && ok;

        ok = setError(form, "password", password.length < 6
            ? "A senha deve ter pelo menos 6 caracteres." : "") && ok;

        return ok;
    }

    function validateRegister(form) {
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirm = form.confirm.value;
        let ok = true;

        ok = setError(form, "name", name.length < 3 ? "Informe seu nome completo." : "") && ok;
        ok = setError(form, "email", !email ? "Informe seu e-mail." : !emailRe.test(email) ? "E-mail inválido." : "") && ok;
        ok = setError(form, "password", password.length < 6 ? "A senha deve ter pelo menos 6 caracteres." : "") && ok;
        ok = setError(form, "confirm", confirm !== password ? "As senhas não coincidem." : "") && ok;

        return ok;
    }

    const validators = { login: validateLogin, register: validateRegister };

    /* URL da API FastAPI definida em js/config.js. */
    const API_BASE = window.NEXUS_API_URL.replace(/\/+$/, "");

    /* --- Submit + chamada real a API --- */
    Object.entries(forms).forEach(([name, form]) => {
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (!validators[name](form)) return;

            // Mostra loader e trava o formulario
            loader.hidden = false;
            form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));

            const isRegister = name === "register";
            const url = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
            const body = isRegister
                ? {
                    name: form.name.value.trim(),
                    email: form.email.value.trim(),
                    password: form.password.value
                }
                : {
                    email: form.email.value.trim(),
                    password: form.password.value
                };

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    // 409 = e-mail ja cadastrado; 401 = credenciais invalidas;
                    // 422 = erro de validacao do Pydantic.
                    const msg = data.detail
                        ? (typeof data.detail === "string"
                            ? data.detail
                            : "Verifique os campos e tente novamente.")
                        : `Erro ${response.status}. Tente novamente.`;
                    setError(form, isRegister ? "email" : "email", msg);
                    return; // finally reabilita o formulario
                }

                // Sucesso: guarda token + usuario e vai pro dashboard
                if (isRegister) {
                    // Cadastro nao retorna token: faz login automatico
                    const loginRes = await fetch(`${API_BASE}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: body.email, password: body.password })
                    });
                    if (!loginRes.ok) throw new Error("auto-login falhou");
                    const loginData = await loginRes.json();
                    localStorage.setItem("nexus_token", loginData.access_token);
                    localStorage.setItem("nexus_user", loginData.user.name);
                } else {
                    localStorage.setItem("nexus_token", data.access_token);
                    localStorage.setItem("nexus_user", data.user.name);
                }

                window.location.href = "dashboard.html";
            } catch (err) {
                // Backend offline ou erro de rede/CORS
                setError(form, "email",
                    "Nao foi possivel conectar ao servidor. Verifique se a API esta rodando em " + API_BASE + ".");
            } finally {
                loader.hidden = true;
                form.querySelectorAll("input, button").forEach((el) => (el.disabled = false));
            }
        });

        form.addEventListener("input", (e) => setError(form, e.target.name, ""));
    });

/* --- Tema (4 fundos: claro, escuro, clássico, cyberpunk) --- */
    const themeToggle = document.getElementById("themeToggle");

    // Mesma ordem e rótulos do dashboard
    const THEME_ORDER = ["light", "dark", "classico", "cyberpunk"];
    const THEME_META = {
        light:     { icon: "☀️", label: "Claro" },
        dark:      { icon: "🌙", label: "Escuro" },
        classico:  { icon: "🏛️", label: "Clássico" },
        cyberpunk: { icon: "🌆", label: "Cyberpunk" }
    };

    function normalizeTheme(theme) {
        if (theme === "minimalista") return "light";
        return THEME_META[theme] ? theme : "light";
    }

    function applyTheme(theme) {
        theme = normalizeTheme(theme);
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("nexus_theme", theme);
        if (themeToggle) {
            const idx = THEME_ORDER.indexOf(theme);
            const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
            const meta = THEME_META[next];
            themeToggle.textContent = meta ? meta.icon : "🎨";
            themeToggle.title = `Tema: ${(THEME_META[theme] || { label: theme }).label} · Próximo: ${meta ? meta.label : ""}`;
        }
    }

    // Aplica tema salvo ao carregar
    applyTheme(localStorage.getItem("nexus_theme") || "light");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            const idx = THEME_ORDER.indexOf(current);
            const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length] || "light";
            applyTheme(next);
        });
    }

    /* --- Init --- */
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    const active = document.querySelector(".auth-tabs__tab--active");
    if (active) activateTab(active.dataset.tab);
})();
