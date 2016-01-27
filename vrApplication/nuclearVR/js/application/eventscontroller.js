var camera, scene, renderer;
var effect, controls;
var element, container;
var first_time=53
var second_time=52
var third_time=51
var cube2;
var fallout=[]
var light;
var ambiLight;

var clock = new THREE.Clock(false);
var bombCube, bombMaterial, bomb;
var fogMaterial, fogGeometry, fog;

var sky, sunSphere;

var mushroomCloudBase;
var mushroomCloudTop;
var mushCloudBaseGrow = true;
var mushroomCloudTopLight;
var loader = new THREE.JSONLoader();
var meshCar;
var endGame = false;

var container, stats;
var camera, scene, particles, geometry, materials = [], parameters, i, h, color, sprite, size;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

var dotsInterval = window.setInterval(function() {
  if($('#loading_dots').text().length < 3) {
    $('#loading_dots').text($('#loading_dots').text() + '.');
  }
  else {
    $('#loading_dots').text('');
  }
}, 500);

function startButton(){
  clock.start();
  source.start(0);
  $('#goButton').remove();
}

function init() {

  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('example');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xd0e0f0, 0.0025 );

  camera = new THREE.PerspectiveCamera(90, 0, 0.001, 1400);
    // camera.position.set(-35, 10, 10);

    camera.position.set(-35, 10, 10);

    scene.add(camera);


//nuclear winter
geometry = new THREE.Geometry();
// geometry = new THREE.SphereGeometry();


for ( var i = 0; i < 2000; i ++ ) {
  var vertex = new THREE.Vector3();

  vertex.x = Math.random() * 2000 - 1000;
  vertex.y = Math.random() * 2000 - 1000;
  vertex.z = Math.random() * 2000 - 1000;

  geometry.vertices.push( vertex );
  geometry.dynamic=true;
}

parameters = [
[ [1, 1, 0.5], 5 ],
[ [0.95, 1, 0.5], 4 ],
[ [0.90, 1, 0.5], 3 ],
[ [0.85, 1, 0.5], 2 ],
[ [0.80, 1, 0.5], 1 ]
];

for ( i = 0; i < parameters.length; i ++ ) {

  color = parameters[i][0];
  size  = parameters[i][1];

  materials[i] = new THREE.PointCloudMaterial( { size: size } );

  particles = new THREE.PointCloud( geometry, materials[i] );

  particles.rotation.x = Math.random() * 6;
  particles.rotation.y = Math.random() * 6;
  particles.rotation.z = Math.random() * 6;

  fallout.push(particles)
  // scene.add( particles );
}

controls = new THREE.OrbitControls(camera, element);
controls.rotateUp(Math.PI / 4);
controls.target.set(
  camera.position.x + 0.1,
  camera.position.y,
  camera.position.z
  );
controls.noZoom = true;
controls.noPan = true;

var geometry = new THREE.PlaneGeometry( 100, 100 );
var texture = new THREE.Texture( generateTexture() );
texture.needsUpdate = true;

