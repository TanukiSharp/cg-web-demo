import { X, Y } from '../constants.js';
import { Subscriptions, UiUtils } from '../lib/utils/ui.js';
import { RenderUtils } from '../lib/utils/render.js';
import { MatrixUtils } from '../lib/utils/matrix.js';
import { MathUtils } from '../lib/utils/math.js';
import { Cube } from '../lib/geometries/cube.js';

export class Step3 {
    constructor() {
        this._pointSize = 10;
        this._lineSize = 0;
        this._showVertexNumbers = false;

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
        return 'Step 3';
    }

    get message() {
        return 'A cube, only showing squares.';
    }

    dispose() {
        this._subscriptions.dispose();
    }

    _setupUserInterface() {
        const rootElement = document.createElement('div');

        const pointSizeSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 10, 1, () => this._pointSize, (v) => this._pointSize = v);
        const lineSizeSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 5, 1, () => this._lineSize, (v) => this._lineSize = v);
        const showVertexNumbersCheckbox = UiUtils.createBoundCheckbox(this._subscriptions, () => this._showVertexNumbers, (v) => this._showVertexNumbers = v);

        const fovSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 180, 1, () => this._fov, (v) => this._fov = v);

        const translationXSlider = UiUtils.createBoundSlider(this._subscriptions, -50, 50, 1, () => this._translationX, (v) => this._translationX = v);
        const translationYSlider = UiUtils.createBoundSlider(this._subscriptions, -50, 50, 1, () => this._translationY, (v) => this._translationY = v);
        const translationZSlider = UiUtils.createBoundSlider(this._subscriptions, 200, 500, 1, () => this._translationZ, (v) => this._translationZ = v);

        const scaleSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 15, 1, () => this._scale, (v) => this._scale = v);

        const rotationXSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationX, (v) => this._rotationX = v);
        const rotationYSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationY, (v) => this._rotationY = v);
        const rotationZSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationZ, (v) => this._rotationZ = v);

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Point size:', pointSizeSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Line size:', lineSizeSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Show vertex numbers:', showVertexNumbersCheckbox));

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

        const projectedPoints = [];

        let transforms = identityMatrix;
        transforms = MatrixUtils.multiplyMatrices(transforms, translationMatrix);
        transforms = MatrixUtils.multiplyMatrices(transforms, rotationXMatrix);
        transforms = MatrixUtils.multiplyMatrices(transforms, rotationYMatrix);
        transforms = MatrixUtils.multiplyMatrices(transforms, rotationZMatrix);
        transforms = MatrixUtils.multiplyMatrices(transforms, scaleMatrix);

        for (let i = 0; i < this._cube.vertices.length; i++) {
            const transformedPointMatrix = MatrixUtils.multiplyMatrices(transforms, [this._cube.vertices[i]]);
            const projectedPointMatrix = MatrixUtils.multiplyMatrices(projectionMatrix, transformedPointMatrix);

            const projectedPoint = MatrixUtils.projectPoint(projectedPointMatrix, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

            const [screenX, screenY] = projectedPoint;

            projectedPoints.push([screenX, screenY]);
        }

        if (this._lineSize > 0) {
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[0], projectedPoints[1], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[0], projectedPoints[2], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[1], projectedPoints[3], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[2], projectedPoints[3], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[4], projectedPoints[5], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[4], projectedPoints[6], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[5], projectedPoints[7], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[6], projectedPoints[7], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[0], projectedPoints[4], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[1], projectedPoints[5], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[2], projectedPoints[6], this._lineSize, 'white');
            RenderUtils.drawLineFromPoints(ctx, projectedPoints[3], projectedPoints[7], this._lineSize, 'white');
        }

        for (let i = 0; i < projectedPoints.length; i++) {
            const points = projectedPoints[i];

            RenderUtils.drawCircle(ctx, points[X], points[Y], this._pointSize, 'white');

            if (this._showVertexNumbers) {
                ctx.fillStyle = 'royalblue';
                ctx.font = '30px Arial';
                ctx.fillText(i.toString(), points[X], points[Y]);
            }
        }
    }
}
