import { X, Y, Wv } from '../constants.js';
import { Subscriptions, UiUtils } from '../lib/utils/ui.js';
import { RenderUtils } from '../lib/utils/render.js';
import { MatrixUtils } from '../lib/utils/matrix.js';
import { MathUtils } from '../lib/utils/math.js';
import { GeodesicSphere } from '../lib/geometries/sphere.js';

export class Step6 {
    constructor() {
        this._indicateVertexCount = null;
        this._indicateTriangleCount = null;

        this._pointWidth = 10;
        this._lineWidth = 0;
        this._showVertexNumbers = false;
        this._fillTriangles = false;

        this._subdivisions = 1;
        this._previousSubdivisions = this._subdivisions;
        this._sphere = null;

        this._ambientLight = 0;

        this._lightRotationX = 0;
        this._lightRotationY = 360;
        this._lightRotationZ = 0;
        this._lightPosition = [200, 200, -200, Wv];

        this._fov = 90;

        this._translationX = 0;
        this._translationY = 0;
        this._translationZ = 200;

        this._rotationX = 0;
        this._rotationY = 0;
        this._rotationZ = 0;

        this._scale = 15;

        this._subscriptions = new Subscriptions();
        this._userInterfaceRootElement = this._setupUserInterface();
    }

    get name() {
        return 'Step 6';
    }

    get message() {
        return 'A geodesic shere.';
    }

    dispose() {
        this._subscriptions.dispose();
    }

    _setupUserInterface() {
        const rootElement = document.createElement('div');

        const vertexCountSpan = UiUtils.createBoundSpan(f => this._indicateVertexCount = f);
        const triangleCountSpan = UiUtils.createBoundSpan(f => this._indicateTriangleCount = f);

        const pointWidthSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 10, 1, () => this._pointWidth, (v) => this._pointWidth = v);
        const lineWidthSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 5, 1, () => this._lineWidth, (v) => this._lineWidth = v);
        const showVertexNumbersCheckbox = UiUtils.createBoundCheckbox(this._subscriptions, () => this._showVertexNumbers, (v) => this._showVertexNumbers = v);
        const fillTrianglesCheckbox = UiUtils.createBoundCheckbox(this._subscriptions, () => this._fillTriangles, (v) => this._fillTriangles = v);

        const subdivisionSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 7, 1, () => this._subdivisions, (v) => this._subdivisions = v);

        const ambientLightSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 1, 0.05, () => this._ambientLight, (v) => this._ambientLight = v);

        const lightRotationXSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 0.05, () => this._lightRotationX, (v) => this._lightRotationX = v);
        const lightRotationYSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 0.05, () => this._lightRotationY, (v) => this._lightRotationY = v);
        const lightRotationZSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 0.05, () => this._lightRotationZ, (v) => this._lightRotationZ = v);

        const fovSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 180, 1, () => this._fov, (v) => this._fov = v);

        const translationXSlider = UiUtils.createBoundSlider(this._subscriptions, -50, 50, 1, () => this._translationX, (v) => this._translationX = v);
        const translationYSlider = UiUtils.createBoundSlider(this._subscriptions, -50, 50, 1, () => this._translationY, (v) => this._translationY = v);
        const translationZSlider = UiUtils.createBoundSlider(this._subscriptions, 200, 500, 1, () => this._translationZ, (v) => this._translationZ = v);

        const scaleSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 15, 1, () => this._scale, (v) => this._scale = v);

        const rotationXSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationX, (v) => this._rotationX = v);
        const rotationYSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationY, (v) => this._rotationY = v);
        const rotationZSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationZ, (v) => this._rotationZ = v);

        // ------------------------------------------

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Point count:', vertexCountSpan));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Triangle count:', triangleCountSpan));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Subdivisions:', subdivisionSlider));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Point size:', pointWidthSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Line size:', lineWidthSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Show vertex numbers:', showVertexNumbersCheckbox));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Fill triangles:', fillTrianglesCheckbox));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Ambient light:', ambientLightSlider));

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Light RX:', lightRotationXSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Light RY:', lightRotationYSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Light RZ:', lightRotationZSlider));

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
        if (this._sphere === null || this._previousSubdivisions !== this._subdivisions) {
            this._sphere = new GeodesicSphere(this._subdivisions);
            this._previousSubdivisions = this._subdivisions;

            this._indicateVertexCount(this._sphere.vertices.length);
            this._indicateTriangleCount(this._sphere.faces.length);
        }

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

        let lightTransformsMatrix = identityMatrix;
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, MatrixUtils.createTransaltionMatrix(this._translationX, this._translationY, this._translationZ));
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, MatrixUtils.createRotationMatrixZ(MathUtils.degreesToRadians(this._lightRotationZ)));
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, MatrixUtils.createRotationMatrixY(MathUtils.degreesToRadians(this._lightRotationY)));
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, MatrixUtils.createRotationMatrixX(MathUtils.degreesToRadians(this._lightRotationX)));

        const lightPositionMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, [this._lightPosition]);

        const renderOptions = {
            transformsMatrix,
            projectionMatrix,

            fillTriangles: this._fillTriangles,
            color: [0, 178, 255],
            lightPosition: lightPositionMatrix[0],
            ambientLight: this._ambientLight,

            lineWidth: this._lineWidth,
            lineColor: 'white',
            pointWidth: this._pointWidth,
            pointColor: 'white',

            showPointNumbers: this._showVertexNumbers,
            pointNumberColor: 'royalblue',
            pointNumberFont: '30px Arial',
        };

        RenderUtils.drawGeometry(ctx, this._sphere, renderOptions);

        this._renderLight(ctx, lightTransformsMatrix, projectionMatrix);
    }

    _renderLight(ctx, lightTransformsMatrix, projectionMatrix) {
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, MatrixUtils.createScaleMatrix(0.07, 0.07, 0.07));
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, [this._lightPosition]);

        const projectedPointMatrix = MatrixUtils.multiplyMatrices(projectionMatrix, lightTransformsMatrix);

        const projectedPoint = MatrixUtils.projectPoint(projectedPointMatrix, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

        RenderUtils.drawCircle(ctx, projectedPoint[X], projectedPoint[Y], 10, 'yellow');
    }
}
