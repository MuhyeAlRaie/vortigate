const imageCount = 56; // عدل العدد حسب عدد الصور الموجودة لديك
const preloadImages = ['01', '02', '03', '04', '05', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']; // الصور الثلاثة الأولى
const preloadedImages = new Set();

function preloadInitialImages() {
    let loadedCount = 0;
    preloadImages.forEach(id => {
        const img = new Image();
        img.src = `assets/images/${id}.jpg`;
        img.onload = () => {
            preloadedImages.add(id);
            loadedCount++;
            if (loadedCount === preloadImages.length) {
                hideLoadingScreen();
            }
        };
    });
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.transition = 'opacity 0.5s';
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
}

let hotspotJson = {};
let currentImageId = "01";
let addedEntities = [];

AFRAME.registerComponent('cursor-listener', {
    init: function () {
        var el = this.el;

        el.addEventListener('mouseenter', () => {
            el.setAttribute('scale', '0.7 0.7 0.7');
            document.querySelector('#Navigator').setAttribute('visible', 'false');
        });

        el.addEventListener('mouseleave', () => {
            el.setAttribute('scale', '0.6 0.6 0.6');
            document.querySelector('#Navigator').setAttribute('visible', 'true');
        });

        el.addEventListener('mousedown', handleInteraction);
        el.addEventListener('touchstart', handleInteraction);

        function handleInteraction(event) {
    event.preventDefault();
    const root = document.getElementById('root');
    while (root.firstChild) root.removeChild(root.firstChild);

    const hotspotId = el.getAttribute('id');
    const infoData = hotspotJson[currentImageId]?.[hotspotId]?.info;

    if (infoData) {
        const type = infoData.type || 'text';
        if (type === 'web') {
            const url = infoData.url;
            const boardPosition = infoData.boardPosition || '0 1.5 -2';
            const boardRotation = infoData.boardRotation || '0 0 0';
            show3DWebBoard(url, boardPosition, boardRotation);
        }else if (type === 'image') {
        show3DTextInfoBoard(
            infoData.image,
            infoData.boardPosition || '0 1.5 -2',
            infoData.boardRotation || '0 0 0',
            infoData.imageSize || '1.5 0.5'
        );
    }
        else {
            const infoText = infoData.text || '';
            const boardPosition = infoData.boardPosition || '0 1.5 -2';
            const textPosition = infoData.textPosition || '0 0 0.01';
            const boardRotation = infoData.boardRotation || '0 0 0';
            show3DInfoBoard(infoText, boardPosition, textPosition, boardRotation);
        }
    } else {
        morphToImage(hotspotId);
        loadHotspotData(hotspotId);
        currentImageId = hotspotId;
    }
}
    }
});

  AFRAME.registerComponent('controller-tracker', {
    init: function () {
      this.tracked = false;

      this.el.addEventListener('controllerconnected', () => {
        console.log('Controller connected:', this.el);
        this.tracked = true;
      });

      this.el.addEventListener('controllerdisconnected', () => {
        console.log('Controller disconnected:', this.el);
        this.tracked = false;
      });
    },

    tick: function () {
      if (!this.tracked) return;

      const pos = this.el.object3D.position;
      const rot = this.el.object3D.rotation;
      console.log(`Tracking: Pos (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`);
    }
  });

function show3DTextInfoBoard(imageSrc, boardPosition, boardRotation, imageSize = "1.5 0.5") {
    const root = document.getElementById('root');

    const board = document.createElement('a-entity');
    board.setAttribute('position', boardPosition);
    board.setAttribute('rotation', boardRotation);
    board.setAttribute('scale', '0 0 0');

    board.setAttribute('animation__scale', {
        property: 'scale',
        to: '1 1 1',
        dur: 500,
        easing: 'easeOutElastic'
    });

    const [width, height] = imageSize.split(" ");
    const image = document.createElement('a-image');
    image.setAttribute('src', imageSrc);
    image.setAttribute('width', width);
    image.setAttribute('height', height);
    image.setAttribute('position', '0 0 0');

    board.appendChild(image);
    root.appendChild(board);

    setTimeout(() => {
        if (board.parentNode) {
            board.setAttribute('animation__scale_out', {
                property: 'scale',
                to: '0 0 0',
                dur: 500,
                easing: 'easeInOutCubic'
            });
            setTimeout(() => {
                if (board.parentNode) board.parentNode.removeChild(board);
            }, 500);
        }
    }, 20000);
}
function show3DInfoBoard(content, boardPosition, textPosition, boardRotation) {
    const root = document.getElementById('root');

    const board = document.createElement('a-entity');
    board.setAttribute('position', boardPosition);
    board.setAttribute('rotation', boardRotation);
    board.setAttribute('scale', '0 0 0');

    // Scale animation
    board.setAttribute('animation__scale', {
        property: 'scale',
        to: '1 1 1',
        dur: 500,
        easing: 'easeOutElastic'
    });

    // Background plane
    const background = document.createElement('a-plane');
    background.setAttribute('width', '1.6');
    background.setAttribute('height', '0.8');
    background.setAttribute('color', '#ffffff');
    background.setAttribute('material', 'side: double; opacity: 0.9');
    background.setAttribute('position', '0 0 0');

    // Text (Arabic support if needed)
    const text = document.createElement('a-text');
    text.setAttribute('value', content);
    text.setAttribute('align', 'center');
    text.setAttribute('color', '#000000');
    text.setAttribute('width', '1.5');
    text.setAttribute('wrap-count', '40');
    text.setAttribute('position', textPosition);
    text.setAttribute('direction', 'rtl'); // Optional for Arabic
    text.setAttribute('baseline', 'center');

    board.appendChild(background);
    board.appendChild(text);
    root.appendChild(board);

    setTimeout(() => {
        if (board.parentNode) {
            board.setAttribute('animation__scale_out', {
                property: 'scale',
                to: '0 0 0',
                dur: 500,
                easing: 'easeInOutCubic'
            });
            setTimeout(() => {
                if (board.parentNode) board.parentNode.removeChild(board);
            }, 500);
        }
    }, 20000);
}

function show3DWebBoard(url, boardPosition, boardRotation) {
    const root = document.getElementById('root');

    const board = document.createElement('a-entity');
    board.setAttribute('position', boardPosition);
    board.setAttribute('rotation', boardRotation);
    board.setAttribute('scale', '0 0 0');

    board.setAttribute('animation__scale', {
        property: 'scale',
        to: '1 1 1',
        dur: 500,
        easing: 'easeOutElastic'
    });

    const background = document.createElement('a-plane');
    background.setAttribute('width', '1.6');
    background.setAttribute('height', '1');
    background.setAttribute('color', '#ffffff');
    background.setAttribute('material', 'side: double; opacity: 0.9');
    background.setAttribute('position', '0 0 0');

    board.appendChild(background);
    root.appendChild(board);

    const iframeContainer = document.createElement('div');
iframeContainer.style.position = 'fixed';
iframeContainer.style.top = '50%';
iframeContainer.style.left = '50%';
iframeContainer.style.transform = 'translate(-50%, -50%)';
iframeContainer.style.width = '90vw';
iframeContainer.style.maxWidth = '800px';
iframeContainer.style.height = '70vh';
iframeContainer.style.maxHeight = '500px';
iframeContainer.style.background = '#fff';
iframeContainer.style.border = '2px solid #000';
iframeContainer.style.borderRadius = '8px';
iframeContainer.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
iframeContainer.style.zIndex = '9999';
iframeContainer.style.overflow = 'hidden';
iframeContainer.style.display = 'flex';
iframeContainer.style.flexDirection = 'column';

    const closeButton = document.createElement('button');
    closeButton.innerText = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '18px';
    closeButton.title = 'Close';

    closeButton.onclick = () => {
        if (iframeContainer.parentNode) iframeContainer.parentNode.removeChild(iframeContainer);
        if (board.parentNode) board.parentNode.removeChild(board);
    };

    const iframe = document.createElement('iframe');
iframe.src = url;
iframe.style.flex = '1';
iframe.style.border = 'none';
iframe.style.width = '100%';
iframe.style.height = '100%';

    iframeContainer.appendChild(closeButton);
    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);
}

