// PIXI.JSを呼ぶ(ゲーム画面のサイズ)
const app = new PIXI.Application({ width: 400, height: 600 });

// index.htmlのbodyにviewを追加
document.body.appendChild(app.view);

// ゲームcanvas
// 描画サイズの決定
app.renderer.view.style.position = "relative";
app.renderer.view.style.width = "400px";
app.renderer.view.style.height = "600px";
app.renderer.view.style.display = "block";

// canvasの縁取り
app. renderer.view.style.border = "2px dashed black";

// canvasの背景
app.renderer.backgroundColor = 0x333333;

// プリロード
//PIXI.loader.add("ball.png");

//PIXI.loader.load((loader, resources) =>
//{
// 変数一覧
let gameLoops = []; // フレームごとに実行する関数のリスト
//let score = 0; // スコア
let targetColor = 0xff0000;
let currentColor = 0x333333;
let remainTIme = 60.00;
let countSolveRed = 0;
let countSolveGreen = 0;
let countSolveblue = 0;


// フレームごとに処理をする関数の追加
function addGameLoop(gameLoopFunction)
{
    app.ticker.add(gameLoopFunction); // 毎フレーム処理に追加
    gameLoops.push(gameLoopFunction); // リストに追加(毎フレーム処理をやめるのに必要)
}

// 毎フレーム処理を全てやめる
function removeAllGameLoops()
{
    //全部tickerから解除
    for (const gameLoop of gameLoops)
    {
        app.ticker.remove(gameLoop);
    }
    gameLoops = []; //リストを空にする
}

// 全てのシーンを削除
function removeAllScene()
{
    for (const scene of app.stage.children)
    {
        app.stage.removeChild(scene);
    }
}

/**
 * ボタンを生成してオブジェクトを返す
 * @param text テキスト
 * @param width 横幅
 * @param height 縦幅
 */

function createButton(text, width, height, color, onClick)
{
    const fontSize = 20; // フォントサイズ
    const buttonAlpha = 0.6; // 透明度
    const buttonContainer = new PIXI.Container();  // ボタンコンテナ(テキストと背景色を入れる)

    // ボタン作成
    const backColor = new PIXI.Graphics(); // グラフィックオブジェクト(半透明な四角)
    backColor.beginFill(color, buttonAlpha);
    backColor.drawRect(0, 0, width, height); // サイズを指定して配置
    backColor.endFill();
    backColor.interactive = true; // クリックできる
    backColor.on("pointerdown", onClick); // クリック時にonClickを実行
    buttonContainer.addChild(backColor); // コンテナに背景を入れる

    // テキストパラメータ
    const textStyle = new PIXI.TextStyle({
        fontFamily: "Arial", // フォント
        fontsize: fontSize,
        fill: 0xffffff, // 色
        dropShadow: true, //ドロップシャドウ
        dropShadowDistance: 2,
    });

    // テキスト作成
    const buttonText = new PIXI.Text(text, textStyle);
    buttonText.anchor.x = 0.5; // アンカーを設置
    buttonText.anchor.y = 0.5;
    buttonText.x = width / 2; // ボタンの中央に置く
    buttonText.y = height / 2;
    buttonContainer.addChild(buttonText); // コンテナにテキストを入れる
    
    return buttonContainer;
}

function createPanel(){
    const buttonAlpha = 0.8; // 透明度

    // ボタン作成
    const panel = new PIXI.Graphics(); // グラフィックオブジェクト(半透明な四角)
    panel.beginFill(0xffffff, buttonAlpha); // 後で色を変えるため
    panel.drawRect(0, 0, 80, 80); // サイズを指定して配置
    panel.endFill();
    panel.interactive = true; // クリックできる
    panel.on("pointerdown", onClickPanel); // クリック時にonClickを実行
    
    return panel;
}

