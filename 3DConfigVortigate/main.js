function convertRange(value, oldMin, oldMax, newMin, newMax) {
    const normalizedValue = (value - oldMin) / (oldMax - oldMin);
    const newValue = normalizedValue * (newMax - newMin) + newMin;
    return newValue;
}

var pos;
var color;

// Function to detect if the user is on a mobile device
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Conditionally register the follow-mouse component if not on a mobile device
if (!isMobileDevice()) {
    AFRAME.registerComponent('follow-mouse', {
        schema: {
            target: {
                type: 'selector'
            }
        },
        init: function() {
            window.addEventListener('mousemove', this.eventHandler.bind(this));
            window.addEventListener('touchmove', this.eventHandler.bind(this));
        },
        eventHandler: function(evt) {
            var rect = this.el.sceneEl.canvas.getBoundingClientRect();
            var x = (evt.clientX || evt.touches[0].clientX) - rect.left;
            var y = (evt.clientY || evt.touches[0].clientY) - rect.top;
            x = x / rect.width * 2 - 1;
            y = -y / rect.height * 2 + 1;
            var vector = new THREE.Vector3(x, y, 0.5);
            var camera = this.el.sceneEl.camera;
            var cameraWorldPosition = new THREE.Vector3();
            camera.getWorldPosition(cameraWorldPosition);
            vector.unproject(camera);

            var dir = vector.sub(cameraWorldPosition).normalize();
            color = readPixelColor(evt);
            var distance = color.g / 255 * 10;



            pos = cameraWorldPosition.clone().add(dir.multiplyScalar(distance));
            this.data.target.setAttribute('position', pos);

            let yaw = convertRange(color.r, 0, 255, 90, -90);
            let pitch = convertRange(color.b, 0, 255, 90, -90);
            this.data.target.setAttribute('rotation', {
                x: pitch,
                y: yaw,
                z: 0
            });
        }
    });
}

// List to store added entities
let addedEntities = [];

async function loadHotspotData(part) {
    const response = await fetch('HotspotData.json');
    const data = await response.json();
    const viewPoints = data[part];
    const scene2 = document.querySelector('#scene2');
    // Remove previously added entities
    addedEntities.forEach(entity => scene2.removeChild(entity));
    addedEntities = []; // Clear the list



    for (const point in viewPoints) {
        const location = viewPoints[point].location;
        const rotation = viewPoints[point].rotation;
        const entity = document.createElement('a-entity');

        if (point.includes('Config')) {
            entity.setAttribute('id', point);
            entity.setAttribute('position', location);
            entity.setAttribute('position', location);
            entity.setAttribute('cursor-listener', '');
            entity.setAttribute('rotation', rotation);
            entity.setAttribute('scale', "0.4 0.4 0.4");


            const image = document.createElement('a-plane');
            image.setAttribute('material', 'color: grey; shader: flat; side: double; transparent: true;opacity: 0.7;');
            image.setAttribute('geometry', 'primitive: circle; radius: 0.2; segments: 38;');

            const image2 = document.createElement('a-plane');
            image2.setAttribute('material', 'color: white; shader: flat; side: double; transparent: true;opacity: 1;');
            image2.setAttribute('geometry', 'primitive: circle; radius: 0.08; segments: 38;');
            image2.setAttribute('position', '0 0 0.002');


            entity.appendChild(image2);
            entity.appendChild(image);

            scene2.appendChild(entity);
            addedEntities.push(entity);

            // Add scale animation
            entity.setAttribute('animation__scale', {
                property: 'scale',
                from: '0.0 0.0 0.0',
                to: '0.4 0.4 0.4',
                dur: 2000,
                easing: 'easeOutElastic'
            });

        } else {
            entity.setAttribute('id', point);
            entity.setAttribute('position', location);
            entity.setAttribute('cursor-listener', '');
            entity.setAttribute('rotation', rotation);
            entity.setAttribute('scale', "0.4 0.4 0.4");

            const image = document.createElement('a-ring');
            image.setAttribute('material', 'color: white; shader: flat; side: double; transparent: true; opacity: 0.3;');
            image.setAttribute('geometry', {
                radiusInner: 0.3,
                radiusOuter: .5
            });

            const innerPlane = document.createElement('a-plane');
            innerPlane.setAttribute('material', 'transparent: true; opacity: 0;');
            innerPlane.setAttribute('geometry', 'primitive: circle; radius: 0.3; segments: 38;');

            entity.appendChild(innerPlane);
            entity.appendChild(image);

            scene2.appendChild(entity);
            addedEntities.push(entity);
            // Add scale animation
            entity.setAttribute('animation__scale', {
                property: 'scale',
                from: '0.0 0.0 0.0',
                to: '0.4 0.4 0.4',
                dur: 1500,
                easing: 'easeOutElastic'
            });
        }
    }
}


