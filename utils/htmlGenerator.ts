import { SliderConfig } from '../types';

export const generateStandaloneHtml = (
  beforeImage: string,
  afterImage: string,
  config: SliderConfig
): string => {
  const isVertical = config.orientation === 'vertical';
  
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Avant/Après Comparison</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        /* Body centers the content but allows it to fit naturally */
        body { 
            width: 100%; 
            min-height: 100vh; 
            margin: 0; 
            display: flex; 
            justify-content: center; 
            align-items: flex-start; /* Align top so it doesn't jump */
            background: transparent; 
            overflow: hidden; /* Hide scrollbars if possible */
        }
        
        .container {
            position: relative;
            display: inline-block; /* Shrink to wrap image */
            max-width: 100%;
            line-height: 0; /* Remove bottom whitespace for inline-block */
            user-select: none;
            -webkit-user-select: none;
        }

        /* The Base Image (After) sets the dimensions */
        .img-base {
            display: block;
            max-width: 100%;
            height: auto;
            max-height: 100vh; /* Ensure it fits in viewport */
            object-fit: contain;
        }

        /* The Overlay Image (Before) sits on top */
        .img-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover; /* Match the base image */
            /* Clip path will be set by JS */
        }

        /* The Draggable Handle */
        .handle {
            position: absolute;
            z-index: 3;
            background-color: ${config.sliderColor};
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: ${isVertical ? 'ns-resize' : 'ew-resize'};
            pointer-events: none; /* Let container capture events */
        }

        /* Handle styling */
        ${isVertical 
            ? `
            .handle {
                left: 0;
                width: 100%;
                height: 4px;
                transform: translateY(-50%);
            }
            .handle-icon {
                width: 40px;
                height: 24px;
                background: ${config.sliderColor};
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            ` 
            : `
            .handle {
                top: 0;
                width: 4px;
                height: 100%;
                transform: translateX(-50%);
            }
            .handle-icon {
                width: 24px;
                height: 40px;
                background: ${config.sliderColor};
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            `
        }

        /* Labels */
        .label {
            position: absolute;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: sans-serif;
            font-size: 12px;
            pointer-events: none;
            z-index: 4;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        /* Hover effect only on desktop usually */
        @media (hover: hover) {
           .label { opacity: 0; }
           .container:hover .label { opacity: 1; }
        }

        .label-before { ${isVertical ? 'top: 10px; left: 10px;' : 'top: 10px; left: 10px;'} }
        .label-after { ${isVertical ? 'bottom: 10px; left: 10px;' : 'top: 10px; right: 10px;'} }

    </style>
</head>
<body>

<div class="container" id="container">
    <!-- After Image (Base) -->
    <img src="${afterImage}" class="img-base" alt="After" draggable="false" />
    
    <!-- Before Image (Overlay) -->
    <img src="${beforeImage}" id="overlay-image" class="img-overlay" alt="Before" draggable="false" />
    
    <div class="handle" id="handle">
        <div class="handle-icon">
            ${isVertical 
              ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6 6-6-6"/><path d="m6 9 6-6 6 6"/></svg>'
              : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg><svg style="transform: rotate(180deg); margin-left: -8px;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
            }
        </div>
    </div>

    ${config.beforeLabel ? `<div class="label label-before">${config.beforeLabel}</div>` : ''}
    ${config.afterLabel ? `<div class="label label-after">${config.afterLabel}</div>` : ''}
</div>

<script>
    const container = document.getElementById('container');
    const overlayImage = document.getElementById('overlay-image');
    const handle = document.getElementById('handle');
    let isDragging = false;
    const isVertical = ${isVertical};

    function updateSlider(pos) {
        // Clamp position between 0 and 100
        const percentage = Math.max(0, Math.min(100, pos));
        
        if (isVertical) {
            // Clip bottom: inset(top right bottom left)
            overlayImage.style.clipPath = \`inset(0 0 \${100 - percentage}% 0)\`;
            handle.style.top = percentage + '%';
        } else {
            // Clip right
            overlayImage.style.clipPath = \`inset(0 \${100 - percentage}% 0 0)\`;
            handle.style.left = percentage + '%';
        }
    }

    function handleMove(e) {
        if (!isDragging) return;
        
        const rect = container.getBoundingClientRect();
        let pos;
        
        // Support touch and mouse events
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        if (isVertical) {
            pos = ((clientY - rect.top) / rect.height) * 100;
        } else {
            pos = ((clientX - rect.left) / rect.width) * 100;
        }
        
        updateSlider(pos);
    }

    function startDrag(e) {
        isDragging = true;
        handleMove(e); // Update immediately on click
        e.preventDefault();
    }

    function stopDrag() {
        isDragging = false;
    }

    // Initialize position
    updateSlider(${config.initialPosition});

    // Event Listeners
    container.addEventListener('mousedown', startDrag);
    container.addEventListener('touchstart', startDrag, { passive: false });

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });

    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
</script>

</body>
</html>`;
};