// src/components/masks/Preview.tsx

import React from 'react';
import type { Mask } from '../../../../../lib/imageProcesor';

interface PreviewProps {
    masks: Mask[];
    activeLayer: number;
    imageIndex: number;
}

function Preview({ masks, activeLayer, imageIndex }: PreviewProps): React.JSX.Element {
    const getCurrentImage = () => {
        if (masks.length === 0) return null;
        const currentMask = masks[imageIndex];

        switch (activeLayer) {
            case 1:
                return { src: currentMask.blue, alt: 'Blue Mask' };
            case 2:
                return { src: currentMask.red, alt: 'Red Mask' };
            case 0:
            default:
                return { src: currentMask.white, alt: 'White Mask' };
        }
    };

    const currentImage = getCurrentImage();

    return (
        <div className="h-[88%] aspect-video flex justify-center items-center overflow-hidden rounded-lg">
            {currentImage ? (
                <div className="w-full h-full border border-[#272729] overflow-hidden rounded-lg">
                    <img id="preview" src={currentImage.src} alt={currentImage.alt} className="w-full h-full object-cover" />
                </div>
            ) : (
                <h1 className="text-center font-sans font-medium text-2xl text-[#272729]">Upload mask first!</h1>
            )}
        </div>
    );
}

export default Preview;