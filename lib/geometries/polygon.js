import { Wv } from '../../constants.js';

export class Polygon {
    constructor(pointCount) {
        this.vertices = [];
        this.faces = [];

        if (pointCount > 4) {
            this.vertices.push([0, 0, 0, Wv]);
        }

        const tau = Math.PI * 2;
        const pointAngle = tau / pointCount;

        for (let i = 0; i < pointCount; i++) {
            const x = Math.cos(-pointAngle * i);
            const y = Math.sin(-pointAngle * i);

            this.vertices.push([x, y, 0, Wv]);
        }

        if (pointCount === 3) {
            this.faces.push([0, 1, 2]);
        } else if (pointCount === 4) {
            this.faces.push([0, 1, 2]);
            this.faces.push([0, 2, 3]);
        } else if (pointCount > 4) {
            for (let i = 1; i < pointCount; i++) {
                this.faces.push([0, i, i + 1]);
            }
            this.faces.push([0, pointCount, 1]);
        }
    }
}
