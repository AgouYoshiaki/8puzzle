const red = 0xff0000;
const green = 0x00ff00;
const blue = 0x0000ff;
const blank = 0x333333;

let panelState =[
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]

function onClickPanel(e){
    // e.parent.removeChild(e);
    // thisがイベント対象, eはイベント
    // カラーテスト
    
    /*
    currentXpos = this.x;
    currentYpos = this.y;

    // 空きますとクリックされたマスを1-9の通し番号で把握
    let blankPanel = 0;
    let currentPanel = 0;
    for(let i = 0; i < 9; i++){
        if(panelState[i / 3][i % 3] == blank)blankPanel = i;
    }
    currentPanel = (this.x / 80) + ((this.y / 80) - 1) * 3;

    // %3が同じなら縦が同じ
    // /3が同じなら横が同じ
    console.log(currentPanel);
    if(blankPanel == currentPanel)return;

    if(blankPanel % 3 == currentPanel % 3){

    }
    else if(blankPanel / 3 == currentPanel / 3){

    }
    */
    if(this.tint == 0xffffff)this.tint = 0xff0000;
    else if(this.tint == 0xff0000)this.tint = 0x00ff00;
    else if(this.tint == 0x00ff00)this.tint = 0x0000ff;
    else if(this.tint == 0x0000ff)this.tint = 0x333333;
    else if(this.tint == 0x333333)this.tint = 0xff0000;
}


function gameStart(panels){
    for(let i = 0; i < 9; i++){
        panelState[i / 3][i % 3] = panels[i / 3][i % 3].tint;
        console.log(panelState[i / 3][i % 3])
    }
}
