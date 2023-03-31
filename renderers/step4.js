import { Subscriptions, UiUtils } from '../lib/utils/ui.js';
import { RenderUtils } from '../lib/utils/render.js';
import { MatrixUtils } from '../lib/utils/matrix.js';
import { MathUtils } from '../lib/utils/math.js';
import { Cube } from '../lib/geometries/cube.js';

export class Step4 {
    constructor() {
        this._pointWidth = 10;
        this._lineWidth = 0;
        this._showVertexNumbers = false;
        this._fillTriangles = false;

        this._fov = 90;

        this._translationX = 0;
        this._translationY = 0;
        this._translationZ = 350;

        this._rotationX = 0;
        this._rotationY = 0;
        this._rotationZ = 0;

        this._scale = 15;

        this._subscriptions = new Subscriptions();
        this._userInterfaceRootElement = this._setupUserInterface();

        this._cube = new Cube();
    }

    get name() {
        return 'Step 4';
    }

    get message() {
        return 'A cube, made of triangles.';
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

        const fovSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 180, 1, () => this._fov, (v) => this._fov = v);

        const translationXSlider = UiUtils.createBoundSlider(this._subscriptions, -50, 50, 1, () => this._translationX, (v) => this._translationX = v);
        const translationYSlider = UiUtils.createBoundSlider(this._subscriptions, -50, 50, 1, () => this._translationY, (v) => this._translationY = v);
        const translationZSlider = UiUtils.createBoundSlider(this._subscriptions, 200, 500, 1, () => this._translationZ, (v) => this._translationZ = v);

        const scaleSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 15, 1, () => this._scale, (v) => this._scale = v);

        const rotationXSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationX, (v) => this._rotationX = v);
        const rotationYSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationY, (v) => this._rotationY = v);
        const rotationZSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationZ, (v) => this._rotationZ = v);

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Point size:', pointWidthSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Line size:', lineWidthSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Show vertex numbers:', showVertexNumbersCheckbox));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Fill triangles:', fillTrianglesCheckbox));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'FOV:', fovSlider, 'FOV stands for Field of view. ("Champ de vision" in French)'));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Translation X:', translationXSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Translation Y:', translationYSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Translation Z:', translationZSlider));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Scale:', scaleSlider));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Rotation X:', rotationXSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Rotation Y:', rotationYSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Rotation Z:', rotationZSlider));

        return rootElement;
    }

    getUserInterface() {
        return this._userInterfaceRootElement;
    }

    render(deltaTime, ctx) {
        const identityMatrix = MatrixUtils.createIdentityMatrix(4, 4);
        const scaleMatrix = MatrixUtils.createScaleMatrix(this._scale, this._scale, this._scale);
        const translationMatrix = MatrixUtils.createTransaltionMatrix(this._translationX, this._translationY, this._translationZ);
        const rotationXMatrix = MatrixUtils.createRotationMatrixX(MathUtils.degreesToRadians(this._rotationX));
        const rotationYMatrix = MatrixUtils.createRotationMatrixY(MathUtils.degreesToRadians(this._rotationY));
        const rotationZMatrix = MatrixUtils.createRotationMatrixZ(MathUtils.degreesToRadians(this._rotationZ));

        const projectionMatrix = MatrixUtils.createProjectionMatrix(this._fov, 0.1, 100, ctx.canvas.clientWidth / ctx.canvas.clientHeight);

        let transformsMatrix = identityMatrix;
        transformsMatrix = MatrixUtils.multiplyMatrices(transformsMatrix, translationMatrix);
        transformsMatrix = MatrixUtils.multiplyMatrices(transformsMatrix, rotationXMatrix);
        transformsMatrix = MatrixUtils.multiplyMatrices(transformsMatrix, rotationYMatrix);
        transformsMatrix = MatrixUtils.multiplyMatrices(transformsMatrix, rotationZMatrix);
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

        RenderUtils.drawGeometry(ctx, this._cube, renderOptions);
    }
}
