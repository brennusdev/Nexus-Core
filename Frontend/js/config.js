(function () {
    const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const productionApiUrl = "";
    const defaultApiUrl = isLocalHost ? "http://localhost:8000" : productionApiUrl;

    window.NEXUS_API_URL = window.NEXUS_API_URL || defaultApiUrl;
})();
