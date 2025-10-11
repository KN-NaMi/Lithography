// src/components/masks/Layers.tsx

import React from 'react';

interface LayersProps {
    activeLayer: number; // Można użyć do stylizacji aktywnego przycisku
    setActiveLayer: (layerIndex: number) => void;
}

function Layers({ setActiveLayer }: LayersProps): React.JSX.Element {
    return (
        <>
            <button
                className="w-5 h-5 border border-[#272729] opacity-90 cursor-pointer z-[11] rounded-lg bg-[#d83939]"
                onClick={() => setActiveLayer(2)}
                aria-label="Red layer"
            ></button>
            <button
                className="w-5 h-5 border border-[#272729] opacity-90 cursor-pointer z-[11] rounded-lg bg-[#3983d8]"
                onClick={() => setActiveLayer(1)}
                aria-label="Blue layer"
            ></button>
            <button
                className="w-5 h-5 border border-[#272729] opacity-90 cursor-pointer z-[11] rounded-lg bg-white relative"
                onClick={() => setActiveLayer(0)}
                aria-label="Black and white layer"
            >
                <div className="bg-[#1a1a1a] w-[10px] h-full rounded-l-md absolute left-0 top-0"></div>
            </button>
        </>
    );
}

export default Layers;