function morphToImage(newId) {
    const mainSky = document.querySelector('#Mainmap');
    const transitionSky = document.querySelector('#MainmapTransition');

    transitionSky.setAttribute('src', `assets/images/${newId}.jpg`);
    transitionSky.setAttribute('visible', 'true');
    transitionSky.setAttribute('material', 'opacity: 0.001');

    // إزالة أي أنيميشن قديم
    transitionSky.removeAttribute('animation__fadein');
    mainSky.removeAttribute('animation__fadeout');

    // اسم عشوائي لتجنب تكرار الاسم
    const fadeInName = `fadein_${Date.now()}`;
    const fadeOutName = `fadeout_${Date.now()}`;

    // Fade in new image
    transitionSky.setAttribute(`animation__${fadeInName}`, {
        property: 'material.opacity',
        to: 1,
        dur: 1000,
        easing: 'easeInOutQuad'
    });

    // Fade out old image
    mainSky.setAttribute(`animation__${fadeOutName}`, {
        property: 'material.opacity',
        to: 0,
        dur: 1000,
        easing: 'easeInOutQuad'
    });

    setTimeout(() => {
        mainSky.setAttribute('src', `assets/images/${newId}.jpg`);
        mainSky.setAttribute('material', 'opacity: 1');
        transitionSky.setAttribute('visible', 'false');
        transitionSky.setAttribute('material', 'opacity: 0');

        // تنظيف الأنيميشنات لتجنب تراكمها
        transitionSky.removeAttribute(`animation__${fadeInName}`);
        mainSky.removeAttribute(`animation__${fadeOutName}`);
    }, 1100);
}

