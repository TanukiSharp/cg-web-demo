import { Wv } from '../../constants.js';
import { VectorUtils } from '../utils/vector.js';

// Source: https://stackoverflow.com/questions/17705621/algorithm-for-a-geodesic-sphere

export class GeodesicSphere {
    constructor(depth) {
        const points = [];
        const faces = [];

        this._initializeSphere(points, faces, depth);

        this.vertices = points;
        this.faces = faces;
    }

    _subdivide(v1, v2, v3, points, faces, depth) {
        if (depth === 0) {
            const face = [];

            face.push(points.length);
            points.push(v1);

            face.push(points.length);
            points.push(v2);

            face.push(points.length);
            points.push(v3);

            faces.push(face);

            return;
        }

        const v12 = VectorUtils.normalizeInPlace(VectorUtils.addVectors(v1, v2));
        const v23 = VectorUtils.normalizeInPlace(VectorUtils.addVectors(v2, v3));
        const v31 = VectorUtils.normalizeInPlace(VectorUtils.addVectors(v3, v1));

        this._subdivide(v1, v12, v31, points, faces, depth - 1);
        this._subdivide(v2, v23, v12, points, faces, depth - 1);
        this._subdivide(v3, v31, v23, points, faces, depth - 1);
        this._subdivide(v12, v23, v31, points, faces, depth - 1);
    }

    _initializeSphere(points, faces, depth) {
        const x = 0.525731112119133606;
        const z = 0.850650808352039932;

        const vertices = [
            [-x, 0, z, Wv], [x, 0, z, Wv], [-x, 0, -z, Wv], [x, 0, -z, Wv],
            [ 0, z, x, Wv], [0, z, -x, Wv], [0, -z, x, Wv], [0, -z, -x, Wv],
            [z, x, 0, Wv], [-z, x, 0, Wv], [z, -x, 0, Wv], [-z, -x, 0, Wv],
        ];

        const indices = [
            [0, 1, 4], [0, 4, 9], [9, 4, 5], [4, 8, 5], [4, 1, 8],
            [8, 1, 10], [8, 10, 3], [5, 8, 3], [5, 3, 2], [2, 3, 7],
            [7, 3, 10], [7, 10, 6], [7, 6, 11], [11, 6, 0], [0, 6, 1],
            [6, 10, 1], [9, 11, 0], [9, 2, 11], [9, 5, 2], [7, 11, 2],
        ];

        for (let i = 0; i < 20; i++) {
            this._subdivide(vertices[indices[i][0]], vertices[indices[i][1]], vertices[indices[i][2]], points, faces, depth);
        }
    }
}
