// src/components/masks/AllMasks.tsx

import React from 'react';
import type { Mask } from '../../../../../lib/imageProcesor';

interface AllMasksProps {
    masks: Mask[];
    imageIndex: number;
    setImageIndex: (index: number) => void;
}

function AllMasks({ masks, imageIndex, setImageIndex }: AllMasksProps): React.JSX.Element {
    return (
        <div
            id="all-masks"
            className="w-full flex justify-center items-end gap-[5px] p-[15px] absolute bottom-0 left-0 z-2"
        >
            {masks.map((mask, index) => (
                <button
                    key={index}
                    aria-label={`Select mask ${index + 1}`}
                    onClick={() => setImageIndex(index)}
                    className={`h-[5vh] w-[5vh] p-0 border border-[#272729] rounded-md overflow-hidden cursor-pointer transition-transform duration-200 ease-in-out ${imageIndex === index ? 'scale-105' : ''
                        }`}
                >
                    <img
                        src={mask.white}
                        alt={`Mask ${index + 1}`}
                        className="h-full w-full object-cover opacity-70"
                    />
                </button>
            ))}
        </div>
    );
}

export default AllMasks;