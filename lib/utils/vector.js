import { X, Y, Z, Wv } from '../../constants.js';

export class VectorUtils {
    static dotProduct(v1, v2) {
        return v1[X] * v2[X] + v1[Y] * v2[Y] + v1[Z] * v2[Z];
    }

    static crossProduct(v1, v2) {
        return [
            v1[Y] * v2[Z] - v1[Z] * v2[Y],
            v1[Z] * v2[X] - v1[X] * v2[Z],
            v1[X] * v2[Y] - v1[Y] * v2[X],
            Wv,
        ]
    }

    static squaredDistance(v) {
        return v[X] * v[X] + v[Y] * v[Y] + v[Z] * v[Z];
    }

    static distance(v) {
        return Math.sqrt(VectorUtils.squaredDistance(v));
    }

    static normalize(v) {
        return VectorUtils.normalizeInPlace([v[X], v[Y], v[Z], Wv]);
    }

    static normalizeInPlace(v) {
        const distance = VectorUtils.distance(v);

        v[X] /= distance;
        v[Y] /= distance;
        v[Z] /= distance;

        return v;
    }

    static addVectors(v1, v2) {
        return [
            v1[X] + v2[X],
            v1[Y] + v2[Y],
            v1[Z] + v2[Z],
            Wv,
        ];
    }

    static subtractVectors(v1, v2) {
        return [
            v1[X] - v2[X],
            v1[Y] - v2[Y],
            v1[Z] - v2[Z],
            Wv,
        ];
    }
}
