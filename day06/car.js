const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 2, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    const car = buildCar();
    const wheels = buildWheels(car);
    car.rotation.x = -Math.PI / 2;
    wheelAnimation(scene, wheels);

    return scene;
}

const buildCar = () => {
    //base
    const outline = [
        new BABYLON.Vector3(-0.3, 0, -0.1),
        new BABYLON.Vector3(0.2, 0, -0.1),
    ]

    //curved front
    for (let i = 0; i < 20; i++) {
        outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
    }

    //top
    outline.push(new BABYLON.Vector3(0, 0, 0.1));
    outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

    //car face UVs
    const faceUV = [];
    faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
    faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

    //car material
    const carMat = new BABYLON.StandardMaterial("carMat");
    carMat.diffuseTexture = new BABYLON.Texture("https://yjmyzz.github.io/babylon_js_study/assets/img/car.png");

    //back formed automatically
    const car = BABYLON.MeshBuilder.ExtrudePolygon("car", { shape: outline, depth: 0.2, faceUV: faceUV, wrap: true });
    car.material = carMat;

    return car;
}


const buildWheels = (car) => {
    //wheel face UVs
    const wheelUV = [];
    wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
    wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

    //car material
    const wheelMat = new BABYLON.StandardMaterial("wheelMat");
    wheelMat.diffuseTexture = new BABYLON.Texture("https://yjmyzz.github.io/babylon_js_study/assets/img/wheel.png");

    const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", { diameter: 0.125, height: 0.05, faceUV: wheelUV })
    wheelRB.material = wheelMat;

    wheelRB.parent = car;
    wheelRB.position.z = -0.1;
    wheelRB.position.x = -0.2;
    wheelRB.position.y = 0.035;

    const wheelRF = wheelRB.clone("wheelRF");
    wheelRF.position.x = 0.1;

    const wheelLB = wheelRB.clone("wheelLB");
    wheelLB.position.y = -0.2 - 0.035;

    const wheelLF = wheelRF.clone("wheelLF");
    wheelLF.position.y = -0.2 - 0.035;

    const wheels = [];
    wheels.push(wheelRB);
    wheels.push(wheelRF);
    wheels.push(wheelLB);
    wheels.push(wheelLF);

    return wheels;
}


//轮子转动
const wheelAnimation = (scene, wheels) => {
    //定义一个动画，每秒30帧，绕y轴转动
    const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y",
        30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    //动画关键帧
    const wheelKeys = [];

    //起始帧
    wheelKeys.push({
        frame: 0,
        value: 0
    });

    //截止帧(即：第30帧，转到360度)
    wheelKeys.push({
        frame: 30,
        value: 2 * Math.PI
    });

    //设置关键帧
    animWheel.setKeys(wheelKeys);

    for (let i = 0; i < wheels.length; i++) {
        //将wheel与动画关联
        wheels[i].animations = [];
        wheels[i].animations.push(animWheel);

        //开始动画,最后的true表示循环播放
        scene.beginAnimation(wheels[i], 0, 30, true);
    }
}

