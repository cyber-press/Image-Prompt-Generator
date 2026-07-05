// js/promptVariants.js

import { getCurrentFormValues } from './promptGenerator.js';

export const generatePromptVariants = () => {
    const base = getCurrentFormValues();

    if (!base.subject) return [];

    const core = `a high-resolution photo of ${base.subject}${base.action ? `, ${base.action}` : ''}`;

    const styleBase = Number(base.styleStrength) || 0;

    return [
        {
            label: "Cinematic",
            prompt: `${core}, dramatic shadows, volumetric lighting, anamorphic depth, ${base.camera}, ${base.rendering} --ar ${base.aspectRatio} --s ${styleBase + 200}${base.negativePrompt ? ` --no ${base.negativePrompt}` : ''}`
        },
        {
            label: "Photorealistic",
            prompt: `${core}, ultra-sharp details, natural lighting, realistic textures, ${base.camera}, hyperrealistic photo --ar ${base.aspectRatio} --s ${styleBase}${base.negativePrompt ? ` --no ${base.negativePrompt}` : ''}`
        },
        {
            label: "Artistic",
            prompt: `${core}, expressive brush strokes, painterly textures, masterful oil painting style, ${base.lighting}, ${base.camera} --ar ${base.aspectRatio} --s ${styleBase + 300}${base.negativePrompt ? ` --no ${base.negativePrompt}` : ''}`
        },
        {
            label: "Minimalist",
            prompt: `${core}, clean composition, soft lighting, strong negative space, ${base.camera}, ${base.rendering} --ar ${base.aspectRatio} --s ${Math.max(50, styleBase - 150)}${base.negativePrompt ? ` --no ${base.negativePrompt}` : ''}`
        },
        {
            label: "Experimental",
            prompt: `${core}, surreal distortions, neon accents, glitch aesthetic, chaotic energy, ${base.camera}, ${base.rendering} --ar ${base.aspectRatio} --s ${styleBase + 400}${base.negativePrompt ? ` --no ${base.negativePrompt}` : ''}`
        }
    ];
};
