const bgUIsize = 0.17;

function ringAnimation(el, color, offset, camera) {

    // Create a half-circle ring
    const ring = document.createElement('a-ring');
    ring.setAttribute('material', `color: ${color}; shader: flat; side: double; transparent: true; opacity: 1;`);
    ring.setAttribute('geometry', {
        radiusInner: 0.1,
        radiusOuter: bgUIsize,
        thetaStart: 90,
        thetaLength: 360
    });

    // Set the location, rotation, and scale of the half-ring
    // Use the position of 'el' with an offset
    const initialPosition = el.getAttribute('position');

    const cameraPosition = camera.getAttribute('position');

    // Calculate the direction vector from the camera to the ring
    const directionVector = {
        x: initialPosition.x - cameraPosition.x,
        y: initialPosition.y - cameraPosition.y,
        z: initialPosition.z - cameraPosition.z
    };

    // Apply the offset in the correct direction for each axis
    ring.setAttribute('position', {
        x: initialPosition.x - (offset * directionVector.x),
        y: initialPosition.y - (offset * directionVector.y),
        z: initialPosition.z - (offset * directionVector.z)
    });
    // Get the initial rotation from 'el' and add it to the ring's rotation
    const initialRotation = el.getAttribute('rotation');
    ring.setAttribute('rotation', `${initialRotation.x} ${initialRotation.y} ${initialRotation.z}`);

    ring.setAttribute('scale', {
        x: 1,
        y: 1,
        z: 1
    }); // Adjust the scale as needed

    // Add the half-ring to the scene
    const root = document.getElementById('root');

    root.appendChild(ring);

    // Animate the ring rotation and thetaLength
    let rotationAngle = 0;
    const rotationSpeed = 2; // Adjust the rotation speed as desired (degrees per frame)
    const totalRotationAngle = 90; // Total rotation angle in degrees
    let frameCount = 0;
    const totalFrames = totalRotationAngle / rotationSpeed; // Calculate the total number of frames
    let slider = 0.0; // 0 to 1
    let reverse = false; // Direction flag

    function animateRing() {
        if (frameCount < totalFrames) {
            rotationAngle += rotationSpeed;

            // Adjust slider value based on direction
            if (!reverse) {
                slider = (frameCount * 2 + 2) / totalRotationAngle;
                if (slider >= 1.0) {
                    reverse = true; // Switch to reverse mode

                }
            } else {
                slider = (totalRotationAngle - (frameCount * 2 + 2)) / totalRotationAngle;
                if (slider <= 0.0) {
                    reverse = false; // Switch back to forward mode (if needed)
                }
            }

            // Apply the rotation and geometry updates
            ring.setAttribute('geometry', {
                radiusInner: 0.1 * (1 - slider),
                radiusOuter: bgUIsize,
                thetaStart: 90,
                thetaLength: slider * 360,
                segmentsTheta: 38
            });

            frameCount++;
            requestAnimationFrame(animateRing);
        }
    }

    animateRing();
    return ring;
}

//////////////////////
function getUpVectorOfInitialRotation(el) {
    // Assuming rotation is an object with x, y, z properties (Euler angles in degrees)
    const rotation = el.getAttribute('rotation');

    if (!rotation) {
        throw new Error('Element does not have a rotation attribute.');
    }

    // Convert rotation angles from degrees to radians
    const radX = THREE.Math.degToRad(rotation.x);
    const radY = THREE.Math.degToRad(rotation.y);
    const radZ = THREE.Math.degToRad(rotation.z);

    // Create a quaternion from the Euler angles
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(radX, radY, radZ, 'YXZ'));

    // Define the initial up vector (0, 1, 0) in local space
    const upVector = new THREE.Vector3(0, 1, 0);

    // Apply the rotation to the up vector
    upVector.applyQuaternion(quaternion);

    return upVector;
}


const config = [{
        name: 'Viewpoint',
        value: 'Livingroom_1',
        adj: ''
    },
    {
        name: 'Kitchen',
        value: 'Brown',
        adj: 'LACQUER'
    },
    {
        name: 'Sofa',
        value: 'Brown',
        adj: 'UPHOLSTERY'
    },
    {
        name: 'Wall',
        value: 'Grey',
        adj: 'WALL-PAINT'
    }
];

const colors = [{
        name: 'Green',
        value: '#394d45',
        edgeColor: '#FFFFFF'
    },
    {
        name: 'Grey',
        value: '#bcb9bd',
        edgeColor: '#FFFFFF'
    },
    {
        name: 'Yellow',
        value: '#be8f5d',
        edgeColor: '#FFFFFF'
    },
    {
        name: 'Brown',
        value: '#6f4f2e',
        edgeColor: '#FFFFFF'
    },
    {
        name: 'xx',
        value: '#FFFFFF',
        edgeColor: '#FFFFFF'
    },
];