async function loadHotspotData(part) {
    const response = await fetch('HotspotDataMEU.json');
    hotspotJson = await response.json();
    const viewPoints = hotspotJson[part];
    const scene2 = document.querySelector('#scene2');

    addedEntities.forEach(entity => scene2.removeChild(entity));
    addedEntities = [];

    for (const point in viewPoints) {
        const location = viewPoints[point].location;
        const rotation = viewPoints[point].rotation;

        let positionStr;
        if (typeof location === 'string') {
            positionStr = location;
        } else if (typeof location === 'object') {
            positionStr = `${location.x} ${location.y} ${location.z}`;
        }

        const entity = document.createElement('a-entity');
        entity.setAttribute('id', point);
        entity.setAttribute('position', positionStr);
        entity.setAttribute('cursor-listener', '');
        entity.setAttribute('rotation', rotation);
        entity.setAttribute('scale', '0.6 0.6 0.6');

        const isInfoPoint = !!viewPoints[point].info;

        let visual;
        if (isInfoPoint) {
       visual = document.createElement('a-image');
visual.setAttribute('class', 'interactable');
visual.setAttribute('src', 'assets/images/info-icon.png'); // المسار إلى صورة الأيقونة
visual.setAttribute('width', '0.7');
visual.setAttribute('height', '0.7');
visual.setAttribute('transparent', 'true');
visual.setAttribute('alpha-test', '0.5');
        } else {
           visual = document.createElement('a-circle');
visual.setAttribute('class','interactable');
visual.setAttribute('material', 'color: white; shader: flat; side: double; transparent: true; opacity: 0.6;');
visual.setAttribute('geometry', { radius: 0.7, segments: 38 });
        }

        const innerPlane = document.createElement('a-plane');
        innerPlane.setAttribute('material', 'transparent: true; opacity: 0;');
        innerPlane.setAttribute('geometry', 'primitive: circle; radius: 0.3; segments: 38;');

        entity.appendChild(innerPlane);
        entity.appendChild(visual);
        scene2.appendChild(entity);
        addedEntities.push(entity);
    }
}


    document.addEventListener('DOMContentLoaded', function () {
    preloadInitialImages();
    loadHotspotData('01');

    // بعد ثانيتين يبدأ تحميل باقي الصور بهدوء
    setTimeout(() => {
        lazyLoadRemainingImages();
    }, 2000);
});
