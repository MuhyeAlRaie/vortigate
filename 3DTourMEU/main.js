
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

            const imgId = el.getAttribute('id');
            document.querySelector('#Mainmap').setAttribute("src", `assets/images/${imgId}.jpg`);
            loadHotspotData(imgId);
        }
    }
});

let addedEntities = [];

async function loadHotspotData(part) {
    const response = await fetch('HotspotDataMEU.json');
    const data = await response.json();
    const viewPoints = data[part];
    const scene2 = document.querySelector('#scene2');

    addedEntities.forEach(entity => scene2.removeChild(entity));
    addedEntities = [];

    for (const point in viewPoints) {
        const location = viewPoints[point].location;
        const rotation = viewPoints[point].rotation;
        const entity = document.createElement('a-entity');

        entity.setAttribute('id', point);
        entity.setAttribute('position', location);
        entity.setAttribute('cursor-listener', '');
        entity.setAttribute('rotation', rotation);
        entity.setAttribute('scale', '0.4 0.4 0.4');

        const image = document.createElement('a-ring');
        image.setAttribute('material', 'color: white; shader: flat; side: double; transparent: true; opacity: 0.3;');
        image.setAttribute('geometry', { radiusInner: 0.3, radiusOuter: 0.5 });

        const innerPlane = document.createElement('a-plane');
        innerPlane.setAttribute('material', 'transparent: true; opacity: 0;');
        innerPlane.setAttribute('geometry', 'primitive: circle; radius: 0.3; segments: 38;');

        entity.appendChild(innerPlane);
        entity.appendChild(image);
        scene2.appendChild(entity);
        addedEntities.push(entity);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadHotspotData('01');
});
