/* ==========================================================================
   NEXUS CORE — Lógica do Frontend
   ==========================================================================
   Responsabilidades:
   1. Alternância das abas "Entrar" / "Cadastrar"
   2. Validação dos formulários (client-side)
   3. Exibição do loader durante o submit
   ========================================================================== */

(function () {
    "use strict";

    /* ------------------------------------------------------------------
       1. Elementos do DOM
       ------------------------------------------------------------------ */
    const tabs = document.querySelectorAll("[data-tab]");
    const forms = { login: null, register: null };
    const loader = document.getElementById("loader");
    const yearEl = document.getElementById("year");

    // Guarda referências dos formulários
    document.querySelectorAll("[data-form]").forEach((form) => {
        forms[form.dataset.form] = form;
    });

    /* ------------------------------------------------------------------
       2. Alternância de abas
       ------------------------------------------------------------------ */
    function activateTab(tabName) {
        tabs.forEach((tab) => {
            const isActive = tab.dataset.tab === tabName;
            tab.classList.toggle("auth-tabs__tab--active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
        });

        // Mostra/esconde os formulários correspondentes
        Object.entries(forms).forEach(([name, form]) => {
            if (!form) return;
            form.hidden = name !== tabName;
        });

        // Ancoragem de acessibilidade
        const panel = document.getElementById(
            tabName === "login" ? "panel-login" : "panel-register"
        );
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => activateTab(tab.dataset.tab));
    });

    /* ------------------------------------------------------------------
       3. Links de troca rápida (ex: "Já tem conta? Entrar")
       ------------------------------------------------------------------ */
    document.querySelectorAll("[data-switch]").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            activateTab(link.dataset.switch);
        });
    });

    /* ------------------------------------------------------------------
       4. Validação
       ------------------------------------------------------------------ */
    function setError(form, fieldName, message) {
        const input = form.querySelector(`[name="${fieldName}"]`);
        const errorSpan = form.querySelector(`[data-error="${form.dataset.form}-${fieldName}"]`);
        if (errorSpan) errorSpan.textContent = message;
        if (input) {
            input.style.borderColor = message ? "var(--color-error)" : "";
        }
        return !message;
    }

    function validateLogin(form) {
        const email = form.email.value.trim();
        const password = form.password.value;

        let valid = true;

        valid = setError(form, "email", !email
            ? "Informe seu e-mail."
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? "E-mail inválido."
                : ""
        ) && valid;

        valid = setError(form, "password", password.length < 6
            ? "A senha deve ter pelo menos 6 caracteres."
            : ""
        ) && valid;

        return valid;
    }

    function validateRegister(form) {
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirm = form.confirm.value;

        let valid = true;

        valid = setError(form, "name", name.length < 3
            ? "Informe seu nome completo."
            : ""
        ) && valid;

        valid = setError(form, "email", !email
            ? "Informe seu e-mail."
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? "E-mail inválido."
                : ""
        ) && valid;

        valid = setError(form, "password", password.length < 6
            ? "A senha deve ter pelo menos 6 caracteres."
            : ""
        ) && valid;

        valid = setError(form, "confirm", confirm !== password
            ? "As senhas não coincidem."
            : confirm.length === 0
                ? "Confirme sua senha."
                : ""
        ) && valid;

        return valid;
    }

    const validators = {
        login: validateLogin,
        register: validateRegister,
    };

    /* ------------------------------------------------------------------
       5. Submit dos formulários (com loader)
       ------------------------------------------------------------------ */
    Object.entries(forms).forEach(([name, form]) => {
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const isValid = validators[name](form);
            if (!isValid) return;

            loader.hidden = false;
            form.querySelectorAll("input, button").forEach((el) => {
                el.disabled = true;
            });

            // Simula envio (substituir por fetch() ao integrar ao backend)
            setTimeout(() => {
                loader.hidden = true;
                form.querySelectorAll("input, button").forEach((el) => {
                    el.disabled = false;
                });
                alert(`${name === "login" ? "Login" : "Cadastro"} realizado com sucesso!`);
            }, 1200);
        });

        // Limpa o erro do campo assim que o usuário digita
        form.addEventListener("input", (e) => {
            if (form.dataset.formName === undefined) return;
            setError(form, e.target.name, "");
        });
    });

    /* ------------------------------------------------------------------
       6. Inicialização
       ------------------------------------------------------------------ */
    // Mostra o ano atual no rodapé
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Garante que a aba ativa no HTML é respeitada
    const activeTab = document.querySelector(".auth-tabs__tab--active");
    if (activeTab) activateTab(activeTab.dataset.tab);
})();

