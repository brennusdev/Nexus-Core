/* ==========================================================================
   NEXUS CORE — Dashboard Logic
   ==========================================================================
   Funcionalidades:
   1. Sidebar (toggle + logout)
   2. Tema escuro/claro (toggle)
   3. Relógio ao vivo
   4. Calendário interativo + adicionar tarefas do dia
   5. Widgets rápidos (navegação via app.html)
   6. Gráfico de Progresso Semanal
   7. Tarefa do dia (adicionar)
   ========================================================================== */

(function () {
    "use strict";

    document.documentElement.setAttribute("data-theme", localStorage.getItem("nexus_theme") || "light");

    /* ============================================================
       1. SIDEBAR + USUÁRIO
       ============================================================ */
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebarToggle");
    const logoutBtn = document.getElementById("logoutBtn");

    const userName = localStorage.getItem("nexus_user") || "BlackCode";
    const init = (userName || "B").charAt(0).toUpperCase();

    const userNameEl = document.getElementById("userName");
    const welcomeName = document.getElementById("welcomeName");
    const userAvatar = document.getElementById("userAvatar");
    const avatarTop = document.getElementById("avatarTop");

    if (userNameEl) userNameEl.textContent = userName;
    if (welcomeName) welcomeName.textContent = userName.split(" ")[0];
    if (userAvatar) userAvatar.textContent = init;
    if (avatarTop) avatarTop.textContent = init;

    if (toggle) toggle.addEventListener("click", () => sidebar.classList.toggle("sidebar--open"));
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("nexus_user");
        window.location.href = "index.html";
    });