function create3DText(el, color, size) {
    const elPosition = el.getAttribute('position');
    const elRotation = el.getAttribute('rotation');
    const root = document.getElementById('root');
    let text = '';
    const elId = el.getAttribute('id');
    config.forEach(item => {
        if (elId.includes(item.name)) {
            text = item.adj
        }
    });

    // Define approximate widths for each character
    const charWidths = {
        'U': 0.15,
        'P': 0.13,
        'H': 0.15,
        'O': 0.17,
        'L': 0.123,
        'S': 0.14,
        'T': 0.15,
        'E': 0.15,
        'R': 0.15,
        'Y': 0.15,
        'A': 0.16,
        'C': 0.15,
        'Q': 0.15,
        'W': 0.2,
        'I': 0.06,
        'N': 0.15,
        '-': 0.11
    };

    // Split the text into individual characters
    const characters = text.split('');

    // Calculate the total width of the text
    const totalWidth = characters.reduce((acc, char) => {
        return acc + (charWidths[char] || size || 0.15); //
    }, 0);

    // Calculate the horizontal offset for each character
    const spacing = 0; // Adjust the width based on the size of the text
    const rightVector = getRightVectorOfInitialRotation(el);
    const upVector = getUpVectorOfInitialRotation(el);

    // Create a new a-entity for each character
    let currentOffset = 0; // Start from the leftmost position
    characters.forEach((char, index) => {
        const charEntity = document.createElement('a-text');
        charEntity.setAttribute('text-geometry', {
            value: char,
            size: size || 0.15,
            height: 0.03, // Thickness of the text
            bevelEnabled: true,
            bevelSize: 0.005,
            bevelThickness: 0.001
        });
        charEntity.setAttribute('material', {
            color: color || 'white',
        });

        // Set the initial position of the character with horizontal offset
        const charWidth = charWidths[char] / 1.25 || size || 0.15; //1.25comrd from scale 1/0.8 = 1.25
        charEntity.setAttribute('position', {
            x: elPosition.x + (rightVector.x * currentOffset),
            y: elPosition.y + (rightVector.y * currentOffset) - 1,
            z: elPosition.z + (rightVector.z * currentOffset)
        });

        const targetPosition = {
            x: elPosition.x + (rightVector.x * currentOffset),
            y: elPosition.y + (rightVector.y * currentOffset),
            z: elPosition.z + (rightVector.z * currentOffset)
        };

        charEntity.setAttribute('rotation', elRotation);
        charEntity.setAttribute('scale', '0 0 0 ');


        root.appendChild(charEntity);

        // Animate the character vertically with a delay
        const delay = index * 100; // 200ms delay between each character
        charEntity.setAttribute('animation', {
            property: 'position',
            // from: '0 0 0',
            to: `${targetPosition.x} ${targetPosition.y + 0.18} ${targetPosition.z}`, // Adjust the vertical offset as needed
            dur: 400, // Duration of the animation in milliseconds
            easing: 'easeInOutQuad',
            delay: delay
        });

        // Animate the scale of the character
        charEntity.setAttribute('animation__scale', {
            property: 'scale',
            from: '0 0 0',
            to: '.8 .8 .8',
            dur: 400, // Duration of the animation in milliseconds
            easing: 'easeInOutQuad',
            delay: delay
        });

        // Update the current offset for the next character
        currentOffset += charWidth + spacing;
    });


}




//////////////////////////
function createHalfCircle(el, thetaStartValue) {
    // Create a half-circle ring
    const ring = document.createElement('a-ring');
    ring.setAttribute('material', `color: #add0cb; shader: flat; side: double; transparent: true; opacity: 1;`);
    ring.setAttribute('geometry', {
        radiusInner: 0,
        radiusOuter: bgUIsize,
        thetaStart: thetaStartValue,
        thetaLength: 180
    });

    // Set the location, rotation, and scale of the half-ring
    // Use the position of 'el' with an offset
    const initialPosition = el.getAttribute('position');

    // Apply the offset in the correct direction for each axis
    ring.setAttribute('position', initialPosition);
    // Get the initial rotation from 'el' and add it to the ring's rotation
    const initialRotation = el.getAttribute('rotation');
    ring.setAttribute('rotation', `${initialRotation.x} ${initialRotation.y} ${initialRotation.z}`);

    ring.setAttribute('scale', {
        x: 1,
        y: 1,
        z: 1
    }); // Adjust the scale as needed

    // Add the half-ring to the scene
    const root = document.getElementById('root');
    root.appendChild(ring);
    return ring;
}

