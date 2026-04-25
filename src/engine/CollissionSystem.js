export class CollisionSystem {
    static aabb(a, b) {
        return (
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y
        );
    }

    static circle(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < (a.r + b.r);
    }

    static pointInAABB(px, py, b) {
        return (
            px >= b.x &&
            px <= b.x + b.w &&
            py >= b.y &&
            py <= b.y + b.h
        );
    }
}