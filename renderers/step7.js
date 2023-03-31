import { X, Y, Wv } from '../constants.js';
import { Subscriptions, UiUtils } from '../lib/utils/ui.js';
import { RenderUtils } from '../lib/utils/render.js';
import { MatrixUtils } from '../lib/utils/matrix.js';
import { MathUtils } from '../lib/utils/math.js';
import { Torus } from '../lib/geometries/torus.js';

export class Step7 {
    constructor() {
        this._indicateVertexCount = null;
        this._indicateTriangleCount = null;

        this._pointWidth = 0;
        this._lineWidth = 0;
        this._showVertexNumbers = false;
        this._fillTriangles = true;

        this._largeRingRadius = 7;
        this._smallRingRadius = 2;
        this._smallRingDivisions = 50;
        this._largeRingDivisions = 100;

        this._previousLargeRingRadius = this._largeRingRadius;
        this._previousSmallRingRadius = this._smallRingRadius;
        this._previousSmallRingDivisions = this._smallRingDivisions;
        this._previousLargeRingDivisions = this._largeRingDivisions;

        this._torus = null;

        this._ambientLight = 0;

        this._lightRotationX = 0;
        this._lightRotationY = 360;
        this._lightRotationZ = 0;
        this._lightPosition = [200, 200, -200, Wv];

        this._fov = 90;

        this._translationX = 0;
        this._translationY = 0;
        this._translationZ = 250;

        this._rotationX = 0;
        this._rotationY = 0;
        this._rotationZ = 0;

        this._scale = 2;

        this._subscriptions = new Subscriptions();
        this._userInterfaceRootElement = this._setupUserInterface();
    }

    get name() {
        return 'Step 7';
    }

    get message() {
        return 'A torus.';
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

        const largeRingRadiusSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 15, 1, () => this._largeRingRadius, (v) => this._largeRingRadius = v);
        const smallRingRadiusSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 10, 1, () => this._smallRingRadius, (v) => this._smallRingRadius = v);
        const smallRingDivisionsSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 150, 1, () => this._smallRingDivisions, (v) => this._smallRingDivisions = v);
        const largeRingDivisionsSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 200, 1, () => this._largeRingDivisions, (v) => this._largeRingDivisions = v);

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

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Point size:', pointWidthSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Line size:', lineWidthSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Show vertex numbers:', showVertexNumbersCheckbox));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Fill triangles:', fillTrianglesCheckbox));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Large ring radius:', largeRingRadiusSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Small ring radius:', smallRingRadiusSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Small ring divisions:', smallRingDivisionsSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Large ring divisions:', largeRingDivisionsSlider));

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
        if (this._torus === null ||
            this._largeRingRadius != this._previousLargeRingRadius ||
            this._smallRingRadius != this._previousSmallRingRadius ||
            this._smallRingDivisions != this._previousSmallRingDivisions ||
            this._largeRingDivisions != this._previousLargeRingDivisions
        ) {
            this._torus = new Torus(
                this._largeRingRadius,
                this._smallRingRadius,
                this._smallRingDivisions,
                this._largeRingDivisions
            );

            this._previousInnerRadius = this._innerRadius;
            this._previousOuterRadius = this._outerRadius;
            this._previousSmallRingDivisions = this._smallRingDivisions;
            this._previousLargeRingDivisions = this._largeRingDivisions;

            this._indicateVertexCount(this._torus.vertices.length);
            this._indicateTriangleCount(this._torus.faces.length);
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

        RenderUtils.drawGeometry(ctx, this._torus, renderOptions);

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
