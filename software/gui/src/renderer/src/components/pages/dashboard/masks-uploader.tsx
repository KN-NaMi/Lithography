// src/components/masks/MaskUploader.tsx

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { processImage } from '../../../../../lib/imageProcesor';
import type { Mask } from '../../../../../lib/imageProcesor';

interface MaskUploaderProps {
    onMasksAdded: (newMasks: Mask[]) => void;
}

function MaskUploader({ onMasksAdded }: MaskUploaderProps): React.JSX.Element {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = (): void => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const selectedFiles = Array.from(event.target.files || []);

        if (selectedFiles.length > 0) {
            const recentlyAddedMasks = await Promise.all(
                selectedFiles.map(async (file) => {
                    const wbImageURL = URL.createObjectURL(file);
                    const blueImageURL = await processImage(file, 1);
                    const redImageURL = await processImage(file, 2);

                    return {
                        white: wbImageURL,
                        blue: blueImageURL,
                        red: redImageURL,
                    };
                }),
            );
            onMasksAdded(recentlyAddedMasks);
        }
    };

    return (
        <>
            <button onClick={triggerFileInput} className="flex cursor-pointer border-none bg-transparent">
                <Upload color="#272729" />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/svg+xml"
                className="hidden"
                multiple
            />
        </>
    );
}

export default MaskUploader;