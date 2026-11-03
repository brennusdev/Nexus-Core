(function () {
    "use strict";

    if (!document.body || document.body.dataset.authRequired !== "true") return;

    document.documentElement.classList.add("auth-pending");
    document.addEventListener("DOMContentLoaded", () => {
        if (!window.NexusApi) {
            window.location.replace("index.html?auth_error=unavailable");
            return;
        }
        window.NexusApi.requireAuth();
    });

    window.addEventListener("nexus:authenticated", (event) => {
        const user = event.detail;
        const name = user && user.name;
        if (!name) return;

        const firstName = name.split(/\s+/)[0];
        const initial = name.charAt(0).toUpperCase();
        const userName = document.getElementById("userName");
        const welcomeName = document.getElementById("welcomeName");
        const userAvatar = document.getElementById("userAvatar");
        const avatarTop = document.getElementById("avatarTop");

        if (userName) userName.textContent = name;
        if (welcomeName) welcomeName.textContent = firstName;
        if (userAvatar) userAvatar.textContent = initial;
        if (avatarTop) avatarTop.textContent = initial;
    });
})();
