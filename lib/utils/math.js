export class MathUtils {
    static radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    static clamp(min, max, value) {
        if (value < min) {
            return min;
        }

        if (value > max) {
            return max;
        }

        return value;
    }
}
