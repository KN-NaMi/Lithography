// src/components/masks/MasksSection.tsx

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import AllMasks from './masks-all';
import Preview from './masks-preview';
import Layers from './masks-layers';
import MaskUploader from './masks-uploader';

import type { Mask } from '../../../../../lib/imageProcesor';

function MasksCard(): React.JSX.Element {
    const [masks, setMasks] = useState<Mask[]>([]);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [activeLayer, setActiveLayer] = useState<number>(0);

    const nextImage = (): void => {
        if (masks.length > 0) {
            setImageIndex((prevIndex) => (prevIndex === masks.length - 1 ? 0 : prevIndex + 1));
        }
    };

    const previousImage = (): void => {
        if (masks.length > 0) {
            setImageIndex((prevIndex) => (prevIndex === 0 ? masks.length - 1 : prevIndex - 1));
        }
    };

    const handleMasksAdded = (newMasks: Mask[]): void => {
        setMasks((prevMasks) => [...prevMasks, ...newMasks]);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            {/* Umieszczam Uploader na górze dla przejrzystości */}
            <div className="absolute top-4 right-4 z-20">
                <MaskUploader onMasksAdded={handleMasksAdded} />
            </div>

            <div className="w-full h-full flex items-center justify-center">
                <div className="ml-2 flex flex-col space-y-1">
                    <Layers activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
                </div>
                <div className="w-full h-full flex items-center justify-center mr-6">
                    <button className="mr-2" onClick={previousImage} disabled={masks.length === 0}>
                        <ChevronLeft color="#272729" />
                    </button>
                    <Preview masks={masks} activeLayer={activeLayer} imageIndex={imageIndex} />
                    <button className="ml-2" onClick={nextImage} disabled={masks.length === 0}>
                        <ChevronRight color="#272729" />
                    </button>
                </div>
            </div>

            <AllMasks masks={masks} imageIndex={imageIndex} setImageIndex={setImageIndex} />
        </div>
    );
}

export default MasksCard;