class Vector2 {
    x = 0;
    y = 0;

    /**
     * Addition with another Vec2
     * @param {} Vector2
     * @returns Vector2
     */
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    /**
     * Substraction with another Vec2
     * @param {} Vector2
     * @returns Vector2
     */
    sub(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    /**
     * Multiplication with Scalar
     * @param {} Number
     * @returns Vector2
     */
    mul(other) {
        return new Vector2(this.x * other, this.y * other);
    }

    /**
     * Division with Scalar
     * @param {} Number
     * @returns Vector2
     */
    div(other) {
        return new Vector2(this.x / other, this.y / other);
    }

    /**
     * The length of the Vec2
     * @returns Number
     */
    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Normalizes the Vec2 to a length of 1.0
     * @returns Vector2
     */
    norm() {
        return this.div(this.len);
    }

    /**
     * Calculates the angle of the vector to the X axis
     * @param {*} Number Optional, the lenght of the vector. Use only if it's already cached to reduce repetitive usage of sqrt();
     * @returns Number (Radians)
     */
    angle(len = null) {
        return Math.acos(this.x/((len == null) ? this.len() : len)) * Math.sign(this.y);
    }

    /**
     * Calculates the dot product between two vectors
     * @param {*} Vector2
     * @returns Number
     */
    dot(other) {
        return this.len() * other.len() * cos(angle() - other.angle());
    }

    /**
     * Clears the vectors values.
     */
    clear() {
        this.x = 0;
        this.y = 0;
    }

    constructor(x, y) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }
}

class EnumShape {
    static ShapeCircle = 0;
    static ShapeRect = 1;

    value = 0;

    set(value) {
        if (value < EnumShape.ShapeCircle || value > EnumShape.ShapeRect) {
            console.error(`Invalid value for ENUM SHAPE: ${value}`);
            this.value = EnumShape.ShapeCircle;
        }
    }

    equals(other) {
        return this.value == other.value;
    }

    constructor(value) {
        this.set(value);
    }
}

const EnumShapeCircle = new EnumShape(EnumShape.ShapeCircle);
const EnumShapeRect   = new EnumShape(EnumShape.ShapeRect);

class Entity {
    texture       = null;
    
    position      = new Vector2();
    position_prev = new Vector2();
    size          = new Vector2(1, 1);
    shape         = EnumShapeCircle;

    acceleration  = new Vector2();

    render(ctx) {

    } 

    updatePositions(deltaTime) {
        let velocity = this.position.sub(this.position_prev);
        this.position_prev = this.position;

        // Verlet
        this.position = this.position.add(velocity).add(this.acceleration.mul(deltaTime * deltaTime));
        this.acceleration.clear();
    }

    accelerate(vector) {
        this.acceleration = this.acceleration.add(vector);
    }

    constructor(position, size) {
        this.position = position;
        this.position_prev = position;

        this.size = size;
    }
}