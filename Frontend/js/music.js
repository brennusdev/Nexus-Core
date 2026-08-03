/* ==========================================================================
   NEXUS CORE — Configuração de Música
   ========================================================================== */

(function () {
    "use strict";

    const serviceNames = {
        youtube: "YouTube Music",
        spotify: "Spotify",
        deezer: "Deezer",
        soundcloud: "SoundCloud"
    };

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
