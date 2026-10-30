(function () {
    "use strict";

    const MODULES = [
        { id: "authentication", label: "Autenticação" },
        { id: "analytics", label: "Analytics" },
        { id: "api-docs", label: "Documentação da API" },
        { id: "tests", label: "Testes automatizados" },
        { id: "ci-cd", label: "CI/CD" },
        { id: "team", label: "Equipe e permissões" }
    ];

    const TEMPLATES = [
        {
            id: "react-vite",
            name: "Web app",
            description: "Interface moderna com tipagem e build rápido.",
            stack: ["React", "Vite", "TypeScript"],
            defaults: ["authentication", "analytics", "tests", "ci-cd"]
        },
        {
            id: "next-saas",
            name: "SaaS / Dashboard",
            description: "Base para produto web com páginas e painel inicial.",
            stack: ["Next.js", "TypeScript", "PostgreSQL"],
            defaults: ["authentication", "analytics", "api-docs", "tests", "ci-cd", "team"]
        },
        {
            id: "fastapi",
            name: "API / Backend",
            description: "Serviço Python com endpoints documentados e testes.",
            stack: ["FastAPI", "Python", "PostgreSQL"],
            defaults: ["api-docs", "tests", "ci-cd"]
        },
        {
            id: "fullstack",
            name: "Full-stack",
            description: "Frontend e API organizados para evoluir juntos.",
            stack: ["React", "FastAPI", "PostgreSQL"],
            defaults: ["authentication", "analytics", "api-docs", "tests", "ci-cd"]
        }
    ];

    const STORAGE_PREFIX = "nexus_project_generator_v1";

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function getStorageKey() {
        const owner = localStorage.getItem("nexus_user") || "guest";
        return `${STORAGE_PREFIX}:${encodeURIComponent(owner)}`;
    }

    function loadProjects() {
        const raw = localStorage.getItem(getStorageKey());
        if (!raw) return [];

        const projects = JSON.parse(raw);
        if (!Array.isArray(projects) || projects.some((project) =>
            !project || typeof project.id !== "string" ||
            typeof project.name !== "string" ||
            !Array.isArray(project.modules) ||
            !Array.isArray(project.customFeatures)
        )) {
            throw new Error("Os dados salvos dos projetos estão em um formato inválido.");
        }
        return projects;
    }

    function saveProjects(projects) {
        localStorage.setItem(getStorageKey(), JSON.stringify(projects));
    }

    function getTemplate(templateId) {
        return TEMPLATES.find((template) => template.id === templateId) || TEMPLATES[0];
    }

    function render(appContent, toast) {
        let projects;
        try {
            projects = loadProjects();
        } catch (error) {
            appContent.classList.remove("app-placeholder");
            appContent.innerHTML = `
                <div class="project-generator__empty" role="alert">
                    Não foi possível carregar os projetos salvos. ${escapeHtml(error.message)}
                </div>`;
            return;
        }

        let selectedTemplateId = TEMPLATES[0].id;
        let openProjectId = null;

        appContent.innerHTML = `
            <div class="project-generator">
                <section class="project-generator__hero">
                    <div>
                        <span class="project-generator__eyebrow">Project Generator</span>
                        <h2 class="project-generator__heading">Tire sua ideia do papel</h2>
                        <p class="project-generator__muted">Escolha uma base, monte seu dashboard e adapte os módulos para cada projeto.</p>
                    </div>
                    <div class="project-generator__notice">
                        MVP local: seus projetos ficam salvos neste navegador. A criação de repositórios remotos ainda não está conectada.
                    </div>
                </section>

                <section class="project-generator__section" aria-labelledby="projectTemplatesTitle">
                    <h3 id="projectTemplatesTitle">1. Escolha um template</h3>
                    <p class="project-generator__muted">Bases prontas com stacks atuais para começar com uma estrutura coerente.</p>
                    <div class="project-generator__templates" id="projectTemplates"></div>
                </section>

                <section class="project-generator__section" aria-labelledby="createProjectTitle">
                    <h3 id="createProjectTitle">2. Configure seu projeto</h3>
                    <form class="project-generator__form" id="projectCreateForm">
                        <div class="project-generator__field">
                            <label for="projectName">Nome do projeto</label>
                            <input id="projectName" name="name" maxlength="80" required placeholder="Ex.: Portal da minha empresa" />
                        </div>
                        <div class="project-generator__field">
                            <label for="projectRepository">URL do repositório (opcional)</label>
                            <input id="projectRepository" name="repository" type="url" placeholder="https://github.com/usuario/repositorio" />
                        </div>
                        <fieldset class="project-generator__field project-generator__field--wide project-generator__modules">
                            <legend>Módulos iniciais do dashboard</legend>
                            ${MODULES.map((module) => `
                                <label class="project-generator__check">
                                    <input type="checkbox" name="modules" value="${module.id}" />
                                    ${module.label}
                                </label>`).join("")}
                        </fieldset>
                        <div class="project-generator__field project-generator__field--wide">
                            <label for="projectCustomFeature">Funcionalidade personalizada (opcional)</label>
                            <input id="projectCustomFeature" name="customFeature" maxlength="80" placeholder="Ex.: Integração com sistema de pagamentos" />
                        </div>
                        <div class="project-generator__field project-generator__field--wide">
                            <button class="btn btn--primary" type="submit">＋ Criar projeto e dashboard</button>
                        </div>
                    </form>
                </section>

                <section class="project-generator__section" aria-labelledby="myProjectsTitle">
                    <h3 id="myProjectsTitle">3. Seus projetos</h3>
                    <p class="project-generator__muted">Cada projeto mantém seu próprio dashboard e conjunto de funcionalidades.</p>
                    <div class="project-generator__projects" id="projectList"></div>
                </section>
            </div>`;

        const templatesEl = appContent.querySelector("#projectTemplates");
        const form = appContent.querySelector("#projectCreateForm");
        const projectList = appContent.querySelector("#projectList");

        form.elements.repository.addEventListener("input", () => {
            form.elements.repository.setCustomValidity("");
        });

        function renderTemplates() {
            templatesEl.innerHTML = TEMPLATES.map((template) => `
                <article class="project-generator__template${template.id === selectedTemplateId ? " is-selected" : ""}">
                    <h4>${escapeHtml(template.name)}</h4>
                    <p class="project-generator__muted">${escapeHtml(template.description)}</p>
                    <div class="project-generator__tags">
                        ${template.stack.map((item) => `<span class="project-generator__tag">${escapeHtml(item)}</span>`).join("")}
                    </div>
                    <button class="btn btn--sm" type="button" data-template="${template.id}" aria-pressed="${template.id === selectedTemplateId}">
                        ${template.id === selectedTemplateId ? "Selecionado" : "Usar template"}
                    </button>
                </article>`).join("");
        }

        function renderProjects() {
            if (!projects.length) {
                projectList.innerHTML = '<div class="project-generator__empty">Nenhum projeto criado ainda. Escolha um template para começar.</div>';
                return;
            }

            projectList.innerHTML = projects.map((project) => {
                const template = getTemplate(project.templateId);
                const enabledModules = MODULES.filter((module) => project.modules.includes(module.id));
                const customFeatures = project.customFeatures || [];
                const featureTags = [
                    ...enabledModules.map((module) => module.label),
                    ...customFeatures
                ];

                return `
                    <article class="project-generator__card">
                        <div class="project-generator__card-head">
                            <div>
                                <h4>${escapeHtml(project.name)}</h4>
                                <span class="project-generator__card-meta">${escapeHtml(template.name)} · Dashboard inicial</span>
                            </div>
                            <button class="btn btn--sm" type="button" data-export="${escapeHtml(project.id)}">Exportar JSON</button>
                        </div>
                        <div class="project-generator__tags">
                            ${template.stack.map((item) => `<span class="project-generator__tag">${escapeHtml(item)}</span>`).join("")}
                        </div>
                        <div class="project-generator__dashboard" aria-label="Resumo do dashboard do projeto">
                            <div class="project-generator__dashboard-item"><span>Status</span><strong>Planejamento</strong></div>
                            <div class="project-generator__dashboard-item"><span>Funcionalidades ativas</span><strong>${featureTags.length}</strong></div>
                            <div class="project-generator__dashboard-item"><span>Stack principal</span><strong>${escapeHtml(template.stack[0])}</strong></div>
                        </div>
                        ${project.repository
                            ? `<a class="project-generator__repo" href="${escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer">Abrir repositório ↗</a>`
                            : '<span class="project-generator__card-meta">Repositório ainda não vinculado</span>'}
                        <div>
                            <strong>${featureTags.length} funcionalidade${featureTags.length === 1 ? "" : "s"}</strong>
                            <div class="project-generator__tags" aria-label="Funcionalidades do projeto">
                                ${featureTags.length
                                    ? enabledModules.map((module) => `<span class="project-generator__tag">${escapeHtml(module.label)}</span>`).join("") +
                                        customFeatures.map((feature, index) => `
                                            <span class="project-generator__tag project-generator__tag--custom">
                                                ${escapeHtml(feature)}
                                                <button class="project-generator__tag-remove" type="button" data-remove-feature="${escapeHtml(project.id)}" data-feature-index="${index}" aria-label="Remover ${escapeHtml(feature)}">×</button>
                                            </span>`).join("")
                                    : '<span class="project-generator__card-meta">Nenhum módulo ativado</span>'}
                            </div>
                        </div>
                        <details class="project-generator__details" data-details="${escapeHtml(project.id)}"${openProjectId === project.id ? " open" : ""}>
                            <summary>Personalizar funcionalidades</summary>
                            <form class="project-generator__custom-form" data-custom-form="${escapeHtml(project.id)}">
                                ${MODULES.map((module) => `
                                    <label class="project-generator__check">
                                        <input type="checkbox" name="modules" value="${module.id}"${project.modules.includes(module.id) ? " checked" : ""} />
                                        ${module.label}
                                    </label>`).join("")}
                                <label class="project-generator__field project-generator__field--wide">
                                    <span>Adicionar funcionalidade própria</span>
                                    <input name="customFeature" maxlength="80" placeholder="Ex.: Área de suporte ao cliente" />
                                </label>
                                <button class="btn btn--sm" type="submit">Salvar personalização</button>
                                <button class="btn btn--sm" type="button" data-delete="${escapeHtml(project.id)}">Excluir projeto</button>
                            </form>
                        </details>
                    </article>`;
            }).join("");
        }

        function persistAndRender(message) {
            try {
                saveProjects(projects);
            } catch (error) {
                toast(`Não foi possível salvar: ${error.message}`);
                return false;
            }
            renderProjects();
            if (message) toast(message);
            return true;
        }

        templatesEl.addEventListener("click", (event) => {
            const button = event.target.closest("[data-template]");
            if (!button) return;
            selectedTemplateId = button.dataset.template;
            const defaults = getTemplate(selectedTemplateId).defaults;
            form.querySelectorAll('input[name="modules"]').forEach((input) => {
                input.checked = defaults.includes(input.value);
            });
            renderTemplates();
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;

            const name = form.elements.name.value.trim();
            const repository = form.elements.repository.value.trim();
            if (repository) {
                let parsedRepository;
                try {
                    parsedRepository = new URL(repository);
                } catch (_error) {
                    parsedRepository = null;
                }
                if (!parsedRepository || parsedRepository.protocol !== "https:") {
                    form.elements.repository.setCustomValidity("Use uma URL segura começando com https://.");
                    form.elements.repository.reportValidity();
                    return;
                }
                form.elements.repository.setCustomValidity("");
            }
            const customFeature = form.elements.customFeature.value.trim();
            const modules = Array.from(form.querySelectorAll('input[name="modules"]:checked'), (input) => input.value);
            const project = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                name,
                templateId: selectedTemplateId,
                repository,
                modules,
                customFeatures: customFeature ? [customFeature] : [],
                createdAt: new Date().toISOString()
            };

            projects.unshift(project);
            if (!persistAndRender("Projeto e dashboard criados!")) {
                projects.shift();
                return;
            }
            form.reset();
            selectedTemplateId = TEMPLATES[0].id;
            form.querySelectorAll('input[name="modules"]').forEach((input) => {
                input.checked = TEMPLATES[0].defaults.includes(input.value);
            });
            renderTemplates();
        });

        projectList.addEventListener("submit", (event) => {
            const customForm = event.target.closest("[data-custom-form]");
            if (!customForm) return;
            event.preventDefault();

            const projectId = customForm.dataset.customForm;
            const project = projects.find((item) => item.id === projectId);
            if (!project) return;

            const customFeature = customForm.elements.customFeature.value.trim();
            project.modules = Array.from(customForm.querySelectorAll('input[name="modules"]:checked'), (input) => input.value);
            if (customFeature && !project.customFeatures.includes(customFeature)) {
                project.customFeatures.push(customFeature);
            }
            openProjectId = projectId;
            persistAndRender("Funcionalidades do projeto atualizadas.");
        });

        projectList.addEventListener("click", (event) => {
            const removeFeatureButton = event.target.closest("[data-remove-feature]");
            if (removeFeatureButton) {
                const project = projects.find((item) => item.id === removeFeatureButton.dataset.removeFeature);
                const featureIndex = Number(removeFeatureButton.dataset.featureIndex);
                if (!project || !Number.isInteger(featureIndex) || !project.customFeatures[featureIndex]) return;

                project.customFeatures.splice(featureIndex, 1);
                openProjectId = project.id;
                persistAndRender("Funcionalidade personalizada removida.");
                return;
            }

            const exportButton = event.target.closest("[data-export]");
            if (exportButton) {
                const project = projects.find((item) => item.id === exportButton.dataset.export);
                if (!project) return;

                const template = getTemplate(project.templateId);
                const manifest = {
                    name: project.name,
                    template: template.name,
                    stack: template.stack,
                    repository: project.repository || null,
                    modules: project.modules.map((id) => MODULES.find((module) => module.id === id)?.label).filter(Boolean),
                    customFeatures: project.customFeatures,
                    createdAt: project.createdAt
                };
                const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "projeto"}.json`;
                link.click();
                window.setTimeout(() => URL.revokeObjectURL(url), 1000);
                return;
            }

            const deleteButton = event.target.closest("[data-delete]");
            if (!deleteButton) return;
            const projectId = deleteButton.dataset.delete;
            const index = projects.findIndex((item) => item.id === projectId);
            if (index === -1 || !window.confirm("Deseja excluir este projeto salvo neste navegador?")) return;

            const [removed] = projects.splice(index, 1);
            if (!persistAndRender("Projeto excluído.")) projects.splice(index, 0, removed);
        });

        renderTemplates();
        form.querySelectorAll('input[name="modules"]').forEach((input) => {
            input.checked = TEMPLATES[0].defaults.includes(input.value);
        });
        renderProjects();
    }

    window.NexusProjectGenerator = { render };
})();
