export type Mask = {
    white: string;
    blue: string;
    red: string;
};

export async function processImage(file: File, color: number): Promise<string> {
    // Input validation
    if (!(file instanceof File)) {
        throw new Error('Invalid file parameter: File object required');
    }
    if (![1, 2].includes(color)) {
        throw new Error('Invalid color parameter: must be 1 (blue) or 2 (red)');
    }

    // Check if file is SVG
    if (file.type !== 'image/svg+xml') {
        throw new Error('Invalid file type: SVG required');
    }

    // Reasonable file size limit (2MB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File too large: Maximum size is 2MB');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            if (!event.target || typeof event.target.result !== 'string') {
                reject(new Error('Failed to read SVG file'));
                return;
            }

            const svgContent = event.target.result;

            try {
                // Parse SVG content into DOM
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');

                // Check for parsing errors
                const parserError = svgDoc.querySelector('parsererror');
                if (parserError) {
                    reject(new Error('Invalid SVG format'));
                    return;
                }

                // Find elements with white-ish fill or stroke
                const svgElements = svgDoc.querySelectorAll('*');
                const colorValue = color === 1 ? 'rgb(0, 0, 255)' : 'rgb(255, 0, 0)'; // Blue or Red

                svgElements.forEach(el => {
                    // Process fill attribute
                    if (el.hasAttribute('fill')) {
                        const fill = el.getAttribute('fill');
                        if (isWhitish(fill)) {
                            el.setAttribute('fill', colorValue);
                        }
                    }

                    // Process stroke attribute
                    if (el.hasAttribute('stroke')) {
                        const stroke = el.getAttribute('stroke');
                        if (isWhitish(stroke)) {
                            el.setAttribute('stroke', colorValue);
                        }
                    }

                    // Process style attribute
                    if (el.hasAttribute('style')) {
                        const style = el.getAttribute('style') || '';
                        const newStyle = processStyle(style, colorValue);
                        if (newStyle !== style) {
                            el.setAttribute('style', newStyle);
                        }
                    }
                });

                // Convert back to string
                const serializer = new XMLSerializer();
                const modifiedSvgContent = serializer.serializeToString(svgDoc);

                // Create a blob URL for the modified SVG
                const blob = new Blob([modifiedSvgContent], { type: 'image/svg+xml' });
                const modifiedUrl = URL.createObjectURL(blob);

                resolve(modifiedUrl);
            } catch (error) {
                reject(new Error(`Error processing SVG: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading SVG file'));
        };

        reader.readAsText(file);
    });
}

// Helper function to check if a color value is whitish
function isWhitish(colorValue: string | null): boolean {
    if (!colorValue) return false;

    // Check for white, #fff, #ffffff, rgb(255,255,255), etc.
    colorValue = colorValue.toLowerCase().trim();

    if (colorValue === 'white' || colorValue === '#fff' || colorValue === '#ffffff') {
        return true;
    }

    // Check RGB format
    const rgbMatch = colorValue.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        return r > 200 && g > 200 && b > 200;
    }

    // Check hex format (more detailed check)
    if (colorValue.startsWith('#') && (colorValue.length === 4 || colorValue.length === 7)) {
        let r, g, b;

        if (colorValue.length === 4) {
            // Short hex format (#RGB)
            r = parseInt(colorValue[1] + colorValue[1], 16);
            g = parseInt(colorValue[2] + colorValue[2], 16);
            b = parseInt(colorValue[3] + colorValue[3], 16);
        } else {
            // Full hex format (#RRGGBB)
            r = parseInt(colorValue.slice(1, 3), 16);
            g = parseInt(colorValue.slice(3, 5), 16);
            b = parseInt(colorValue.slice(5, 7), 16);
        }

        return r > 200 && g > 200 && b > 200;
    }

    return false;
}

// Helper function to process style attributes
function processStyle(style: string, colorValue: string): string {
    // Replace fill and stroke properties if they have whitish values
    return style.replace(/(fill|stroke):\s*([^;]+)/gi, (match, property, value) => {
        if (isWhitish(value)) {
            return `${property}: ${colorValue}`;
        }
        return match;
    });
}