// スタートシーン
function createStartScene()
{
    // 他のシーンを削除
    removeAllScene();
    // 毎フレーム処理を削除
    removeAllGameLoops();

    

    // ゲーム用のシーン
    const startScene = new PIXI.Container();
    // 画面に追加
    app.stage.addChild(startScene);

    // テキストの表示
    const textStyle = new PIXI.TextStyle({
        fontFamily: "Arial", // フォント
        fontSize: 32,// フォントサイズ
        fill: 0xfcbb08, // 色(16進数で定義する これはオレンジ色)
        dropShadow: true, // ドロップシャドウを有効にする（右下に影をつける）
        dropShadowDistance: 2, // ドロップシャドウの影の距離
    });
    const text = new PIXI.Text("8パズル", textStyle); // 結果画面のテキスト
    text.anchor.x = 0.5; // アンカーのxを中央に指定
    text.x = 200; // 座標指定 (xのアンカーが0.5で中央指定なので、テキストのx値を画面中央にすると真ん中にテキストが表示される)
    text.y = 200; // 座標指定 (yのアンカーはデフォルトの0なので、画面上から200の位置にテキスト表示)
    startScene.addChild(text); // 結果画面シーンにテキスト追加

    // スタートボタン
    const startButton = createButton("ゲームを始める", 200, 60, 0xff0000, () =>
    {
        // クリック時の処理
        createGameScene();
    })
    startButton.x = 100;
    startButton.y = 500;
    startScene.addChild(startButton);
}

// メインシーン
function createGameScene()
{
    // 他のシーンを削除
    removeAllScene();
    // 毎フレーム処理を削除
    removeAllGameLoops();

    // スコア初期化
    // score = 0;
    targetColor = 0xff0000;
    currentColor = 0x333333;
    remainTIme = 60.00;
    countSolveRed = 0;
    countSolveGreen = 0;
    countSolveblue = 0;

    // ゲーム用のシーン
    const gameScene = new PIXI.Container();
    // 画面に追加
    app.stage.addChild(gameScene);


    // スタートボタン
    const startButton = createButton("ゲームスタート", 200, 60, 0xff0000, () =>
    {
        // クリック時の処理
        gameStart(panels);
    })
    startButton.x = 100;
    startButton.y = 500;
    gameScene.addChild(startButton);

    const textStyle = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffffff,
        dropShadow: true,
        dropShadowDistance: 2,
    });

    // メニューボタン
    const menButton = createButton("≡", 30, 30, 0x0000ff, () =>
    {
        // クリック時の処理
        // タイマーは止める
        // 裏画面の反応は上からボタンを貼る
        const coverScrene = createButton("", 400, 600, 0xffffff)
        gameScene.addChild(coverScrene);

        // タイトルへ戻る
        const titleButton = createButton("終了する", 170, 60, 0xff0000, () =>
        {
            // クリック時の処理
            createEndScene();
        })
        titleButton.x = 115;
        titleButton.y = 400;
        gameScene.addChild(titleButton);

        // ゲームを再開
        const continueButton = createButton("再開する", 170, 60, 0x0000ff, () =>
        {
            // クリック時の処理
            gameScene.removeChild(titleButton);
            gameScene.removeChild(continueButton);
            gameScene.removeChild(coverScrene);
        })
        continueButton.x = 115;
        continueButton.y = 480;
        gameScene.addChild(continueButton);

    })
    gameScene.addChild(menButton);


    // ゲーム部分
    // 目標の色を表示
    const textTargetColor = new PIXI.Text("目標の色は", textStyle);
    textTargetColor.y=35;
    gameScene.addChild(textTargetColor);
    
    const targetColorPanel = new PIXI.Graphics();
    targetColorPanel.beginFill(targetColor, 1);
    targetColorPanel.drawRect(100, 35, 20, 20);
    targetColorPanel.endFill();
    gameScene.addChild(targetColorPanel);
    
    // 現在の色を表示
    const textCurrentColor = new PIXI.Text("現在の色は", textStyle);
    textCurrentColor.y = 55;
    gameScene.addChild(textCurrentColor);

    // 現在の色のパネルを出す
    const currentColorPanel = new PIXI.Graphics();

    currentColorPanel.beginFill(0xffffff, 1); // tintで着色するために白(0xffffff)にする
    currentColorPanel.drawRect(100, 55, 20, 20);
    currentColorPanel.endFill();

    currentColorPanel.tint = currentColor; // 現在の色に色味変更
    gameScene.addChild(currentColorPanel);

    // パズルの本体
    // 123
    // 456
    // 78
    
    const panel1 = createPanel();
    panel1.x = 80;
    panel1.y = 150;
    panel1.tint = 0xff0000;
    gameScene.addChild(panel1);

    const panel2 = createPanel();
    panel2.x = 160;
    panel2.y = 150;
    panel2.tint = 0xff0000;
    gameScene.addChild(panel2);

    const panel3 = createPanel();
    panel3.x = 240;
    panel3.y = 150;
    panel3.tint = 0x00ff00;
    gameScene.addChild(panel3);
    
    const panel4 = createPanel();
    panel4.x = 80;
    panel4.y = 230;
    panel4.tint = 0xff0000;
    gameScene.addChild(panel4);
    
    const panel5 = createPanel();
    panel5.x = 160;
    panel5.y = 230;
    panel5.tint = 0xff0000;
    gameScene.addChild(panel5);
    
    const panel6 = createPanel();
    panel6.x = 240;
    panel6.y = 230;
    panel6.tint = 0x00ff00;
    gameScene.addChild(panel6);
    
    const panel7 = createPanel();
    panel7.x = 80;
    panel7.y = 310;
    panel7.tint = 0x0000ff;
    gameScene.addChild(panel7);
    
    const panel8 = createPanel();
    panel8.x = 160;
    panel8.y = 310;
    panel8.tint = 0x0000ff;
    gameScene.addChild(panel8);
    
    const panel9 = createPanel();
    panel9.x = 240;
    panel9.y = 310;
    panel9.tint = 0x333333;
    gameScene.addChild(panel9);
    
    const panels = [
        [panel1, panel2, panel3],
        [panel4, panel5, panel6],
        [panel7, panel8, panel9]
    ]
    for(let i=0; i < 9; i++){
        /*
        if(i%3==0)panels[i % 3][i / 3].tint = 0xff0000;
        else if(i%3==1)panels[i % 3][i / 3].tint = 0x00ff00;
        else panels[i % 3][i / 3].tint = 0x0000ff;
        */
    }
        








    function gameLoop() // 毎フレーム処理するエリア
    {
        // 現在の色を更新
        currentColorPanel.tint = currentColor;
    }


    // 毎フレーム処理に追加
    addGameLoop(gameLoop);
}