/* ============================================================
       2. TEMA — 5 temas customizáveis (claro, escuro, cyberpunk,
          minimalista, clássico)
       ============================================================ */
    const themeToggle = document.getElementById("themeToggle");
    const themePicker = document.querySelector(".theme-picker");
    const themeMenu = document.getElementById("themeMenu");
    const themeOptions = document.querySelectorAll(".theme-opt");

    const assistantToggle = document.getElementById("assistantToggle");
    const assistantPanel = document.getElementById("assistantPanel");
    const assistantClose = document.getElementById("assistantClose");
    const assistantMessages = document.getElementById("assistantMessages");
    const assistantForm = document.getElementById("assistantForm");
    const assistantInput = document.getElementById("assistantInput");
    const assistantChips = document.querySelectorAll(".assistant-chip");

    const ASSISTANT_STORAGE_KEY = "nexus_assistant_messages";
    const ASSISTANT_OPEN_KEY = "nexus_assistant_open";

    let assistantConversation = JSON.parse(localStorage.getItem(ASSISTANT_STORAGE_KEY) || "[]");
    if (!assistantConversation.length) {
        assistantConversation = [
            { role: "bot", text: "Olá! Eu sou o Assistente Nexus. Posso te ajudar com foco, organização e sugestões de navegação." }
        ];
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;");
    }

    function renderAssistantMessages() {
        if (!assistantMessages) return;
        assistantMessages.innerHTML = assistantConversation
            .map((message) => `<div class="assistant-msg assistant-msg--${message.role}">${escapeHtml(message.text)}</div>`)
            .join("");
        assistantMessages.scrollTop = assistantMessages.scrollHeight;
    }

    function saveAssistantConversation() {
        localStorage.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(assistantConversation));
    }

    function openAssistantPanel() {
        if (!assistantPanel) return;
        assistantPanel.classList.add("assistant-panel--open");
        assistantPanel.setAttribute("aria-hidden", "false");
        document.body.classList.add("assistant-open");
        if (assistantToggle) assistantToggle.classList.add("is-active");
        localStorage.setItem(ASSISTANT_OPEN_KEY, "1");
        if (assistantInput) assistantInput.focus();
    }

    function closeAssistantPanel() {
        if (!assistantPanel) return;
        assistantPanel.classList.remove("assistant-panel--open");
        assistantPanel.setAttribute("aria-hidden", "true");
        document.body.classList.remove("assistant-open");
        if (assistantToggle) assistantToggle.classList.remove("is-active");
        localStorage.setItem(ASSISTANT_OPEN_KEY, "0");
    }

    function answerAssistant(prompt) {
        const text = prompt.trim().toLowerCase();
        if (text.includes("resumo") || text.includes("semana")) {
            return "Seu fluxo está equilibrado: foco, estudos e metas estão em alta. Recomendo revisar duas tarefas de alto impacto hoje.";
        }
        if (text.includes("tarefa") || text.includes("organizar")) {
            return "Posso te ajudar a priorizar em ordem: 1) concluir o bloco mais importante, 2) revisar pendências curtas e 3) deixar espaço para descanso.";
        }
        if (text.includes("foco") || text.includes("produtividade")) {
            return "Para ganhar foco, use ciclos curtos de 25 minutos e registre o próximo passo antes de começar.";
        }
        return "Estou aqui para apoiar sua rotina: posso resumir sua semana, organizar tarefas ou sugerir um plano de foco.";
    }

    function sendAssistantPrompt(prompt) {
        const value = prompt.trim();
        if (!value) return;
        assistantConversation.push({ role: "user", text: value });
        saveAssistantConversation();
        renderAssistantMessages();
        window.setTimeout(() => {
            assistantConversation.push({ role: "bot", text: answerAssistant(value) });
            saveAssistantConversation();
            renderAssistantMessages();
        }, 220);
    }

    if (assistantToggle) {
        assistantToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            if (assistantPanel && assistantPanel.classList.contains("assistant-panel--open")) {
                closeAssistantPanel();
            } else {
                openAssistantPanel();
            }
        });
    }

    if (assistantClose) assistantClose.addEventListener("click", closeAssistantPanel);
    if (assistantPanel) {
        assistantPanel.addEventListener("click", (event) => {
            if (event.target === assistantPanel) closeAssistantPanel();
        });
    }

    if (assistantForm) {
        assistantForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (assistantInput) sendAssistantPrompt(assistantInput.value);
            if (assistantInput) assistantInput.value = "";
        });
    }

    assistantChips.forEach((chip) => {
        chip.addEventListener("click", () => sendAssistantPrompt(chip.dataset.prompt));
    });

    document.addEventListener("click", (event) => {
        if (assistantPanel && assistantPanel.classList.contains("assistant-panel--open") && !assistantPanel.contains(event.target) && event.target !== assistantToggle) {
            closeAssistantPanel();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && assistantPanel && assistantPanel.classList.contains("assistant-panel--open")) {
            closeAssistantPanel();
        }
    });

    renderAssistantMessages();
    if (localStorage.getItem(ASSISTANT_OPEN_KEY) === "1") {
        openAssistantPanel();
    }

    // Lista ordenada de temas disponíveis (cicla ao clicar)
    const THEME_ORDER = ["light", "dark", "cyberpunk", "minimalista", "classico"];

    // Rótulos/ícones de cada tema (para o botão mostrar o próximo)
    const THEME_META = {
        light:      { icon: "☀️", label: "Claro" },
        dark:       { icon: "🌙", label: "Escuro" },
        cyberpunk:  { icon: "🌆", label: "Cyberpunk" },
        minimalista:{ icon: "◻️", label: "Minimalista" },
        classico:   { icon: "🏛️", label: "Clássico" }
    };

    // Aplica o tema salvo no carregamento
    function initTheme() {
        const saved = localStorage.getItem("nexus_theme") || "light";
        applyTheme(saved, false);
    }

    function applyTheme(theme, persist) {
        if (persist !== false) persist = true;
        document.documentElement.setAttribute("data-theme", theme);
        if (persist) localStorage.setItem("nexus_theme", theme);

        // Marca o tema ativo no menu
        themeOptions.forEach((opt) => {
            opt.classList.toggle("is-active", opt.dataset.theme === theme);
        });

        // Atualiza o ícone do toggle para o PRÓXIMO tema (dica de navegação)
        if (themeToggle) {
            const idx = THEME_ORDER.indexOf(theme);
            const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
            const meta = THEME_META[next];
            themeToggle.textContent = meta ? meta.icon : "🎨";
            themeToggle.title = `Tema: ${(THEME_META[theme] || { label: theme }).label} · Próximo: ${meta ? meta.label : ""}`;
        }
    }

    // Abre/fecha o dropdown ao clicar no botão do tema
    if (themeToggle && themePicker) {
        themeToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = themePicker.classList.toggle("is-open");
            if (themeMenu) themeMenu.hidden = !isOpen;
        });
    }

    // Seleciona um tema diretamente pela lista
    themeOptions.forEach((opt) => {
        opt.addEventListener("click", () => {
            applyTheme(opt.dataset.theme);
            if (themePicker) themePicker.classList.remove("is-open");
            if (themeMenu) themeMenu.hidden = true;
        });
    });

    // Fecha o dropdown ao clicar fora
    document.addEventListener("click", (e) => {
        if (themePicker && !themePicker.contains(e.target)) {
            themePicker.classList.remove("is-open");
            if (themeMenu) themeMenu.hidden = true;
        }
    });

    // Esc fecha o dropdown
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && themePicker) {
            themePicker.classList.remove("is-open");
            if (themeMenu) themeMenu.hidden = true;
        }
    });

    initTheme();

    /* ============================================================
       3. RELÓGIO
       ============================================================ */
    const WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const clockTime = document.getElementById("clockTime");
    const clockWeekday = document.getElementById("clockWeekday");
    const clockFullDate = document.getElementById("clockFullDate");

    function updateClock() {
        const now = new Date();
        if (clockTime) clockTime.textContent = now.toLocaleTimeString("pt-BR", { hour12: false });
        if (clockWeekday) clockWeekday.textContent = WEEKDAYS[now.getDay()];
        if (clockFullDate) clockFullDate.textContent = `${now.getDate()} de ${MONTHS[now.getMonth()]} de ${now.getFullYear()}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* ============================================================
       4. CALENDÁRIO
       ============================================================ */
    const calGrid = document.getElementById("calGrid");
    const calMonthLabel = document.getElementById("calMonthLabel");
    const calPrev = document.getElementById("calPrev");
    const calNext = document.getElementById("calNext");
    const calTaskInput = document.getElementById("calTask");
    const calAddBtn = document.getElementById("calAddBtn");
    const calTasks = document.getElementById("calTasks");

    let calDate = new Date();
    let storedTasks = JSON.parse(localStorage.getItem("nexus_cal_tasks") || "[]");

    function renderCalendar() {
        const year = calDate.getFullYear();
        const month = calDate.getMonth();
        calMonthLabel.textContent = `${MONTHS[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        let html = WEEKDAYS.map((d) => `<span class="cal-dow">${d.slice(0, 3)}</span>`).join("");
        for (let i = 0; i < firstDay; i++) html += `<span class="cal-day cal-day--other"></span>`;
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            html += `<span class="cal-day${isToday ? " cal-day--today" : ""}" data-day="${d}">${d}</span>`;
        }
        calGrid.innerHTML = html;
        renderTasks();
    }

    function renderTasks() {
        calTasks.innerHTML = "";
        const key = `${calDate.getFullYear()}-${calDate.getMonth()}`;
        storedTasks.filter((t) => t.key === key).forEach((t) => {
            const li = document.createElement("li");
            li.textContent = `Dia ${t.day}: ${t.text}`;
            calTasks.appendChild(li);
        });
    }

    function addTask() {
        const text = calTaskInput.value.trim();
        if (!text) return;
        const key = `${calDate.getFullYear()}-${calDate.getMonth()}`;
        storedTasks.push({ key, day: calDate.getDate(), text });
        localStorage.setItem("nexus_cal_tasks", JSON.stringify(storedTasks));
        calTaskInput.value = "";
        renderTasks();
    }

    if (calPrev) calPrev.addEventListener("click", () => { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); });
    if (calNext) calNext.addEventListener("click", () => { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); });
    if (calAddBtn) calAddBtn.addEventListener("click", addTask);
    if (calTaskInput) calTaskInput.addEventListener("keydown", (e) => { if (e.key === "Enter") addTask(); });
    renderCalendar();

