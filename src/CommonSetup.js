export class CommonSetup {
    constructor() {
        this.lowerBound = 50;
        this.upperBound = 125;
    }

    // 카메라 위치
    setCamScale(k) {
        const resizeFactor = k.width() / k.height();
        if (resizeFactor < 1) {
            k.camScale(k.vec2(1));
            return;
        }

        k.camScale(k.vec2(1.5));
    }

    // 상하 좌우 공통 움직임 처리
    handleCommonMove(angle, obj, name) {
        if (angle > this.lowerBound && angle < this.upperBound && obj.curAnim() !== `walk-up-${name}`) {
            obj.play(`walk-up-${name}`);
            obj.direction = "up";
            return;
        }

        if (angle < -this.lowerBound && angle > -this.upperBound && obj.curAnim() !== `walk-down-${name}`) {
            obj.play(`walk-down-${name}`);
            obj.direction = "down";
            return;
        }

        if (Math.abs(angle) > this.upperBound) {
            obj.flipX = false;
            if (obj.curAnim() !== `walk-side-${name}`) obj.play(`walk-side-${name}`);
            obj.direction = "right";
            return;
        }

        if (Math.abs(angle) < this.lowerBound) {
            obj.flipX = true;
            if (obj.curAnim() !== `walk-side-${name}`) obj.play(`walk-side-${name}`);
            obj.direction = "left";
            return;
        }
    }

    // 액션이 끝났을 때 공통 움직임 처리
    handleCommonReleaseMove(obj, name) {
        if (obj.direction === "down") {
            obj.play(`idle-down-${name}`);
            return;
        }

        if (obj.direction === "up") {
            obj.play(`idle-up-${name}`);
            return;
        }

        obj.play(`idle-side-${name}`);
    }
}
