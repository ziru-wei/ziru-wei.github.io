// Embed in Markdown with <figure-explorer data-src="figures/system.json">.
class FigureExplorer extends HTMLElement {
    async connectedCallback() {
        if (!this.dataset.src || this.ready) return;

        try {
            const response = await fetch(this.dataset.src);
            if (!response.ok) throw new Error(`Unable to load figures: ${response.status}`);
            const data = await response.json();
            this.render(data);
            this.ready = true;
        } catch (error) {
            // The figure in the Markdown remains available when the data cannot load.
            console.error('Unable to initialize figure explorer:', error);
        }
    }

    render({ groups, width, height }) {
        const figure = document.createElement('figure');
        const imageLink = document.createElement('a');
        imageLink.target = '_blank';
        imageLink.rel = 'noopener noreferrer';
        const image = document.createElement('img');
        if (width && height) {
            image.width = width;
            image.height = height;
        }
        image.loading = 'lazy';
        image.decoding = 'async';
        imageLink.append(image);
        const video = document.createElement('video');
        video.hidden = true;
        video.muted = true;
        video.playsInline = true;
        if (width && height) {
            video.width = width;
            video.height = height;
        }
        const caption = document.createElement('figcaption');
        caption.setAttribute('aria-live', 'polite');

        const stages = this.createControls('System stages');
        stages.classList.add('figure-explorer-stages');
        const components = this.createControls('System components');

        const showComponent = (view, activeButton) => {
            video.pause();
            video.hidden = !view.video;
            imageLink.hidden = Boolean(view.video);
            if (view.video) {
                video.src = view.video;
                video.setAttribute('aria-label', view.alt);
                video.play().catch(() => {});
            } else {
                image.src = view.image;
                image.alt = view.alt;
                imageLink.href = view.image;
                imageLink.setAttribute('aria-label', `Open ${view.label} figure at full size`);
            }
            caption.hidden = !view.caption;
            caption.textContent = view.caption ?? '';
            this.markSelected(components, activeButton);
        };

        const showStage = (group, activeButton) => {
            this.markSelected(stages, activeButton);
            components.setAttribute('aria-label', `${group.label} components`);
            components.hidden = groups.length > 1 && group.views.length === 1;
            const buttons = group.views.map(view => this.createButton(view.label, button => {
                showComponent(view, button);
            }, view.icon));
            components.replaceChildren(...buttons);
            showComponent(group.views[0], buttons[0]);
        };

        figure.append(imageLink, video);
        if (groups.length > 1) {
            stages.append(...groups.map(group => this.createButton(group.label, button => {
                showStage(group, button);
            })));
            figure.append(stages);
        }
        figure.append(components, caption);
        showStage(groups[0], stages.firstElementChild);
        this.replaceChildren(figure);
    }

    createControls(label) {
        const controls = document.createElement('div');
        controls.className = 'figure-explorer-controls';
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', label);
        return controls;
    }

    createButton(label, onSelect, iconSrc) {
        const button = document.createElement('button');
        button.type = 'button';
        if (iconSrc) {
            const icon = document.createElement('img');
            icon.className = 'figure-explorer-icon';
            icon.src = iconSrc;
            icon.alt = '';
            button.append(icon);
        }
        button.append(label);
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => onSelect(button));
        return button;
    }

    markSelected(controls, selectedButton) {
        for (const button of controls.children) {
            button.setAttribute('aria-pressed', String(button === selectedButton));
        }
    }
}

customElements.define('figure-explorer', FigureExplorer);
