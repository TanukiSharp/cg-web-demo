import { X, Y, Z, R, G, B } from '../../constants.js';
import { GeometryUtils } from './geometry.js';
import { VectorUtils } from './vector.js';
import { MatrixUtils } from './matrix.js';
import { MathUtils } from './math.js';

export class RenderUtils {
    static drawCircle(ctx, x, y, radius, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    static drawTriangle(ctx, p1, p2, p3, color) {
        ctx.beginPath();
        ctx.moveTo(p1[X], p1[Y]);
        ctx.lineTo(p2[X], p2[Y]);
        ctx.lineTo(p3[X], p3[Y]);
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.stroke();
    }

    static drawLineFromPoints(ctx, p1, p2, width, color) {
        RenderUtils.drawLine(ctx, p1[X], p1[Y], p2[X], p2[Y], width, color);
    }

    static drawLine(ctx, x1, y1, x2, y2, width, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    static colorRgbToColorString(red, green, blue) {
        red = MathUtils.clamp(0, 255, red);
        green = MathUtils.clamp(0, 255, green);
        blue = MathUtils.clamp(0, 255, blue);

        return `rgb(${red},${green},${blue})`;
    }

    static colorVectorToColorString(v) {
        return RenderUtils.colorRgbToColorString(v[X], v[Y], v[Z]);
    }

    /**
     * Options used when rendering a geometry.
     * @typedef {Object} GeometryRenderOptions
     * @property {Array} transformsMatrix - A matrix that transforms the geometry to render.
     * @property {Array} projectionMatrix - A matrix that project 3D world-space vertices to 2D screen-space points.
     * @property {boolean} fillTriangles - Tells whether to fill triangles or not. If true, you have to set color.
     * @property {string|Array} color - A string or RGB array color, used when drawing triangles.
     * @property {Array} lightPosition - The position of a light, used when drawing triangles.
     * @property {number} ambientLight - A value added to the lighting coeficient before multiply it to color.
     * @property {number} lineWidth - Width of geometry lines for wireframe render.
     * @property {string} lineColor - Color of geometry lines for wireframe render.
     * @property {number} pointWidth - Width of geometry vertices.
     * @property {string} pointColor - Color of geometry vertices, used only when rendering circle to show vertices positions.
     * @property {boolean} showPointNumbers - Display vertices index.
     * @property {string} pointNumberColor - Color used to draw vertices index.
     * @property {string} pointNumberFont - Font used to render vertices number.
     */

    /**
     * @param {GeometryRenderOptions} options
     */
    static drawGeometry(ctx, geometry, options) {
        const transformedPoints = [];
        const projectedPoints = [];

        for (let i = 0; i < geometry.vertices.length; i++) {
            const vertex = geometry.vertices[i];

            const transformedPointMatrix = MatrixUtils.multiplyMatrices(options.transformsMatrix, [vertex]);
            const projectedPointMatrix = MatrixUtils.multiplyMatrices(options.projectionMatrix, transformedPointMatrix);

            transformedPoints.push(transformedPointMatrix[0]);

            const projectedPoint = MatrixUtils.projectPoint(projectedPointMatrix, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

            projectedPoints.push(projectedPoint);
        }

        if (options.fillTriangles) {
            RenderUtils.drawTriangles(ctx, transformedPoints, projectedPoints, geometry.faces, options);
        }

        if (options.lineWidth > 0) {
            RenderUtils.drawGeometryLines(ctx, projectedPoints, geometry.faces, options.lineWidth, options.lineColor);
        }

        if (options.pointWidth > 0) {
            for (let i = 0; i < projectedPoints.length; i++) {
                const points = projectedPoints[i];

                RenderUtils.drawCircle(ctx, points[X], points[Y], options.pointWidth, options.pointColor);
            }
        }

        if (options.showPointNumbers) {
            for (let i = 0; i < projectedPoints.length; i++) {
                const points = projectedPoints[i];

                ctx.fillStyle = options.pointNumberColor;
                ctx.font = options.pointNumberFont;

                ctx.fillText(i.toString(), points[X], points[Y]);
            }
        }
    }

    static sortTriangles(transformedPoints, faces) {
        faces.sort((f1, f2) => {
            const a1 = transformedPoints[f1[0]];
            const a2 = transformedPoints[f1[1]];
            const a3 = transformedPoints[f1[2]];

            const b1 = transformedPoints[f2[0]];
            const b2 = transformedPoints[f2[1]];
            const b3 = transformedPoints[f2[2]];

            const az = a1[Z] + a2[Z] + a3[Z];
            const bz = b1[Z] + b2[Z] + b3[Z];

            return bz - az;
        });
    }

    static computeColor(transformedPoints, face, options) {
        const v1 = transformedPoints[face[0]];
        const v2 = transformedPoints[face[1]];
        const v3 = transformedPoints[face[2]];

        const computedNormal = GeometryUtils.computeNormal(v1, v2, v3);

        const backFaceCulling = VectorUtils.dotProduct([0, 0, -1], computedNormal);

        if (backFaceCulling < 0) {
            return null;
        }

        if (typeof options.color === 'string') {
            return options.color;
        }

        if (options.color && options.color.length === 3) {
            if (options.lightPosition) {
                const faceCenter = GeometryUtils.computeTriangleCenter(v1, v2, v3);

                const lightVector = VectorUtils.normalizeInPlace(VectorUtils.subtractVectors(options.lightPosition, faceCenter));

                let lightCoeficient = MathUtils.clamp(0, 1, VectorUtils.dotProduct(lightVector, computedNormal) + options.ambientLight);

                const colorCoeficient = lightCoeficient * lightCoeficient;

                return RenderUtils.colorRgbToColorString(
                    options.color[R] * colorCoeficient,
                    options.color[G] * colorCoeficient,
                    options.color[B] * colorCoeficient,
                );
            }

            return RenderUtils.colorVectorToColorString(options.color);
        }

        return null;
    }

    static drawTriangles(ctx, transformedPoints, projectedPoints, faces, options) {
        if (!faces || faces.length === 0) {
            return;
        }

        RenderUtils.sortTriangles(transformedPoints, faces);

        for (let i = 0; i < faces.length; i++) {
           const face = faces[i];

            const p1 = projectedPoints[face[0]];
            const p2 = projectedPoints[face[1]];
            const p3 = projectedPoints[face[2]];

            const color = RenderUtils.computeColor(transformedPoints, face, options);

            if (color !== null) {
                RenderUtils.drawTriangle(ctx, p1, p2, p3, color);
            }
        }
    }

    static drawGeometryLines(ctx, projectedPoints, faces, lineWidth, color) {
        for (const face of faces) {
            const p0 = projectedPoints[face[0]];
            const p1 = projectedPoints[face[1]];
            const p2 = projectedPoints[face[2]];

            RenderUtils.drawLineFromPoints(ctx, p0, p1, lineWidth, color);
            RenderUtils.drawLineFromPoints(ctx, p0, p2, lineWidth, color);
            RenderUtils.drawLineFromPoints(ctx, p1, p2, lineWidth, color);
        }
    }
}