//////////////////////////
function createTwoHalfCircles(el) {
    const halfCircle1 = createHalfCircle(el, 90);
    const halfCircle2 = createHalfCircle(el, 270);

    return [halfCircle1, halfCircle2];
}

//////////////////////////
function getRightVectorOfInitialRotation(el) {
    // Assuming rotation is an object with x, y, z properties (Euler angles in degrees)
    const rotation = el.getAttribute('rotation');

    if (!rotation) {
        throw new Error('Element does not have a rotation attribute.');
    }

    // Convert rotation angles from degrees to radians
    const radX = THREE.Math.degToRad(rotation.x);
    const radY = THREE.Math.degToRad(rotation.y);
    const radZ = THREE.Math.degToRad(rotation.z);

    // Create a quaternion from the Euler angles
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(radX, radY, radZ, 'YXZ'));

    // Define the initial right vector (1, 0, 0) in local space
    const rightVector = new THREE.Vector3(1, 0, 0);

    // Apply the rotation to the right vector
    rightVector.applyQuaternion(quaternion);

    return rightVector;
}

function generateIntermediatePositions(leftPosition, rightPosition, numPositions) {
    const positions = [];
    const step = {
        x: (rightPosition.x - leftPosition.x) / (numPositions - 1),
        y: (rightPosition.y - leftPosition.y) / (numPositions - 1),
        z: (rightPosition.z - leftPosition.z) / (numPositions - 1)
    };

    for (let i = 0; i < numPositions; i++) {
        const position = {
            x: leftPosition.x + step.x * i,
            y: leftPosition.y + step.y * i,
            z: leftPosition.z + step.z * i
        };
        positions.push(position);
    }

    return positions;
}

function createPlane(el, color, position) {
    // Create a new a-plane element
    const plane = document.createElement('a-plane');

    // Set the material and geometry attributes
    plane.setAttribute('material', `color: ${color}; shader: flat; side: double; transparent: true; opacity: 1;`);
    plane.setAttribute('geometry', {
        width: bgUIsize * 2,
        height: bgUIsize * 2
    }); // Match the diameter of the outer circle

    plane.setAttribute('position', position);

    // Set the rotation of the plane to match the element's rotation
    const initialRotation = el.getAttribute('rotation');
    plane.setAttribute('rotation', `${initialRotation.x} ${initialRotation.y} ${initialRotation.z}`);

    // Add the plane to the scene
    const root = document.getElementById('root');
    root.appendChild(plane);

    return plane;
}

//////////////////////////
function animateBGUI(el, camera) {
    const [leftHalf, rightHalf] = createTwoHalfCircles(el);

    // Initial position of the right half
    const initialPosition2 = el.getAttribute('position');

    const cameraPosition = camera.getAttribute('position');

    // Calculate the direction vector from the camera to the ring
    const directionVector = {
        x: initialPosition2.x - cameraPosition.x,
        y: initialPosition2.y - cameraPosition.y,
        z: initialPosition2.z - cameraPosition.z
    };

    // Apply the offset in the correct direction for each axis
    const initialPosition = {
        x: initialPosition2.x - (0.01 * directionVector.x),
        y: initialPosition2.y - (0.01 * directionVector.y),
        z: initialPosition2.z - (0.01 * directionVector.z)
    };

    leftHalf.setAttribute('position', initialPosition);


    const rightVector = getRightVectorOfInitialRotation(el);

    // Animation parameters
    const duration = 500; // 1 second
    const distance = 1.2; // Distance to move right

    // Calculate the target position using the right vector
    const targetPosition = {
        x: initialPosition.x + (rightVector.x * distance),
        y: initialPosition.y + (rightVector.y * distance),
        z: initialPosition.z + (rightVector.z * distance)
    };

    // Animate the right half
    rightHalf.setAttribute('animation', {
        property: 'position',
        from: `${initialPosition.x} ${initialPosition.y} ${initialPosition.z}`,
        to: `${targetPosition.x} ${targetPosition.y} ${targetPosition.z}`,
        dur: duration,
        easing: 'easeInOutQuad'
    });

    // Calculate the midpoint between leftHalf and rightHalf
    const leftPosition = initialPosition;
    const rightPosition = targetPosition; // Since rightHalf will move to targetPosition

    const midpoint = {
        x: (leftPosition.x + rightPosition.x) / 2,
        y: (leftPosition.y + rightPosition.y) / 2,
        z: (leftPosition.z + rightPosition.z) / 2
    };

    const plane = createPlane(el, '#add0cb', leftPosition);
    // Animate the plane to move with the rightHalf
    plane.setAttribute('animation', {
        property: 'position',
        from: `${leftPosition.x} ${leftPosition.y} ${leftPosition.z}`,
        to: `${(leftPosition.x + targetPosition.x) / 2} ${(leftPosition.y + targetPosition.y) / 2} ${(leftPosition.z + targetPosition.z) / 2}`,
        dur: duration,
        easing: 'easeInOutQuad'
    });
    // Animate the width of the plane from 0 to 0.4
    plane.setAttribute('animation__width', {
        property: 'geometry.width',
        from: 0,
        to: distance, // Final width value
        dur: duration, // Duration of the animation in milliseconds
        easing: 'easeInOutQuad'
    });
    ////////////////////////

    const numPositions = 5;
    const positions = generateIntermediatePositions(leftPosition, rightPosition, numPositions);
    const edgeColor = '#FFFFFF';
    const innerColor = '#00FF00';
    const radius = 0.13;
    const edgeThickness = 0.008;
    const imageUrl = 'x-png-35400.png'; // Provide the URL of the image


    positions.forEach((position, index) => {
        setTimeout(() => {
            const useImage = index === positions.length - 1; // Use image for the last index
            const {
                ring,
                innerCircle
            } = createCircleWithEdge(el, position, colors[index].edgeColor, colors[index].value, colors[index].name, radius, edgeThickness, camera, useImage, imageUrl);

            if (useImage) {
                // Hide the ring by setting its scale to 0
                ring.setAttribute('opacity', '0');
            }


            // Your existing animation logic here
        }, index * duration / 5); // 500ms delay between each circle creation
    });



}



