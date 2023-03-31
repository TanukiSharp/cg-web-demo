import { X, Y, Z, Wv } from '../../constants.js';
import { VectorUtils } from './vector.js';

export class GeometryUtils {
    static computeNormal(p0, p1, p2) {
        const v1 = VectorUtils.subtractVectors(p1, p0);
        const v2 = VectorUtils.subtractVectors(p2, p0);

        return VectorUtils.normalizeInPlace(VectorUtils.crossProduct(v1, v2));
    }

    static computeTriangleCenter(p1, p2, p3) {
        const xMin = Math.min(p1[X], p2[X], p3[X]);
        const xMax = Math.max(p1[X], p2[X], p3[X]);

        const yMin = Math.min(p1[Y], p2[Y], p3[Y]);
        const yMax = Math.max(p1[Y], p2[Y], p3[Y]);

        const zMin = Math.min(p1[Z], p2[Z], p3[Z]);
        const zMax = Math.max(p1[Z], p2[Z], p3[Z]);

        return [
            xMin + (xMax - xMin) / 2,
            yMin + (yMax - yMin) / 2,
            zMin + (zMax - zMin) / 2,
            Wv,
        ];
    }
}
