import { X, Y, Z, Wv } from '../constants.js';
import { Subscriptions, UiUtils } from '../lib/utils/ui.js';
import { RenderUtils } from '../lib/utils/render.js';
import { MatrixUtils } from '../lib/utils/matrix.js';
import { GeodesicSphere } from '../lib/geometries/sphere.js';
import { Cube } from '../lib/geometries/cube.js';
import { MathUtils } from '../lib/utils/math.js';

export class Step8 {
    constructor() {
        this._indicateVertexCount = null;
        this._indicateTriangleCount = null;

        this._pointWidth = 0;
        this._lineWidth = 0;
        this._showVertexNumbers = false;
        this._fillTriangles = true;

        this._ambientLight = 0;

        this._lightTranslationX = 1.5;
        this._lightTranslationY = 0;
        this._lightTranslationZ = 18;

        this._lightRotationX = 0;
        this._lightRotationY = 0;
        this._lightRotationZ = 0;

        this._lightPosition = [0, 0, 0, Wv];

        this._fov = 90;

        this._sphereTranslationX = 1.4;
        this._sphereTranslationY = 0;
        this._sphereTranslationZ = 20;

        this._sphereRotationX = MathUtils.degreesToRadians(15);
        this._sphereRotationY = 0;
        this._sphereRotationZ = 0;

        this._sphereScale = 0.9;

        this._cubeTranslationX = -1.2;
        this._cubeTranslationY = 0;
        this._cubeTranslationZ = 20;

        this._cubeRotationX = 0;
        this._cubeRotationY = 0;
        this._cubeRotationZ = 0;

        this._cubeScale = 0.7;

        this._sphere = new GeodesicSphere(3);
        this._cube = new Cube();

        this._subscriptions = new Subscriptions();
        this._userInterfaceRootElement = this._setupUserInterface();
    }

    get name() {
        return 'Step 8';
    }

    get message() {
        return 'An animated scene.';
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

        const ambientLightSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 1, 0.05, () => this._ambientLight, (v) => this._ambientLight = v);