/* ============================================================
       4.5 RESUMO FINANCEIRO — cálculo automático
       ============================================================ */
    const finIn = document.getElementById("finIn");
    const finOut = document.getElementById("finOut");
    const finInv = document.getElementById("finInv");
    const finBal = document.getElementById("finBal");

    function formatBRL(v) {
        return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

function updateFinance() {
        if (!finBal) return;
        const receitas = parseFloat(finIn && finIn.value ? finIn.value : 0) || 0;
        const despesas = parseFloat(finOut && finOut.value ? finOut.value : 0) || 0;
        const invest = parseFloat(finInv && finInv.value ? finInv.value : 0) || 0;
        const saldo = receitas - despesas + invest;
        finBal.textContent = formatBRL(saldo);
        // Salvar valores no localStorage
        localStorage.setItem("nexus_fin_in", finIn ? finIn.value : "");
        localStorage.setItem("nexus_fin_out", finOut ? finOut.value : "");
        localStorage.setItem("nexus_fin_inv", finInv ? finInv.value : "");
        updateFinanceDonut(receitas, despesas, invest);
    }

    // Atualiza o gráfico donut financeiro com base nos valores
    function updateFinanceDonut(receitas, despesas, invest) {
        const segIn = document.getElementById("finSegIn");
        const segOut = document.getElementById("finSegOut");
        const segInv = document.getElementById("finSegInv");
        const totalEl = document.getElementById("finDonutTotal");
        if (!segIn || !segOut || !segInv) return;

        const total = receitas + despesas + invest;
        const C = 2 * Math.PI * 15.9; // circunferência do círculo (r=15.9)

        function setSeg(el, value, color) {
            if (total <= 0 || value <= 0) {
                el.style.strokeDasharray = "0 " + C;
                el.style.strokeDashoffset = "0";
                return;
            }
            const frac = value / total;
            el.style.strokeDasharray = (frac * C) + " " + C;
            el.style.strokeDashoffset = "0";
        }

        setSeg(segIn, receitas, "var(--color-success)");
        setSeg(segOut, despesas, "var(--color-error)");
        setSeg(segInv, invest, "var(--color-primary)");

        if (totalEl) totalEl.textContent = formatBRL(total);
    }

    // Carregar valores salvos
    if (finIn && localStorage.getItem("nexus_fin_in")) finIn.value = localStorage.getItem("nexus_fin_in");
    if (finOut && localStorage.getItem("nexus_fin_out")) finOut.value = localStorage.getItem("nexus_fin_out");
    if (finInv && localStorage.getItem("nexus_fin_inv")) finInv.value = localStorage.getItem("nexus_fin_inv");

    if (finIn) finIn.addEventListener("input", updateFinance);
    if (finOut) finOut.addEventListener("input", updateFinance);
    if (finInv) finInv.addEventListener("input", updateFinance);
    updateFinance();

/* ============================================================
       5. WIDGETS RÁPIDOS (navegação)
       ============================================================ */
    document.querySelectorAll(".qmini").forEach((btn) => {
        btn.addEventListener("click", () => {
            // O widget Pomodoro abre o Modo Foco (overlay) em vez de navegar
            if (btn.id === "pomoFocusBtn") {
                openFocusMode();
                return;
            }
            const app = btn.dataset.open;
            window.location.href = `app.html?app=${app}`;
        });
    });

    /* ============================================================
       5.1 MODO FOCO — Pomodoro + Tarefa Atual (overlay tela cheia)
       ============================================================ */
    const focusOverlay = document.getElementById("focusOverlay");
    const focusClose = document.getElementById("focusClose");
    const focusTimer = document.getElementById("focusTimer");
    const focusModeLabel = document.getElementById("focusModeLabel");
    const focusTaskSelect = document.getElementById("focusTaskSelect");
    const focusStartBtn = document.getElementById("focusStartBtn");
    const focusResetBtn = document.getElementById("focusResetBtn");
    const focusCycleText = document.getElementById("focusCycleText");

    const FOCUS_WORK = 25 * 60;   // 25 min
    const FOCUS_BREAK = 5 * 60;   // 5 min
    const FOCUS_CYCLES = 4;

    let focusTimerId = null;
    let focusRemaining = FOCUS_WORK;
    let focusRunning = false;
    let focusIsBreak = false;
    let focusCycle = 1;

    // Lê as tarefas pendentes da lista "Tarefa do Dia"
    function getTodoTasks() {
        const todoList = document.getElementById("todoList");
        const tasks = [];
        if (todoList) {
            todoList.querySelectorAll("li").forEach((li) => {
                const cb = li.querySelector('input[type="checkbox"]');
                const textEl = li.querySelector("label");
                if (!textEl) return;
                // Ignora tarefas já concluídas (checkbox marcado)
                if (cb && cb.checked) return;
                const text = textEl.textContent.trim().replace(/\s+/g, " ");
                if (text) tasks.push(text);
            });
        }
        return tasks;
    }

    function renderFocusTasks() {
        const tasks = getTodoTasks();
        const current = focusTaskSelect.value;
        focusTaskSelect.innerHTML = tasks.length
            ? tasks.map((t, i) => `<option value="${i}">${escapeHtml(t)}</option>`).join("")
            : `<option value="">Nenhuma tarefa pendente</option>`;
        // Tenta preservar a seleção anterior
        if (tasks.length) {
            const idx = parseInt(current, 10);
            focusTaskSelect.value = (idx >= 0 && idx < tasks.length) ? idx : 0;
        }
    }

    function formatFocusTime(sec) {
        const m = String(Math.floor(sec / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");
        return `${m}:${s}`;
    }

    function updateFocusUI() {
        if (focusTimer) focusTimer.textContent = formatFocusTime(focusRemaining);
        if (focusModeLabel) focusModeLabel.textContent = focusIsBreak ? "☕ Pausa" : "🎯 Foco";
        if (focusCycleText) focusCycleText.textContent = `Ciclo ${focusCycle}/${FOCUS_CYCLES}`;
        if (focusStartBtn) focusStartBtn.textContent = focusRunning ? "⏸ Pausar" : "▶ Iniciar Foco";
    }

    function tickFocus() {
        focusRemaining--;
        if (focusRemaining <= 0) {
            // Troca entre foco e pausa
            if (!focusIsBreak) {
                // Foco terminou -> pausa
                focusIsBreak = true;
                focusRemaining = FOCUS_BREAK;
            } else {
                // Pausa terminou -> próximo ciclo de foco
                focusIsBreak = false;
                focusCycle = (focusCycle % FOCUS_CYCLES) + 1;
                // Após o 4º ciclo, volta ao início
                if (focusCycle === 1) {
                    stopFocusTimer();
                    focusRemaining = FOCUS_WORK;
                    updateFocusUI();
                    return;
                }
                focusRemaining = FOCUS_WORK;
            }
        }
        updateFocusUI();
    }

    function startFocusTimer() {
        if (focusTimerId) return;
        focusRunning = true;
        focusTimerId = setInterval(tickFocus, 1000);
        updateFocusUI();
    }

    function stopFocusTimer() {
        if (focusTimerId) {
            clearInterval(focusTimerId);
            focusTimerId = null;
        }
        focusRunning = false;
        updateFocusUI();
    }

    function resetFocusTimer() {
        stopFocusTimer();
        focusRemaining = FOCUS_WORK;
        focusIsBreak = false;
        focusCycle = 1;
        updateFocusUI();
    }

    function openFocusMode() {
        renderFocusTasks();
        resetFocusTimer();
        if (focusOverlay) focusOverlay.hidden = false;
    }

    function closeFocusMode() {
        stopFocusTimer();
        if (focusOverlay) focusOverlay.hidden = true;
    }

    if (focusClose) focusClose.addEventListener("click", closeFocusMode);
    if (focusOverlay) {
        focusOverlay.addEventListener("click", (e) => {
            if (e.target === focusOverlay) closeFocusMode();
        });
    }
    if (focusStartBtn) {
        focusStartBtn.addEventListener("click", () => {
            if (focusRunning) {
                stopFocusTimer();
            } else {
                // Se não há tarefa selecionada (nenhuma pendente), ainda permite focar
                startFocusTimer();
            }
        });
    }
    if (focusResetBtn) focusResetBtn.addEventListener("click", resetFocusTimer);
    if (focusTaskSelect) focusTaskSelect.addEventListener("change", renderFocusTasks);

    // Esc (tecla) fecha o modo foco
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && focusOverlay && !focusOverlay.hidden) {
            closeFocusMode();
        }
    });

    /* ============================================================
       6. GRÁFICO PROGRESSO SEMANAL
       ============================================================ */
    const weeklyChart = document.getElementById("weeklyChart");
    const wTabs = document.querySelectorAll(".wtab");
    const weekData = [40, 65, 55, 80, 70, 90, 60];
    const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    function renderChart(labels, data) {
        if (!weeklyChart) return;
        weeklyChart.innerHTML = "";
        const max = Math.max(...data, 1);
data.forEach((v, i) => {
            const bar = document.createElement("div");
            bar.className = "chart-bar";
            bar.style.height = (v / max * 100) + "%";
            bar.innerHTML = `<span class="chart-val">${v}%</span><span>${labels[i]}</span>`;
            bar.title = `${labels[i]}: ${v}%`;
            weeklyChart.appendChild(bar);
        });
    }

    if (wTabs) {
        wTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                wTabs.forEach((t) => t.classList.remove("wtab--active"));
                tab.classList.add("wtab--active");
                renderChart(DAYS, weekData);
            });
        });
    }
    renderChart(DAYS, weekData);

    /* ============================================================
       7. MÚSICA — refletir serviço configurado
       ============================================================ */
    const musicService = localStorage.getItem("nexus_music_service");
    const musicName = localStorage.getItem("nexus_music_name");

    const musicGrid = document.getElementById("musicGrid");
    const mpTitle = document.getElementById("mpTitle");
    const mpArtist = document.getElementById("mpArtist");
    const mpPlayBtn = document.getElementById("mpPlayBtn");

    if (musicGrid) {
        musicGrid.querySelectorAll(".music-item").forEach((btn) => {
            btn.addEventListener("click", () => {
                localStorage.setItem("nexus_music_service", btn.dataset.service);
                const labels = {
                    youtube: "YouTube Music",
                    spotify: "Spotify",
                    deezer: "Deezer",
                    soundcloud: "SoundCloud"
                };
                localStorage.setItem("nexus_music_name", labels[btn.dataset.service]);
                if (mpTitle) mpTitle.textContent = `Conectado ao ${labels[btn.dataset.service]}`;
                if (mpArtist) mpArtist.textContent = "Clique em ▶ para tocar";
                if (mpPlayBtn) mpPlayBtn.disabled = false;
            });
        });
    }

    if (musicService && mpTitle) {
        mpTitle.textContent = `Conectado ao ${musicName || musicService}`;
        if (mpArtist) mpArtist.textContent = "Clique em ▶ para tocar";
        if (mpPlayBtn) mpPlayBtn.disabled = false;
    }

    if (mpPlayBtn) {
        mpPlayBtn.addEventListener("click", () => {
            const service = localStorage.getItem("nexus_music_service") || "spotify";
            const urls = {
                youtube: "https://music.youtube.com",
                spotify: "https://open.spotify.com",
                deezer: "https://www.deezer.com",
                soundcloud: "https://soundcloud.com"
            };
            window.open(urls[service] || urls.spotify, "_blank");
        });
    }

    /* ============================================================
       8. TAREFA DO DIA (adicionar)
       ============================================================ */
    const todoAdd = document.getElementById("todoAdd");
    const todoList = document.getElementById("todoList");

