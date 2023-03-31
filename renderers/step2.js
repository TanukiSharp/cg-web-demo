import { Subscriptions, UiUtils } from '../lib/utils/ui.js';
import { RenderUtils } from '../lib/utils/render.js';
import { MatrixUtils } from '../lib/utils/matrix.js';
import { MathUtils } from '../lib/utils/math.js';
import { Polygon } from '../lib/geometries/polygon.js';

export class Step2 {
    constructor() {
        this._pointWidth = 10;
        this._lineWidth = 0;
        this._showVertexNumbers = false;
        this._fillTriangles = false;

        this._pointCount = 1;

        this._previousPointCount = 1;
        this._drawLines = false;

        this._scale = 10;
        this._rotationZ = 180;

        this._polygon = null;

        this._subscriptions = new Subscriptions();
        this._userInterfaceRootElement = this._setupUserInterface();
    }

    get name() {
        return 'Step 2';
    }

    get message() {
        return 'A polygon.';
    }

    dispose() {
        this._subscriptions.dispose();
    }

    _setupUserInterface() {
        const rootElement = document.createElement('div');

        const pointWidthSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 10, 1, () => this._pointWidth, (v) => this._pointWidth = v);
        const lineWidthSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 5, 1, () => this._lineWidth, (v) => this._lineWidth = v);
        const showVertexNumbersCheckbox = UiUtils.createBoundCheckbox(this._subscriptions, () => this._showVertexNumbers, (v) => this._showVertexNumbers = v);
        const fillTrianglesCheckbox = UiUtils.createBoundCheckbox(this._subscriptions, () => this._fillTriangles, (v) => this._fillTriangles = v);

        const pointCountSlider = UiUtils.createBoundSlider(this._subscriptions, 1, 12, 1, () => this._pointCount, (v) => this._pointCount = v);

        const scaleSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 30, 1, () => this._scale, (v) => this._scale = v);
        const rotationZSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationZ, (v) => this._rotationZ = v);

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Point size:', pointWidthSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Line size:', lineWidthSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Show vertex numbers:', showVertexNumbersCheckbox));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Fill triangles:', fillTrianglesCheckbox));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Point count:', pointCountSlider));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Scale:', scaleSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Rotation Z:', rotationZSlider));

        return rootElement;
    }

    getUserInterface() {
        return this._userInterfaceRootElement;
    }

    render(deltaTime, ctx) {
        if (this._polygon === null || this._previousPointCount != this._pointCount) {
            this._polygon = new Polygon(this._pointCount);
            this._previousPointCount = this._pointCount;
        }

        const identityMatrix = MatrixUtils.createIdentityMatrix(4, 4);
        const scaleMatrix = MatrixUtils.createScaleMatrix(this._scale, this._scale, this._scale);
        const rotationZMatrix = MatrixUtils.createRotationMatrixZ(MathUtils.degreesToRadians(this._rotationZ));
        const translationMatrix = MatrixUtils.createTransaltionMatrix(0, 0, 200);

        const projectionMatrix = MatrixUtils.createProjectionMatrix(90, 0.1, 100, ctx.canvas.clientWidth / ctx.canvas.clientHeight);

        let transformsMatrix = identityMatrix;
        transformsMatrix = MatrixUtils.multiplyMatrices(transformsMatrix, rotationZMatrix);
        transformsMatrix = MatrixUtils.multiplyMatrices(transformsMatrix, translationMatrix);
        transformsMatrix = MatrixUtils.multiplyMatrices(transformsMatrix, scaleMatrix);

        const renderOptions = {
            transformsMatrix,
            projectionMatrix,

            fillTriangles: this._fillTriangles,
            color: [0, 178, 255],

            lineWidth: this._lineWidth,
            lineColor: 'white',
            pointWidth: this._pointWidth,
            pointColor: 'white',

            showPointNumbers: this._showVertexNumbers,
            pointNumberColor: 'royalblue',
            pointNumberFont: '30px Arial',
        };

        RenderUtils.drawGeometry(ctx, this._polygon, renderOptions);
    }
}
