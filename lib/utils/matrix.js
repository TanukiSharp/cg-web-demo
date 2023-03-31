import { X, Y, Z, W, WIDTH, HEIGHT } from '../../constants.js';
import { MathUtils } from './math.js';

export class MatrixUtils {
    static getMatrixSize(mtx) {
        return [mtx[0].length, mtx.length];
    }

    static createMatrix(width, height) {
        const result = [];

        for (let j = 0; j < height; j++) {
            const line = [];
            for (let i = 0; i < width; i++) {
                line.push(0);
            }
            result.push(line);
        }

        return result;
    }

    static createIdentityMatrix(width, height) {
        const result = MatrixUtils.createMatrix(width, height);
        MatrixUtils.makeIdentity(result);
        return result;
    }

    static makeIdentity(mtx) {
        for (let y = 0; y < mtx.length; y++) {
            for (let x = 0; x < mtx[y].length; x++) {
                mtx[y][x] = x === y ? 1 : 0;
            }
        }
    }

    static duplicateMatrix(mtx) {
        const result = [];

        for (let y = 0; y < mtx.length; y++) {
            const line = [];
            for (let x = 0; x < mtx[y].length; x++) {
                line.push(mtx[y][x]);
            }
            result.push(line);
        }

        return result;
    }

    static copyMatrix(mtxTo, mtxFrom) {
        for (let y = 0; y < mtxFrom.length; y++) {
            for (let x = 0; x < mtxFrom[y].length; x++) {
                mtxTo[y][x] = mtxFrom[y][x];
            }
        }
    }

    static multiplyMatrices(m1, m2) {
        const m1Size = MatrixUtils.getMatrixSize(m1);
        const m2Size = MatrixUtils.getMatrixSize(m2);

        if (m1Size[HEIGHT] !== m2Size[WIDTH]) {
            throw new Error(`Incompatible matrices ${m1Size[WIDTH]};${m1Size[HEIGHT]} and ${m2Size[WIDTH]};${m2Size[HEIGHT]}.`);
        }

        const result = MatrixUtils.createMatrix(m1Size[WIDTH], m2Size[HEIGHT]);

        for (let i = 0; i < m1Size[WIDTH]; i++) {
            for (let j = 0; j < m2Size[HEIGHT]; j++) {
                for (let k = 0; k < m1Size[HEIGHT]; k++) {
                    result[j][i] += m1[k][i] * m2[j][k];
                }
            }
        }

        return result;
    }

    static setMatrixValue(mtx, x, y, value) {
        mtx[y][x] = value;
    }

    static createTransaltionMatrix(tx, ty, tz) {
        const result = MatrixUtils.createMatrix(4, 4);

        MatrixUtils.makeIdentity(result);

        MatrixUtils.setMatrixValue(result, 0, 3, tx);
        MatrixUtils.setMatrixValue(result, 1, 3, ty);
        MatrixUtils.setMatrixValue(result, 2, 3, tz);

        return result;
    }

    static createRotationMatrixX(angle) {
        const result = MatrixUtils.createMatrix(4, 4);

        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);

        MatrixUtils.setMatrixValue(result, 0, 0, 1);
        MatrixUtils.setMatrixValue(result, 1, 1, cosine);
        MatrixUtils.setMatrixValue(result, 2, 1, -sine);
        MatrixUtils.setMatrixValue(result, 1, 2, sine);
        MatrixUtils.setMatrixValue(result, 2, 2, cosine);
        MatrixUtils.setMatrixValue(result, 3, 3, 1);

        return result;
    }

    static createRotationMatrixY(angle) {
        const result = MatrixUtils.createMatrix(4, 4);

        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);

        MatrixUtils.setMatrixValue(result, 0, 0, cosine);
        MatrixUtils.setMatrixValue(result, 2, 0, sine);
        MatrixUtils.setMatrixValue(result, 1, 1, 1);
        MatrixUtils.setMatrixValue(result, 0, 2, -sine);
        MatrixUtils.setMatrixValue(result, 2, 2, cosine);
        MatrixUtils.setMatrixValue(result, 3, 3, 1);

        return result;
    }

    static createRotationMatrixZ(angle) {
        const result = MatrixUtils.createMatrix(4, 4);

        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);

        MatrixUtils.setMatrixValue(result, 0, 0, cosine);
        MatrixUtils.setMatrixValue(result, 1, 0, -sine);
        MatrixUtils.setMatrixValue(result, 0, 1, sine);
        MatrixUtils.setMatrixValue(result, 1, 1, cosine);
        MatrixUtils.setMatrixValue(result, 2, 2, 1);
        MatrixUtils.setMatrixValue(result, 3, 3, 1);

        return result;
    }

    static createScaleMatrix(sx, sy, sz) {
        const result = MatrixUtils.createMatrix(4, 4);

        MatrixUtils.setMatrixValue(result, 0, 0, sx);
        MatrixUtils.setMatrixValue(result, 1, 1, sy);
        MatrixUtils.setMatrixValue(result, 2, 2, sz);
        MatrixUtils.setMatrixValue(result, 3, 3, 1);

        return result;
    }

    static createProjectionMatrix(fovInDegrees, near, far, ratio) {
        const tanAngle = Math.tan(MathUtils.degreesToRadians(fovInDegrees / 2))

        const result = MatrixUtils.createMatrix(4, 4);

        MatrixUtils.setMatrixValue(result, 0, 0, 1 / (ratio * tanAngle));
        MatrixUtils.setMatrixValue(result, 1, 1, 1 / tanAngle);

        MatrixUtils.setMatrixValue(result, 2, 2, far / (far - near));
        MatrixUtils.setMatrixValue(result, 3, 2, far * near / (far - near));

        MatrixUtils.setMatrixValue(result, 2, 3, 1);

        return result;
    }

    static projectPoint(mtx, width, height) {
        const pt = mtx[0];

        if (pt[W] != 0) {
            pt[X] /= pt[W];
            pt[Y] /= pt[W];
            pt[Z] /= pt[W];
        }

        pt[X] = pt[X] * width / 2;
        pt[Y] = -pt[Y] * height / 2;

        return [pt[X], pt[Y]];
    }
}
