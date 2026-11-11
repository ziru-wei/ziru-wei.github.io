export function initSlides(viewer) {
    if (!viewer) return;
    const count = Number(viewer.dataset.pageCount);
    if (!Number.isInteger(count) || count < 1) return;
    const image = viewer.querySelector('.slide-image');
    const counter = viewer.querySelector('.slide-counter');
    const pdfLink = viewer.querySelector('.slide-pdf-link');
    const buttons = viewer.querySelectorAll('[data-slide-step]');
    let page = 1;

    function showPage(nextPage) {
        page = Math.max(1, Math.min(count, nextPage));
        image.src = `slides/page-${String(page).padStart(2, '0')}.webp`;
        image.alt = `Village Renewal, slide ${page} of ${count}`;
        counter.textContent = `${page} / ${count}`;
        pdfLink.href = `ppt.pdf#page=${page}`;
        buttons.forEach(button => {
            const step = Number(button.dataset.slideStep);
            const atBoundary = step < 0 ? page === 1 : page === count;
            button.setAttribute('aria-disabled', String(atBoundary));
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => showPage(page + Number(button.dataset.slideStep)));
    });
    viewer.addEventListener('keydown', event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const steps = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 };
        if (Object.hasOwn(steps, event.key)) {
            event.preventDefault();
            showPage(page + steps[event.key]);
        } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            showPage(event.key === 'Home' ? 1 : count);
        }
    });
    showPage(1);
}

initSlides(document.querySelector('.slide-viewer'));
