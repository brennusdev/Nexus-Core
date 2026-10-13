/* ============================================================
   NEXUS CORE — Configuração de Música
   ========================================================================== */

(function () {
    "use strict";

    // CORREÇÃO: Centralizado aqui (era duplicado com dashboard.js).
    // MOTIVO: Se um novo serviço for adicionado, só precisa editar aqui.
    const serviceNames = {
        youtube: "YouTube Music",
        spotify: "Spotify",
        deezer: "Deezer",
        soundcloud: "SoundCloud"
    };

    // CORREÇÃO: Adicionado mapping de URL por serviço.
    // MOTIVO: dashboard.js tinha os URLs hardcoded; agora a fonte única de
    //         verdade para labels e URLs fica neste objeto compartilhado.
    const serviceUrls = {
        youtube: "https://music.youtube.com",
        spotify: "https://open.spotify.com",
        deezer: "https://www.deezer.com",
        soundcloud: "https://soundcloud.com"
    };

    // Expõe para o dashboard.js (carregado antes) via window.
    window.NEXUS_MUSIC_SERVICES = serviceNames;
    window.NEXUS_MUSIC_URLS = serviceUrls;

    const options = document.querySelectorAll(".service-option");
    const saveBtn = document.getElementById("saveMusicConfig");

    // Serviço salvo anteriormente
    let selected = localStorage.getItem("nexus_music_service") || "spotify";

    function render() {
        options.forEach((opt) => {
            const service = opt.dataset.service;
            const isSel = service === selected;
            opt.classList.toggle("service-option--selected", isSel);
            const check = opt.querySelector(".service-check");
            if (check) check.textContent = isSel ? "✔" : "○";
        });
    }

    options.forEach((opt) => {
        opt.addEventListener("click", () => {
            selected = opt.dataset.service;
            render();
        });
    });

    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            localStorage.setItem("nexus_music_service", selected);
            localStorage.setItem("nexus_music_name", serviceNames[selected]);

            // Atualiza o player do dashboard (se existir)
            const mpTitle = localStorage.getItem("nexus_music_name");
            alert(`Serviço definido: ${mpTitle || serviceNames[selected]} ✓`);
            window.location.href = "dashboard.html";
        });
    }

    render();
})();