const wheelscolors = ['#394d45', '#bcb9bd', '#be8f5d', '#add0cb'];
const offsets = [0.001, -0.002, 0.003, 0.004];
let currentConfig = 'Sofa';

AFRAME.registerComponent('cursor-listener', {
    init: function() {
        var el = this.el;

        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
        el.addEventListener('touchstart', handleEnter);
        el.addEventListener('touchend', handleLeave);

        el.addEventListener('mousedown', handleInteraction);
        el.addEventListener('touchstart', handleInteraction);

        function handleEnter() {
            el.setAttribute('scale', '0.5 0.5 0.5');
            document.querySelector('#Navigator').setAttribute('visible', 'false');
            if (!el.getAttribute('id').includes('Config')) {
                el.lastElementChild.setAttribute('material', 'opacity', 0.5);
                el.lastElementChild.setAttribute('material', 'transparent', true);
            }
        }

        function handleLeave() {
            el.setAttribute('scale', '0.4 0.4 0.4');
            document.querySelector('#Navigator').setAttribute('visible', 'true');
            if (!el.getAttribute('id').includes('Config')) {
                el.lastElementChild.setAttribute('material', 'opacity', 0.3);
                el.lastElementChild.setAttribute('material', 'transparent', true);
            }
        }

        function handleInteraction(event) {
            event.preventDefault();
            const root = document.getElementById('root');
            while (root.firstChild) {
                root.removeChild(root.firstChild);
            }

            if (el.getAttribute('id').includes('Config')) {
                var camera = document.querySelector('#scene2 a-camera');
                let ringEntities = [];


                wheelscolors.forEach((color, index) => {
                    setTimeout(() => {
                        ringEntities.push(ringAnimation(el, color, offsets[index], camera));
                    }, index * 100);
                });

                setTimeout(() => {
                    ringEntities.forEach(ring => {
                        ring.parentNode.removeChild(ring);
                    });
                    ringEntities = [];
                    create3DText(el);
                    animateBGUI(el, camera);
                }, 7 * 150);

                config.forEach(item => {
                    if (el.getAttribute('id').includes(item.name)) {
                        currentConfig = item.name;
                        colors.forEach(color => {
                            if (color.name === item.value) {
                                color.edgeColor = '#000000';

                            } else {
                                color.edgeColor = '#FFFFFF';
                            }
                        });


                    }
                });

            } else {
                const viewpointConfig = config.find(item => item.name === 'Viewpoint');
                if (viewpointConfig) {
                    viewpointConfig.value = el.id;
                }

                const pngFileName = generatePNGName(config);
                document.querySelector('#Mainmap').setAttribute("src", "https://du3zdyenrn790.cloudfront.net/RGB_" + pngFileName);
                document.querySelector('#Depthmap').setAttribute('src', `https://du3zdyenrn790.cloudfront.net/ND_${el.id}_0000.jpg`);
                loadHotspotData(el.getAttribute('id'));

            }
        }
    }
});

