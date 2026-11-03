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
                if (isRegister) {
                    await window.NexusApi.register(body);
                    await window.NexusApi.login(
                        { email: body.email, password: body.password },
                        false
                    );
                } else {
                    await window.NexusApi.login(body, Boolean(form.remember.checked));
                }

                window.location.href = "dashboard.html";
            } catch (err) {
                if (err.status === 401) {
                    setError(form, "password", err.message);
                } else if (err.status === 409) {
                    setError(form, "email", err.message);
                } else if (err.status === 422) {
                    setError(form, isRegister ? "email" : "password", err.message);
                } else {
                    console.error("Falha na autenticação com a API.", err);
                    setError(form, "email",
                        "Não foi possível conectar ao serviço de autenticação. Tente novamente.");
                }
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
