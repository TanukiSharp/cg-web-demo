import { Subscriptions, UiUtils } from '../lib/utils/ui.js';
import { RenderUtils } from '../lib/utils/render.js';
import { MatrixUtils } from '../lib/utils/matrix.js';
import { X, Y, Wv } from '../constants.js';
import { MathUtils } from '../lib/utils/math.js';

export class Step1 {
    constructor() {
        this._pointSize = 10;

        this._translationX = 0;
        this._rotationZ = 0;

        this._subscriptions = new Subscriptions();
        this._userInterfaceRootElement = this._setupUserInterface();

        this._point = [0, 0, 0, Wv];
    }

    get name() {
        return 'Step 1';
    }

    get message() {
        return 'A point.';
    }

    dispose() {
        this._subscriptions.dispose();
    }

    _setupUserInterface() {
        const rootElement = document.createElement('div');

        const pointSizeSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 10, 1, () => this._pointSize, (v) => this._pointSize = v);

        const translationXSlider = UiUtils.createBoundSlider(this._subscriptions, -20, 20, 1, () => this._translationX, (v) => this._translationX = v);
        const rotationZSlider = UiUtils.createBoundSlider(this._subscriptions, 0, 360, 1, () => this._rotationZ, (v) => this._rotationZ = v);

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Point size:', pointSizeSlider));

        rootElement.appendChild(UiUtils.separator());

        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Translation X:', translationXSlider));
        rootElement.appendChild(UiUtils.prop(this._subscriptions, 'Rotation Z:', rotationZSlider));

        return rootElement;
    }

    getUserInterface() {
        return this._userInterfaceRootElement;
    }

    render(deltaTime, ctx) {
        const identityMatrix = MatrixUtils.createIdentityMatrix(4, 4);
        const translationMatrix = MatrixUtils.createTransaltionMatrix(this._translationX, 0, 200);
        const rotationMatrix = MatrixUtils.createRotationMatrixZ(MathUtils.degreesToRadians(this._rotationZ));

        const projectionMatrix = MatrixUtils.createProjectionMatrix(90, 0.1, 100, ctx.canvas.clientWidth / ctx.canvas.clientHeight);

        let transforms = identityMatrix;
        transforms = MatrixUtils.multiplyMatrices(transforms, rotationMatrix);
        transforms = MatrixUtils.multiplyMatrices(transforms, translationMatrix);

        const transformedPointMatrix = MatrixUtils.multiplyMatrices(transforms, [this._point]);
        const projectedPointMatrix = MatrixUtils.multiplyMatrices(projectionMatrix, transformedPointMatrix);

        const projectedPoint = MatrixUtils.projectPoint(projectedPointMatrix, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

        RenderUtils.drawCircle(ctx, projectedPoint[X], projectedPoint[Y], this._pointSize, 'white');
    }
}
