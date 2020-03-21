import React from 'react';
import * as THREE from 'three';

export class ThreeSixtyImage extends React.Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1100,
    );
    this.camera.target = new THREE.Vector3(0, 0, 0);

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.lon = 0;
    this.lat = 0;
    this.phi = 0;
    this.theta = 0;
  }

  createMesh = async () => {
    const geometry = new THREE.SphereBufferGeometry(500, 60, 40);

    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    const loader = new THREE.TextureLoader();

    //allow cross origin loading
    loader.crossOrigin = '';

    return new Promise((resolve, reject) => {
      loader.load(
        this.props.imgURI,
        (texture) => {
          console.log('texture loaded');

          const material = new THREE.MeshBasicMaterial({ map: texture });

          const mesh = new THREE.Mesh(geometry, material);

          resolve(mesh);
        },
        undefined,
        (e) => {
          console.log('error:', e);

          reject(e);
        },
      );
    });
  };

  async componentDidMount() {
    try {
      const mesh = await this.createMesh();

      this.scene.add(mesh);

      document.body.appendChild(this.renderer.domElement);

      this.animate();
    } catch (error) {
      console.error('error:', error);
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    // if ( isUserInteracting === false ) {
    this.lon += 0.1;
    // }

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = THREE.MathUtils.degToRad(90 - this.lat);
    this.theta = THREE.MathUtils.degToRad(this.lon);

    this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
    this.camera.target.y = 500 * Math.cos(this.phi);
    this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.lookAt(this.camera.target);

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div ref={this.myRef} />;
  }
}

/*

function init() {



				

				






				
				

				document.addEventListener( 'mousedown', onPointerStart, false );
				document.addEventListener( 'mousemove', onPointerMove, false );
				document.addEventListener( 'mouseup', onPointerUp, false );

				document.addEventListener( 'wheel', onDocumentMouseWheel, false );

				document.addEventListener( 'touchstart', onPointerStart, false );
				document.addEventListener( 'touchmove', onPointerMove, false );
				document.addEventListener( 'touchend', onPointerUp, false );

				//

				document.addEventListener( 'dragover', function ( event ) {

					event.preventDefault();
					event.dataTransfer.dropEffect = 'copy';

				}, false );

				document.addEventListener( 'dragenter', function () {

					document.body.style.opacity = 0.5;

				}, false );

				document.addEventListener( 'dragleave', function () {

					document.body.style.opacity = 1;

				}, false );

				document.addEventListener( 'drop', function ( event ) {

					event.preventDefault();

					var reader = new FileReader();
					reader.addEventListener( 'load', function ( event ) {

						material.map.image.src = event.target.result;
						material.map.needsUpdate = true;

					}, false );
					reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

					document.body.style.opacity = 1;

				}, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onPointerStart( event ) {

				isUserInteracting = true;

				var clientX = event.clientX || event.touches[ 0 ].clientX;
				var clientY = event.clientY || event.touches[ 0 ].clientY;

				onMouseDownMouseX = clientX;
				onMouseDownMouseY = clientY;

				onMouseDownLon = lon;
				onMouseDownLat = lat;

			}

			function onPointerMove( event ) {

				if ( isUserInteracting === true ) {

					var clientX = event.clientX || event.touches[ 0 ].clientX;
					var clientY = event.clientY || event.touches[ 0 ].clientY;

					lon = ( onMouseDownMouseX - clientX ) * 0.1 + onMouseDownLon;
					lat = ( clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;

				}

			}

			function onPointerUp() {

				isUserInteracting = false;

			}

			function onDocumentMouseWheel( event ) {

				var fov = camera.fov + event.deltaY * 0.05;

				camera.fov = THREE.MathUtils.clamp( fov, 10, 75 );

				camera.updateProjectionMatrix();

			}

*/
