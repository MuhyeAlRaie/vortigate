const imageCount = 56; // عدل العدد حسب عدد الصور الموجودة لديك
const preloadImages = ['01', '02', '03']; // الصور الثلاثة الأولى
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
            el.setAttribute('scale', '0.5 0.5 0.5');
            document.querySelector('#Navigator').setAttribute('visible', 'false');
        });

        el.addEventListener('mouseleave', () => {
            el.setAttribute('scale', '0.4 0.4 0.4');
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
                const infoText = infoData.text || '';
                const boardPosition = infoData.boardPosition || '0 1.5 -2';
                const textPosition = infoData.textPosition || '0 0 0.01';
                const boardRotation = infoData.boardRotation || '0 0 0';
                show3DInfoBoard(infoText, boardPosition, textPosition, boardRotation);
            } else {
                morphToImage(hotspotId);
                loadHotspotData(hotspotId);
                currentImageId = hotspotId;
            }
        }
    }
});

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
    background.setAttribute('material', 'side: double; opacity: 0');
    background.setAttribute('position', '0 0 0');
    background.setAttribute('animation__fadein', {
        property: 'material.opacity',
        to: 0.85,
        dur: 500,
        easing: 'easeInOutQuad'
    });

    // Text
    const text = document.createElement('a-text');
    text.setAttribute('value', content);
    text.setAttribute('align', 'center');
    text.setAttribute('color', '#000000');
    text.setAttribute('width', '1.5');
    text.setAttribute('wrap-count', '40');
    text.setAttribute('position', textPosition);

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
        entity.setAttribute('scale', '0.4 0.4 0.4');

        const isInfoPoint = !!viewPoints[point].info;

        let visual;
        if (isInfoPoint) {
            visual = document.createElement('a-plane');
            visual.setAttribute('material', 'color:#8e101b; shader: flat; side: double; opacity: 0.95');
            visual.setAttribute('geometry', 'primitive: circle; radius: 0.2; segments: 38;');
        } else {
            visual = document.createElement('a-ring');
            visual.setAttribute('material', 'color: white; shader: flat; side: double; transparent: true; opacity: 0.3;');
            visual.setAttribute('geometry', { radiusInner: 0.3, radiusOuter: 0.5 });
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