function darkenHexColor(hex, amount) {
    let usePound = false;

    if (hex[0] === "#") {
        hex = hex.slice(1);
        usePound = true;
    }

    const num = parseInt(hex, 16);

    let r = (num >> 16) - amount;
    if (r < 0) r = 0;
    else if (r > 255) r = 255;

    let g = ((num >> 8) & 0x00FF) - amount;
    if (g < 0) g = 0;
    else if (g > 255) g = 255;

    let b = (num & 0x0000FF) - amount;
    if (b < 0) b = 0;
    else if (b > 255) b = 255;

    return (usePound ? "#" : "") + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

AFRAME.registerComponent('config-listener', {
    init: function() {
        var el = this.el;
        var originalcolor = el.getAttribute('material').color;

        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
        el.addEventListener('touchstart', handleEnter);
        el.addEventListener('touchend', handleLeave);

        el.addEventListener('mousedown', handleInteraction);
        el.addEventListener('touchstart', handleInteraction);

        function handleEnter() {
            if (el.id === 'xx') return;
            el.setAttribute('color', `${darkenHexColor(originalcolor, 20)}`);
            document.querySelector('#Navigator').setAttribute('visible', 'false');
        }

        function handleLeave() {
            el.setAttribute('color', originalcolor);
            document.querySelector('#Navigator').setAttribute('visible', 'true');
        }

        function handleInteraction(event) {
            event.preventDefault();
            if (el.id === 'xx') {
                const root = document.getElementById('root');
                while (root.firstChild) {
                    root.removeChild(root.firstChild);
                }
            } else {
                const pullConfig = config.find(item => item.name === currentConfig);
                if (pullConfig) {
                    pullConfig.value = el.id;
                }
                const pngFileName = generatePNGName(config);
                document.getElementById("Mainmap").setAttribute("src", "https://du3zdyenrn790.cloudfront.net/RGB_" + pngFileName);

                const ringChildren = document.querySelectorAll('[config-listener]');
                ringChildren.forEach(child => {
                    child.children[0].setAttribute('color', '#FFFFFF');
                });

                el.children[0].setAttribute('color', '#000000');
            }
        }
    }
});

function generatePNGName(config) {
    let pngName = '';

    config.forEach(item => {
        if (item.adj) {
            pngName += `${item.name}${item.value}_`;
        } else {
            pngName += `${item.value}_`;
        }
    });

    pngName = pngName.slice(0, -1) + '_0000.webp';

    return pngName;
}

var storedImageData = null;
var storedCanvas = null;

function captureImageData() {
    var scene1 = document.querySelector('#scene1');
    var screenshotComponent = scene1.components.screenshot;
    screenshotComponent.data.width = window.innerWidth;
    screenshotComponent.data.height = window.innerHeight;
    storedCanvas = screenshotComponent.getCanvas('perspective');
    storedCanvas.setAttribute('willReadFrequently', true);
    var context = storedCanvas.getContext('2d');
    storedImageData = context.getImageData(0, 0, storedCanvas.width, storedCanvas.height);


}

function readPixelColor(event) {
    if (!storedImageData) {
        return null;
    }

    var x = event.clientX || event.touches[0].clientX;
    var y = event.clientY || event.touches[0].clientY;
    var index = (y * storedImageData.width + x) * 4;
    var r = storedImageData.data[index];
    var g = storedImageData.data[index + 1];
    var b = storedImageData.data[index + 2];
    var a = storedImageData.data[index + 3];
    var color = {
        r: r,
        g: g,
        b: b,
        a: a
    };
    return color;
}



document.addEventListener('DOMContentLoaded', function() {
    loadHotspotData('Livingroom_1');


    if (!isMobileDevice()) {

        var depthmap = document.querySelector('#Depthmap');
        depthmap.addEventListener('materialtextureloaded', function() {
            captureImageData();
        });

        var scene2 = document.querySelector('#scene2');
        var isDragging = false;

        scene2.addEventListener('mousedown', startDrag);
        scene2.addEventListener('touchstart', startDrag);

        scene2.addEventListener('mousemove', drag);
        scene2.addEventListener('touchmove', drag);

        scene2.addEventListener('mouseup', endDrag);
        scene2.addEventListener('touchend', endDrag);

        function startDrag(event) {
            isDragging = true;
        }

        function drag(event) {
            if (isDragging) {
                const clientX = event.clientX || (event.touches && event.touches[0].clientX);
                const clientY = event.clientY || (event.touches && event.touches[0].clientY);
                var camera = document.querySelector('#scene2 a-camera');
                var cameraRotation = camera.getAttribute('rotation');
                var CamRoot = document.querySelector('#scene1 a-entity');
                CamRoot.setAttribute('rotation', camera.getAttribute('rotation'));
            }
            readPixelColor(event);
        }

        function endDrag(event) {
            if (isDragging) {
                isDragging = false;
                captureImageData();
            }
        }
    }
});