// リザルト画面
function createEndScene()
{
    // 他のシーンを削除
    removeAllScene();
    // 毎フレーム処理を削除
    removeAllGameLoops();

    // ゲーム用のシーン
    const endScene = new PIXI.Container();
    // 画面に追加
    app.stage.addChild(endScene);

    // テキストパラメータ
    const textStyle = new PIXI.TextStyle({
        fonrFamily: "Arial",
        fontSize: 32,
        fill: 0xfcbb08,
        dropShadow: true,
        dropShadowDistance: 2,
    })

    // リザルト表示
    const textResultColor = new PIXI.Text(`YOUR COLOR IS`, textStyle);
    textResultColor.anchor.x = 0.5;
    textResultColor.x = 200;
    textResultColor.y = 200;
    endScene.addChild(textResultColor);

    // 結果の色を表示
    const resultColorPanel = new PIXI.Graphics();
    currentColor = 0x00ff00;
    resultColorPanel.beginFill(currentColor, 1);
    resultColorPanel.drawRect(170, 240, 50, 50);
    resultColorPanel.endFill();
    endScene.addChild(resultColorPanel); 

    
    //タイトルボタン
    const titleButton = createButton("タイトルへ", 170, 60, 0xff0000, () =>
    {
        // クリック時の処理
        createStartScene();
    })
    titleButton.x = 115;
    titleButton.y = 400;
    endScene.addChild(titleButton);
    
    

    // リトライボタン
    const retryButton = createButton("もう一度", 150, 60, 0xff0000, () =>
    {
        // クリック時の処理
        createGameScene();
    })
    retryButton.x = 45;
    retryButton.y = 500;
    endScene.addChild(retryButton);

    // 結果をツイートするボタン
    const tweetButton = createButton("ツイート", 150, 60, 0x0000ff, () =>
    {
        // ツイートAPI
        window.open(`http://twitter.com/intent/tweet?text=今回生成した色はこちら`) //画像を入れたい
    });
    tweetButton.x = 210;
    tweetButton.y = 500;
    endScene.addChild(tweetButton);
}

// 最初にスタート画面に行かせる
createStartScene();
//});