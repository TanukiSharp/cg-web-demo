import { Wv } from '../../constants.js';

// Source: https://webglfundamentals.org/webgl/lessons/webgl-qna-how-to-create-a-torus.html

export class Torus {
    constructor(largeRingRadius, smallRingRadius, smallRingDivisions, largeRingDivisions) {
        this.vertices = [];
        this.faces = [];

        const tau = Math.PI * 2;

        for (let i = 0; i <= smallRingDivisions; i++) {
            const smallRingAngle = i * tau / smallRingDivisions;

            const smallRingAngleCos = Math.cos(smallRingAngle);
            const smallRingAngleSin = Math.sin(smallRingAngle);

            const baseRadius = largeRingRadius + smallRingRadius * smallRingAngleCos;

            for (let j = 0; j <= largeRingDivisions; j++) {
                const largeRingAngle = j * tau / largeRingDivisions;

                const largeRingAngleCos = Math.cos(largeRingAngle);
                const largeRingAngleSin = Math.sin(largeRingAngle);

                let x = baseRadius * largeRingAngleCos;
                let y = baseRadius * largeRingAngleSin;
                let z = smallRingRadius * smallRingAngleSin;

                this.vertices.push([x, y, z, Wv]);
            }
        }

        for (let i = 0; i < smallRingDivisions; i++) {
            let v1 = i * (largeRingDivisions + 1);
            let v2 = v1 + largeRingDivisions + 1;

            for (let j = 0; j < largeRingDivisions; j++) {
                this.faces.push([v1, v1 + 1, v2]);
                this.faces.push([v2, v1 + 1, v2 + 1]);
                v1++;
                v2++;
            }
        }
    }
}