function createCircleWithEdge(el, position, edgeColor, innerColor, ringId, radius, edgeThickness, camera, useImage = false, imageUrl = '') {
    // Create a ring element for the edge
    const ring = document.createElement('a-ring');

    // Set the material attributes for the edge
    ring.setAttribute('material', `color: ${edgeColor}; shader: flat; side: double; transparent: true; opacity: 1;`);

    // Set the geometry attributes for the edge with the specified radius, edge thickness, and segments
    ring.setAttribute('geometry', {
        radiusInner: radius - edgeThickness,
        radiusOuter: radius,
        segmentsTheta: 38
    });

    // Set the position of the ring to match the element's position
    const initialPosition = position;

    const cameraPosition = camera.getAttribute('position');

    // Calculate the direction vector from the camera to the ring
    const directionVector = {
        x: initialPosition.x - cameraPosition.x,
        y: initialPosition.y - cameraPosition.y,
        z: initialPosition.z - cameraPosition.z
    };

    // Apply the offset in the correct direction for each axis

    // Set the rotation of the ring to match the element's rotation
    const initialRotation = el.getAttribute('rotation');

    // Set the initial scale of the ring to 0
    ring.setAttribute('scale', {
        x: 1,
        y: 1,
        z: 1
    });

    // Create a circle element for the inner circle
    const innerCircle = document.createElement('a-circle');

    // Set the material attributes for the inner circle based on the useImage flag
    if (useImage && imageUrl) {
        innerCircle.setAttribute('material', `src: url(${imageUrl}); shader: flat; side: double; transparent: true; opacity: 1;`);
    } else {
        innerCircle.setAttribute('material', `color: ${innerColor}; shader: flat; side: double; transparent: true; opacity: 1;`);
    }

    // Set the geometry attributes for the inner circle with the specified radius and segments
    innerCircle.setAttribute('geometry', {
        radius: radius - edgeThickness + 0.001,
        segmentsTheta: 28
    });

    // Set the position of the inner circle to match the element's position
    innerCircle.setAttribute('position', {
        x: initialPosition.x - (0.005 * directionVector.x),
        y: initialPosition.y - (0.005 * directionVector.y),
        z: initialPosition.z - (0.005 * directionVector.z)
    });

    // Set the rotation of the inner circle to match the element's rotation
    innerCircle.setAttribute('rotation', `${initialRotation.x} ${initialRotation.y} ${initialRotation.z}`);

    // Set the initial scale of the inner circle to 0
    innerCircle.setAttribute('scale', {
        x: 0,
        y: 0,
        z: 0
    });
    innerCircle.setAttribute('id', `${ringId}`); // Add the id attribute here
    innerCircle.setAttribute('config-listener', '');

    // Add the ring and inner circle to the scene
    innerCircle.appendChild(ring);
    const root = document.getElementById('root');

    root.appendChild(innerCircle);


    // Animate the scale of the inner circle from 0 to 1
    innerCircle.setAttribute('animation', {
        property: 'scale',
        to: '1 1 1',
        dur: 500, // Duration of the animation in milliseconds
        easing: 'easeInOutQuad'
    });

    return {
        ring,
        innerCircle
    };
}