for (var k=-15; k <15; k++){
  for (var j = 0; j < 15; j ++){
    for ( var i = 0; i < 15; i ++ ) {
      var material = new THREE.MeshBasicMaterial( {
        color: new THREE.Color().setHSL( 0.3, 0.75, ( i / 15 ) * 0.4 + 0.1 ),
        map: texture,
        depthTest: false,
        depthWrite: false,
        transparent: true
      } );

      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.z = k*100;
      mesh.position.y = i * 0.25;
      mesh.position.x = -95 + (100*-j);
      mesh.rotation.x = - Math.PI / 2;
      scene.add( mesh );
    }
  }


       //generate bomb
       bombCube = new THREE.BoxGeometry(10, 10, 10);
       bombMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
       bomb = new THREE.Mesh(bombCube, bombMaterial);

      // //generate fog
      fogGeometry = new THREE.CylinderGeometry(20,10,5,50);
      fogMaterial = new THREE.MeshLambertMaterial({ color: 0xC9C9C5});
      fog = new THREE.Mesh( fogGeometry, fogMaterial  );
      fogMaterial.transparent=true;
      fogMaterial.opacity=.5

      fogGeometryTop = new THREE.CylinderGeometry(20,10,5,50);
      fogMaterialTop = new THREE.MeshLambertMaterial({ color: 0xC9C9C5 });
      fogTop = new THREE.Mesh( fogGeometryTop, fogMaterialTop  );
      fogMaterialTop.transparent=true;
      fogMaterialTop.opacity=.5

      fogGeometryBottom = new THREE.CylinderGeometry(20,10,5,50);
      fogMaterialBottom = new THREE.MeshLambertMaterial({ color: 0xC9C9C5 });
      fogBottom = new THREE.Mesh( fogGeometryBottom, fogMaterialBottom  );
      fogMaterialBottom.transparent=true;
      fogMaterialBottom.opacity=.5

}

      function generateTexture() {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 512;
        canvas.height = 512;
        var context = canvas.getContext( '2d' );

        for ( var i = 0; i < 20000; i ++ ) {
          context.fillStyle = 'hsl(0,0%,' + ( Math.random() * 50 + 50 ) + '%)';
          context.beginPath();
          context.arc( Math.random() * canvas.width, Math.random() * canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true );
          context.fill();
        }

        context.globalAlpha = 0.075;
        context.globalCompositeOperation = 'lighter';

        return canvas;
      }


      var city  = new THREEx.ProceduralCity()
      scene.add(city)

      var light2 = new THREE.HemisphereLight( 0xfffff0, 0x101020, 1.25 );
      light2.position.set( 0.75, 1, 0.25 );
      scene.add( light2 );

      var roadGeo = new THREE.BoxGeometry(50,0.1,1500);
      var roadMat = new THREE.MeshBasicMaterial( { color: 0x383838 } );

      var roadTexture = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/road1.jpg'),
      });

      var road = new THREE.Mesh( roadGeo, roadMat );
      road.position.set(0,0,0);
      scene.add( road );

      var sidewalkGeo1 = new THREE.BoxGeometry(20,0.1,1500);
      var sidewalkMat1 = new THREE.MeshBasicMaterial( { color: 0xCCCCCC } );
      var sidewalk1 = new THREE.Mesh( sidewalkGeo1, sidewalkMat1);
      sidewalk1.position.set(35,0,0);
      scene.add(sidewalk1);

      var sidewalkGeo2 = new THREE.BoxGeometry(20,0.1,1500);
      var sidewalkMat2 = new THREE.MeshBasicMaterial( { color: 0xCCCCCC } );
      var sidewalk2 = new THREE.Mesh( sidewalkGeo2, sidewalkMat2);
      sidewalk2.position.set(-35,0,0);
      scene.add(sidewalk2);


      var mushroomCloudBaseGeo = new THREE.CylinderGeometry( 50, 50, 10, 32 );
      mushroomCloudBaseGeo.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
      var mushroomCloudMat = new THREE.MeshBasicMaterial( {color: 0xff6700} );
      mushroomCloudBase = new THREE.Mesh( mushroomCloudBaseGeo, mushroomCloudMat );
      mushroomCloudBase.position.set(200,0,200);
      scene.add( mushroomCloudBase );

      var mushroomCloudTopGeo = new THREE.SphereGeometry( 25, 32, 32 );
      var mushroomCloudTopMat = new THREE.MeshBasicMaterial( {color: 0xffff00} );
      mushroomCloudTop = new THREE.Mesh( mushroomCloudTopGeo, mushroomCloudTopMat );
      mushroomCloudTop.position.set(200,180,200)

      mushroomCloudTopLight = new THREE.PointLight( 0xffffff, 0, 0 );
      mushroomCloudTopLight.position.set( 200, 180, 200 );
      scene.add( mushroomCloudTopLight );

      var buildingGroundGeo = new THREE.BoxGeometry(100,1,1500)
      var buildingGroundMat = new THREE.MeshBasicMaterial( { color: 0x1D1D1D } );
      buildingGround = new THREE.Mesh( buildingGroundGeo, buildingGroundMat );
      buildingGround.position.set(95,0,0);
      scene.add( buildingGround );

      var grassbaseGeo = new THREE.BoxGeometry(100,1,1500)
      var gassbaseMat = new THREE.MeshBasicMaterial( { color: 0x002B00 } );
      grassbase = new THREE.Mesh( grassbaseGeo, gassbaseMat );
      grassbase.position.set(-95,0,0);
      scene.add( grassbase );

      light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
      scene.add(light);

      var texture = THREE.ImageUtils.loadTexture('checker.png');
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat = new THREE.Vector2(50, 50);
      texture.anisotropy = renderer.getMaxAnisotropy();

      var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture
      });

      var geometry = new THREE.PlaneGeometry(1000, 1000);

      var rectLength = 10, rectWidth = 5;

      var darkMaterial = new THREE.MeshBasicMaterial( { color: 0xd99ff00, transparent:true } );
      var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, transparent:true} );
      var multiMaterial = [ darkMaterial, wireframeMaterial ];
      var plane = new THREE.PlaneGeometry(1000, 100)
      var box = new THREE.BoxGeometry(1000,100,5)

      function setOrientationControls(e) {
        if (!e.alpha) {
          return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
      }

      window.addEventListener('deviceorientation', setOrientationControls, true);

      window.addEventListener('resize', resize, false);
      setTimeout(resize, 1);

    }

    function resize() {
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      effect.setSize(width, height);
    }

    function update(dt) {
      resize();
      camera.updateProjectionMatrix();
      controls.update(dt);
    }

    function render(dt) {
      effect.render(scene, camera);
    }


      // set bomb position
      bomb.position.set(200, 660, 200);
      // scene.add(bomb)

      //set fog position
      fog.position.set(200, 120, 200);
      fogTop.position.set(200, 150, 200)
      fogBottom.position.set(200, 90, 200)

      function animate(t) {
        requestAnimationFrame(animate);

        var timer = clock.getElapsedTime();

        if((timer < 47)&&(timer>5)){
          camera.position.x += .1;
          camera.position.y=7;

          if(Math.floor(camera.position.x)%2==0){
            camera.position.y+=.2;
          }
          else {
            camera.position.y-=.2;
          }

          if(Math.floor(timer)==45){
            scene.add(bomb);
          }
        }
        else if((timer>=45)&&(timer<62)){
          camera.position.x -= 2;
          camera.position.y=7;
        }
        else if((clock.elapsedTime>=62)&&(clock.elapsedTime<64)){
        // light.intensity += 0.01;
        camera.position.x -= 0;
        camera.position.y -= .01;

        if(Math.floor(clock.elapsedTime*16)%2==0){
          camera.position.y+=.9;
        }
        else{
          camera.position.y-=.9;
        }
      } else {
        camera.position.y -= 0
        camera.position.x -= 0
      }

      // bomb and fog appearance
      if(timer>41)
      {
        bomb.position.y -= 4.8;
      }

      if(Math.floor(timer)==first_time)
      {
        scene.add( fogTop );
      }
      else if(timer>first_time)
      {
        fogTop.scale.z +=.07;
        fogTop.scale.x +=.07;
      }

      if(Math.floor(timer)==second_time)
      {
        scene.add(fog);
      }
      if(timer>second_time)
      {
        fog.scale.z +=.05
        fog.scale.x +=.05
      }

      if(Math.floor(timer)==third_time)
      {
        scene.add( fogBottom );
      }
      if(timer>third_time)
      {
        fogBottom.scale.z +=.02
        fogBottom.scale.x +=.02
      }

      if (timer > 50){

        light.intensity += 3;

        if (mushCloudBaseGrow === true){
          mushroomCloudBase.scale.y += .15
          mushroomCloudBase.scale.x += .005
          mushroomCloudBase.scale.z += .005
        }

        if (mushroomCloudBase.scale.y > 20 && mushCloudBaseGrow === true){
          mushroomCloudTop.scale.x += .05
          mushroomCloudTop.scale.y += .01
          mushroomCloudTop.scale.z += .05
          mushroomCloudBase.scale.y += .08
          mushroomCloudBase.scale.x += .001
          mushroomCloudBase.scale.z += .001
          scene.add( mushroomCloudTop );
        }

        if (mushroomCloudBase.scale.y > 34.8 && mushCloudBaseGrow === true){
          mushCloudBaseGrow = false;
        }

        if (mushCloudBaseGrow === false){
          mushroomCloudTop.scale.x += .05
          mushroomCloudTop.scale.y += .01
          mushroomCloudTop.scale.z += .05
          mushroomCloudTopLight.intensity += 1
        }
          // render()

        }

        if(Math.floor(timer)==64)
        {
          // var nuke_light = new THREE.AmbientLight(0x404040)
          //       scene.add(nuke_light)
          renderer.setClearColor(0xffffff, 1)
                // nuke_light.intensity += .5;
              }

              if(Math.floor(timer)==64){
          //add fallout particles
          for(var f in fallout){
            scene.add(fallout[f])
          }
          // scene.add(fallout[Math.random()*fallout.length])
        }

        if(Math.floor(timer)==67){
          //add fallout particles
          for(var f in fallout){
            scene.add(fallout[f])
            scene.add(fallout[f])
          }
          // scene.add(fallout[Math.random()*fallout.length])
        }

        if(Math.floor(timer)==68){
          //add fallout particles
          for(var f in fallout){
            scene.add(fallout[f])
            scene.add(fallout[f])
            scene.add(fallout[f])
          }
          // scene.add(fallout[Math.random()*fallout.length])
        }

        if(Math.floor(timer)==69){
          //add fallout particles
          for(var f in fallout){
            scene.add(fallout[f])
            scene.add(fallout[f])
            scene.add(fallout[f])
            scene.add(fallout[f])
            scene.add(fallout[f])
          }
          // scene.add(fallout[Math.random()*fallout.length])
        }

        render_particles();

        if ((endGame === false)  && (timer > 120)){
          endGame = true;
          $("#loadMsg").append("<button onclick='endButton()' id='goButton'>Experience Again</button>");
        }


        update(clock.getDelta());
        render(clock.getDelta());
      }

      function endButton(){
        location.reload();
      }

      function fullscreen() {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        }
      }

      function render_particles() {
        var time = Date.now() * 0.00005;
        // camera.position.x += ( mouseX - camera.position.x ) * 0.05;
        // camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
        // camera.lookAt( scene.position );
        // light.intensity+=1
        
        for ( i = 0; i < fallout.length; i ++ ) {
        var object = fallout[ i ];
        if ( object instanceof THREE.PointCloud ) {
        // object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
        object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
        object.rotation.z = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
        object.rotation.x = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
        }
      }

      for ( i = 0; i < materials.length; i ++ ) {
          // color = parameters[i][0];
          // h = ( 360 * ( color[0] + time ) % 360 ) / 360;
          // materials[i].color.setHSL( h, color[1], color[2] );

        }
        // renderer.render( scene, camera );
      }
      