if (todoAdd && todoList) {
        todoAdd.addEventListener("click", () => {
            const text = prompt("Nova tarefa do dia:");
            if (!text || !text.trim()) return;
            const li = document.createElement("li");
            const label = document.createElement("label");
            const cb = document.createElement("input");
            cb.type = "checkbox";
            label.appendChild(cb);
            label.appendChild(document.createTextNode(" " + text.trim()));
            li.appendChild(label);
            todoList.appendChild(li);
        });
    }

    /* ============================================================
       9. VISÃO GERAL — legenda interativa do radar
       ============================================================ */
    const radarLabels = document.querySelectorAll(".radar-labels text");
    const radarLegend = document.getElementById("radarLegend");

    function setRadarActive(ind, active) {
        radarLabels.forEach((t, i) => {
            if (i === ind) t.classList.toggle("radar-label--active", active);
        });
    }

    if (radarLegend) {
        radarLegend.querySelectorAll(".radar-legend__item").forEach((item) => {
            item.addEventListener("mouseenter", () => {
                const ind = parseInt(item.dataset.ind, 10);
                item.classList.add("radar-legend__item--active");
                setRadarActive(ind, true);
            });
            item.addEventListener("mouseleave", () => {
                item.classList.remove("radar-legend__item--active");
                setRadarActive(parseInt(item.dataset.ind, 10), false);
            });
            item.addEventListener("click", () => {
                const ind = parseInt(item.dataset.ind, 10);
                const isActive = item.classList.toggle("radar-legend__item--active");
                setRadarActive(ind, isActive);
            });
        });
    }

    /* ============================================================
       10. META DO MÊS — CRUD com categorias + localStorage
       ============================================================ */
    const META_CATS = ["desenvolvimento", "networking", "hobbie", "outros"];
    const META_STORAGE_KEY = "nexus_metas";

    // Carrega metas salvas ou inicializa com dados de exemplo
    function loadMetas() {
        const raw = localStorage.getItem(META_STORAGE_KEY);
        if (raw) {
            try { return JSON.parse(raw); } catch (e) { /* ignore */ }
        }
        return [
            { id: Date.now() + 1, cat: "desenvolvimento", text: "Concluir projeto Nexus", prog: 80 },
            { id: Date.now() + 2, cat: "outros", text: "Ler 2 livros", prog: 50 },
            { id: Date.now() + 3, cat: "outros", text: "Economizar R$500", prog: 30 }
        ];
    }

    let metas = loadMetas();

    function saveMetas() {
        localStorage.setItem(META_STORAGE_KEY, JSON.stringify(metas));
    }

    // Renderiza todas as metas nas categorias
    function renderMetas() {
        document.querySelectorAll(".meta-cat").forEach((catEl) => {
            const cat = catEl.dataset.cat;
            const ul = catEl.querySelector(".meta-list--grouped");
            if (!ul) return;
            const items = metas.filter((m) => m.cat === cat);
            if (items.length === 0) {
                ul.innerHTML = `<li class="meta-empty">Nenhuma meta ainda.</li>`;
                return;
            }
            ul.innerHTML = items.map((m) => `
                <li class="meta-item" data-id="${m.id}">
                    <div class="meta-item__top">
                        <span class="meta-item__text">${escapeHtml(m.text)}</span>
                        <span class="meta-item__actions">
                            <button class="meta-edit" data-id="${m.id}" title="Editar">✏️</button>
                            <button class="meta-del" data-id="${m.id}" title="Remover">🗑️</button>
                        </span>
                    </div>
                    <div class="meta-progress"><span style="width:${m.prog}%"></span></div>
                    <span class="meta-progress-val">${m.prog}%</span>
                </li>`).join("");
        });
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    // Referências do formulário
    const metaForm = document.getElementById("metaForm");
    const metaAddBtn = document.getElementById("metaAddBtn");
    const metaCancel = document.getElementById("metaCancel");
    const metaCat = document.getElementById("metaCat");
    const metaText = document.getElementById("metaText");
    const metaProg = document.getElementById("metaProg");
    const metaProgVal = document.getElementById("metaProgVal");

    let editingMetaId = null;

    function openMetaForm(meta) {
        if (metaForm) metaForm.hidden = false;
        editingMetaId = meta ? meta.id : null;
        if (metaCat) metaCat.value = meta ? meta.cat : "desenvolvimento";
        if (metaText) { metaText.value = meta ? meta.text : ""; metaText.focus(); }
        if (metaProg) metaProg.value = meta ? meta.prog : 0;
        if (metaProgVal) metaProgVal.textContent = (meta ? meta.prog : 0) + "%";
    }

    function closeMetaForm() {
        if (metaForm) metaForm.hidden = true;
        editingMetaId = null;
    }

    if (metaAddBtn) metaAddBtn.addEventListener("click", () => openMetaForm(null));
    if (metaCancel) metaCancel.addEventListener("click", closeMetaForm);
    if (metaProg) metaProg.addEventListener("input", () => {
        if (metaProgVal) metaProgVal.textContent = metaProg.value + "%";
    });

    if (metaForm) {
        metaForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = metaText.value.trim();
            if (!text) return;
            const cat = metaCat.value;
            const prog = parseInt(metaProg.value, 10) || 0;

            if (editingMetaId) {
                const m = metas.find((x) => x.id === editingMetaId);
                if (m) { m.text = text; m.cat = cat; m.prog = prog; }
            } else {
                metas.push({ id: Date.now(), cat, text, prog });
            }
            saveMetas();
            renderMetas();
            closeMetaForm();
        });
    }

    // Delegação de eventos para editar/remover metas
    document.getElementById("metaCats").addEventListener("click", (e) => {
        const editBtn = e.target.closest(".meta-edit");
        const delBtn = e.target.closest(".meta-del");
        if (editBtn) {
            const id = parseInt(editBtn.dataset.id, 10);
            const m = metas.find((x) => x.id === id);
            if (m) openMetaForm(m);
        }
        if (delBtn) {
            const id = parseInt(delBtn.dataset.id, 10);
            metas = metas.filter((x) => x.id !== id);
            saveMetas();
            renderMetas();
        }
    });

    renderMetas();
})();
