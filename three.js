import * as THREE from 'three'

import {GLTFLoader} from 'GTFLoader'

import {OrbitControls} from 'OrbitControls'

import {RGBELoader} from 'RGBELoader'

import { DRACOLoader } from 'DRACOLoader';

let camera, scene, renderer;

init();
render();

function init() {

    // // 取得名為parent-div的div
    const parentDiv = document.querySelector('.parent-three');

    // 創建一個新的div
    const childDiv = document.createElement('div');

    // 設置childDiv的樣式
    childDiv.style.width = '100%';
    childDiv.style.height = '100%';

    // 將childDiv添加到parentDiv中
    parentDiv.appendChild(childDiv);

    // const container = document.createElement( 'div' );
    // container.style.width = "800px";
    // container.style.height = "600px";
    // document.body.appendChild( container );

    // 創建一個 "Toggle Controls" 按鈕並添加到 parentDiv 中
    const button = document.createElement('button');
    button.innerHTML = 'Enable Controls';
    button.style.backgroundColor = "#E1F2F6";
    button.style.color = "#333333";
    childDiv.appendChild(button);

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
    camera.position.set(50,50,50);

    scene = new THREE.Scene();

    new RGBELoader()
        // .load( './three.js-master/three.js-master/examples/textures/equirectangular/royal_esplanade_1k.hdr', function ( texture ) {
        .load( './three.js-master/three.js-master/examples/textures/equirectangular/royal_esplanade_1k.hdr', function ( texture ) {

            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.background = new THREE.Color(0x7f7f7f);
            scene.environment = texture;

            render();

            // model
            const loader = new GLTFLoader();

			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath( './three.js-master/three.js-master/examples/jsm/libs/draco/gltf/' );

			loader.setDRACOLoader( dracoLoader );

            loader.load( 'assets/Well.gltf', function ( gltf ) {
            // loader.load( 'assets/LittlestTokyo.glb', function ( gltf ) {

                // scene.scale.set(0.1,0.1,0.1);
                scene.add( gltf.scene );

                render();

            } );

        } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(parentDiv.clientWidth, parentDiv.clientHeight); // 設置渲染器的大小為父元素的大小
        

    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    // container.appendChild( renderer.domElement );
    childDiv.appendChild( renderer.domElement );

    

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set( 0, 0, - 0.2 );
    controls.update();

    // 添加 "Toggle Controls" 按鈕的點擊事件
    button.addEventListener('click', function () {
        controls.enabled = !controls.enabled;

        if (controls.enabled){
            button.innerHTML = 'Enable Controls';
            button.style.backgroundColor = "#E1F2F6";
            button.style.color = "#333333";
        }else{
            button.innerHTML = 'Disable Controls';
            button.style.backgroundColor = "#2c3e50";
            button.style.color = "#fff";
        }
    });

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {
    // 获取父元素和子元素
    const parentDiv = document.querySelector('.parent-three');
    const childDiv = parentDiv.querySelector('div');

    // 获取父元素和子元素的宽度和高度
    const parentWidth = parentDiv.clientWidth;
    const parentHeight = parentDiv.clientHeight;
    const childWidth = childDiv.clientWidth;
    const childHeight = childDiv.clientHeight;

    // 设置 canvas 的宽度和高度
    const canvas = childDiv.querySelector('canvas');
    canvas.width = parentWidth;
    canvas.height = parentHeight;

    // 如果子元素的宽度和高度不等于父元素的宽度和高度，
    // 那么需要调整子元素的宽度和高度来确保它与父元素相匹配
    if (childWidth !== parentWidth || childHeight !== parentHeight) {
        childDiv.style.width = parentWidth + 'px';
        childDiv.style.height = parentHeight + 'px';
    }

    // 更新相机和渲染器的宽度和高度
    camera.aspect = parentWidth / parentHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(parentWidth, parentHeight);

    // 重新渲染场景
    render();
}


//

function render() {

    renderer.render( scene, camera );

}
