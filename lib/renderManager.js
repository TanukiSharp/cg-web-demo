export class RenderManager {
    constructor(canvas, rendererProperties) {
        this._canvas = canvas;
        this._rendererProperties = rendererProperties;

        this._ctx = canvas.getContext('2d');

        this._previousAbsoluteTime = null;
        this._deltaTime = 0;

        this._renderer = null;
        this._requestAnimationFrameId = null;
    }

    setRenderer(renderer) {
        if (this._requestAnimationFrameId !== null) {
            window.cancelAnimationFrame(this._requestAnimationFrameId);
            this._requestAnimationFrameId = null;
        }

        this._renderer = renderer;
        this._rendererProperties.innerHTML = '';

        if (!renderer) {
            return;
        }

        if (typeof renderer.getUserInterface === 'function') {
            const rootElement = renderer.getUserInterface();

            if (rootElement) {
                rootElement.classList.add('renderer-properties');
                this._rendererProperties.appendChild(rootElement);
            }
        }

        this._render();
    }

    _render() {
        this._requestRender();

        const now = performance.now();

        if (this._previousAbsoluteTime !== null) {
            this._deltaTime = now - this._previousAbsoluteTime;
        } else {
            this._deltaTime = 0;
        }

        this._previousAbsoluteTime = now;

        this._canvas.width = this._canvas.clientWidth;
        this._canvas.height = this._canvas.clientHeight;

        const halfWidth = this._canvas.width / 2;
        const halfHeight = this._canvas.height / 2;

        this._ctx.translate(halfWidth, halfHeight);

        this._ctx.clearRect(-halfWidth, -halfHeight, this._canvas.width, this._canvas.height);

        if (this._renderer !== null && typeof this._renderer.render === 'function') {
            this._renderer.render(this._deltaTime, this._ctx);
        }
    }

    _requestRender() {
        this._requestAnimationFrameId = window.requestAnimationFrame(() => this._render());
    }
}
