const { regClass } = Laya;
import { RuntimeScriptBase } from "./RuntimeScript.generated";

@regClass()
export class RuntimeScript extends RuntimeScriptBase {
    // 分数数字
    private scoreNumber = 0;
    // 每点击一下的增加次数
    private clickPower = 1;
    // 每秒升级的次数
    private autoClick = 0;
    // 给增加次数所需要的点数
    private clickPowerCost = 2;
    // 给增加每秒自动次数所需要的点数
    private autoClickCost = 8;
    onAwake(): void {
        this.updateScore();
        this.updateClickPowerButton();
        this.updateAutoClickButton();
        this.updateClickPowerLabel();
        this.updateAutoClickLabel();
        this.click.on(Laya.Event.CLICK, () => {
            this.scoreNumber += this.clickPower;
            this.updateScore();
            // 获得鼠标当前位置
            const mousePosX = Laya.stage.mouseX;
            const mousePosY = Laya.stage.mouseY;
            // 创建一个label
            const label = new Laya.Label();
            // 设置label的文本
            label.text = `+${this.clickPower}`;
            // 设置label的位置
            label.pos(mousePosX, mousePosY);
            // 设置字体大小
            label.fontSize = 100;
            // 将label添加到舞台
            Laya.stage.addChild(label);
            // 给添加动画，向上移动，然后消失
            Laya.Tween.to(
                label,
                { y: label.y - 300 },
                300,
                null,
                Laya.Handler.create(this, () => {
                    Laya.Tween.clearTween(label);
                    label.removeSelf();
                })
            );
        });
        this.clickPowerButton.on(Laya.Event.CLICK, () => {
            if (this.scoreNumber >= this.clickPowerCost) {
                this.scoreNumber -= this.clickPowerCost;
                this.updateScore();
                this.upgradeClickPower();
                this.clickPower++;
                this.updateClickPowerLabel();
                this.updateClickPowerButton();
            }
        });
        this.autoClickButton.on(Laya.Event.CLICK, () => {
            if (this.scoreNumber >= this.autoClickCost) {
                this.scoreNumber -= this.autoClickCost;
                this.updateScore();
                this.upgradeAutoClick();
                this.autoClick++;
                this.updateAutoClickLabel();
                this.updateAutoClickButton();
            }
        });
        Laya.timer.loop(1000, this, this.addAutoClick);
    }
    updateScore() {
        this.score.text = `${this.scoreNumber}`;
    }
    updateClickPowerButton() {
        this.clickPowerButton.label = `点击能力 -${this.clickPowerCost}`;
    }
    updateAutoClickButton() {
        this.autoClickButton.label = `自动点击 -${this.autoClickCost}`;
    }
    upgradeClickPower() {
        this.clickPowerCost *= 20;
    }
    upgradeAutoClick() {
        this.autoClickCost *= 80;
    }
    updateClickPowerLabel() {
        this.clickPowerLabel.text = `+${this.clickPower}`;
    }
    updateAutoClickLabel() {
        this.autoClickLabel.text = `+${this.autoClick}/s`;
    }
    addAutoClick() {
        this.scoreNumber += this.autoClick;
        // 创建一个label
        const label = new Laya.Label();
        // 设置label的文本
        label.text = `+${this.autoClick}`;
        // 设置label的位置
        label.pos(this.autoClickButton.x + 200, this.autoClickButton.y);
        // 设置字体大小
        label.fontSize = 100;
        // 将label添加到舞台
        Laya.stage.addChild(label);
        // 给添加动画，向上移动，然后消失
        Laya.Tween.to(
            label,
            { y: label.y - 300 },
            300,
            null,
            Laya.Handler.create(this, () => {
                Laya.Tween.clearTween(label);
                label.removeSelf();
            })
        );
        this.updateScore();
    }
    onEnable(): void {}
}