        const fovSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 180, 1, () => this._fov, (v) => this._fov = v);

        // ------------------------------------------

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Point size:', pointWidthSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Line size:', lineWidthSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Show vertex numbers:', showVertexNumbersCheckbox));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Fill triangles:', fillTrianglesCheckbox));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Ambient light:', ambientLightSlider));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'FOV:', fovSlider, 'FOV stands for Field of view. ("Champ de vision" in French)'));

        return rootElement;
    }

    getUserInterface() {
        return this._userInterfaceRootElement;
    }

    render(deltaTime, ctx) {
        const identityMatrix = MatrixUtils.createIdentityMatrix(4, 4);

        const sphereScaleMatrix = MatrixUtils.createScaleMatrix(this._sphereScale, this._sphereScale, this._sphereScale);
        const sphereTranslationMatrix = MatrixUtils.createTransaltionMatrix(this._sphereTranslationX, this._sphereTranslationY, this._sphereTranslationZ);
        const sphereRotationXMatrix = MatrixUtils.createRotationMatrixX(this._sphereRotationX);
        const sphereRotationYMatrix = MatrixUtils.createRotationMatrixY(this._sphereRotationY);
        const sphereRotationZMatrix = MatrixUtils.createRotationMatrixZ(this._sphereRotationZ);

        const cubeScaleMatrix = MatrixUtils.createScaleMatrix(this._cubeScale, this._cubeScale, this._cubeScale);
        const cubeTranslationMatrix = MatrixUtils.createTransaltionMatrix(this._cubeTranslationX, this._cubeTranslationY, this._cubeTranslationZ);
        const cubeRotationXMatrix = MatrixUtils.createRotationMatrixX(this._cubeRotationX);
        const cubeRotationYMatrix = MatrixUtils.createRotationMatrixY(this._cubeRotationY);
        const cubeRotationZMatrix = MatrixUtils.createRotationMatrixZ(this._cubeRotationZ);

        const projectionMatrix = MatrixUtils.createProjectionMatrix(this._fov, 0.1, 100, ctx.canvas.clientWidth / ctx.canvas.clientHeight);

        let sphereTransformsMatrix = identityMatrix;
        sphereTransformsMatrix = MatrixUtils.multiplyMatrices(sphereTransformsMatrix, sphereTranslationMatrix);
        sphereTransformsMatrix = MatrixUtils.multiplyMatrices(sphereTransformsMatrix, sphereRotationXMatrix);
        sphereTransformsMatrix = MatrixUtils.multiplyMatrices(sphereTransformsMatrix, sphereRotationYMatrix);
        sphereTransformsMatrix = MatrixUtils.multiplyMatrices(sphereTransformsMatrix, sphereRotationZMatrix);
        sphereTransformsMatrix = MatrixUtils.multiplyMatrices(sphereTransformsMatrix, sphereScaleMatrix);

        let cubeTransformsMatrix = identityMatrix;
        cubeTransformsMatrix = MatrixUtils.multiplyMatrices(cubeTransformsMatrix, cubeTranslationMatrix);
        cubeTransformsMatrix = MatrixUtils.multiplyMatrices(cubeTransformsMatrix, cubeRotationXMatrix);
        cubeTransformsMatrix = MatrixUtils.multiplyMatrices(cubeTransformsMatrix, cubeRotationYMatrix);
        cubeTransformsMatrix = MatrixUtils.multiplyMatrices(cubeTransformsMatrix, cubeRotationZMatrix);
        cubeTransformsMatrix = MatrixUtils.multiplyMatrices(cubeTransformsMatrix, cubeScaleMatrix);

        let lightTransformsMatrix = identityMatrix;
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, MatrixUtils.createRotationMatrixZ(this._lightRotationZ));
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, MatrixUtils.createRotationMatrixY(this._lightRotationY));
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, MatrixUtils.createRotationMatrixX(this._lightRotationX));
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, MatrixUtils.createTransaltionMatrix(this._lightTranslationX, this._lightTranslationY, this._lightTranslationZ));

        const lightPositionMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, [this._lightPosition]);

        // ----------

        const sphereRenderOptions = {
            transformsMatrix: sphereTransformsMatrix,
            projectionMatrix,

            fillTriangles: this._fillTriangles,
            color: [128, 255, 128],
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

        RenderUtils.drawGeometry(ctx, this._sphere, sphereRenderOptions);

        // ----------

        const modifiedLightPosition = lightPositionMatrix[0];
        modifiedLightPosition[Z] -= 200;

        const cubeRenderOptions = {
            transformsMatrix: cubeTransformsMatrix,
            projectionMatrix,

            fillTriangles: this._fillTriangles,
            color: [0, 178, 255],
            lightPosition: modifiedLightPosition,
            ambientLight: this._ambientLight,

            lineWidth: this._lineWidth,
            lineColor: 'white',
            pointWidth: this._pointWidth,
            pointColor: 'white',

            showPointNumbers: this._showVertexNumbers,
            pointNumberColor: 'royalblue',
            pointNumberFont: '30px Arial',
        };

        RenderUtils.drawGeometry(ctx, this._cube, cubeRenderOptions);

        // ----------

        this._renderLight(ctx, lightTransformsMatrix, projectionMatrix);

        if (deltaTime !== 0) {
            this._animate(deltaTime);
        }
    }

    _animate(deltaTime) {
        const tau = Math.PI * 2;

        const lightTurnPerSecond = 0.25;
        const lightAngle = (lightTurnPerSecond * tau * deltaTime) / 1000;
        //this._lightRotationX += lightAngle;
        //this._lightRotationY -= lightAngle;
        this._lightRotationZ -= lightAngle;

        const cubeTurnPerSecond = 0.1;
        const cubeAngle = (cubeTurnPerSecond * tau * deltaTime) / 1000;
        this._cubeRotationX += cubeAngle;
        this._cubeRotationY += cubeAngle;
        this._cubeRotationZ += cubeAngle;

        const sphereTurnPerSecond = 0.25;
        const sphereAngle = (sphereTurnPerSecond * tau * deltaTime) / 1000;
        this._sphereRotationY += sphereAngle;
    }

    _renderLight(ctx, lightTransformsMatrix, projectionMatrix) {
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, MatrixUtils.createScaleMatrix(0.07, 0.07, 0.07));
        lightTransformsMatrix = MatrixUtils.multiplyMatrices(lightTransformsMatrix, [this._lightPosition]);

        const projectedPointMatrix = MatrixUtils.multiplyMatrices(projectionMatrix, lightTransformsMatrix);

        const projectedPoint = MatrixUtils.projectPoint(projectedPointMatrix, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

        RenderUtils.drawCircle(ctx, projectedPoint[X], projectedPoint[Y], 10, 'yellow');
    }
}
