import { useState, useEffect } from "react";
import { getImageUrl, type Images } from "./enum/images";
import type { PreloadedImages } from "./types/commonTypes";

export function useImagePreloader(imageSources: Map<Images, string>) {
    const [images, setImages] = useState<PreloadedImages>(new Map());
    const [isReady, setIsReady] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: PreloadedImages = new Map();

        const loadPromises = Array.from(imageSources.entries()).map(([key]) => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                const src = getImageUrl(key) || '';
                img.src = src;

                img.onload = () => {
                    loadedCount++;
                    setProgress(Math.round((loadedCount / imageSources.size) * 100));
                    loadedImages.set(key, img); // Store in the exact order they were requested
                    resolve(img);
                };
                
                img.onerror = () => {
                    console.error(`Failed to load image at: ${src}`);
                    reject(new Error(`Failed to load image: ${src}`));
                };
            });
        });

        Promise.all(loadPromises)
            .then(() => {
                setImages(loadedImages);
                setIsReady(true);
            })
            .catch((err) => console.error("Error preloading assets:", err));

    }, [imageSources]);

    return { isReady, images, progress };
}