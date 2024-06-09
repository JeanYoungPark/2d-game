export class CommonSetup {
    constructor() {}

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
    handleCommonMove(dir, obj, name) {
        if (dir === "up" && obj.curAnim() !== `walk-up-${name}`) {
            obj.play(`walk-up-${name}`);
            return;
        }

        if (dir === "down" && obj.curAnim() !== `walk-down-${name}`) {
            obj.play(`walk-down-${name}`);
            return;
        }

        if (dir === "right" && obj.curAnim() !== `walk-side-${name}`) {
            obj.flipX = false;
            obj.play(`walk-side-${name}`);
            return;
        }

        if (dir === "left" && obj.curAnim() !== `walk-side-${name}`) {
            obj.flipX = true;
            obj.play(`walk-side-${name}`);
            return;
        }

        obj.direction = dir;
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

        if (obj.direction === "left" || obj.direction == "right") {
            obj.play(`idle-side-${name}`);
        }
    }

    handleAngleToDir(anglr) {}
}
