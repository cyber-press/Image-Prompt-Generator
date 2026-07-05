// js/promptGenerator.js

export const getCurrentFormValues = () => ({
    subject: document.getElementById('subject').value,
    action: document.getElementById('action').value,
    outputPurpose: document.getElementById('output-purpose').value,
    lighting: document.getElementById('lighting').value,
    camera: document.getElementById('camera').value,
    rendering: document.getElementById('rendering').value,
    aspectRatio: document.getElementById('aspect-ratio').value,
    negativePrompt: document.getElementById('negative-prompt').value,
    styleStrength: document.getElementById('style-strength').value
});

export const setFormValues = (data, styleValueDisplay, generatePrompt, debouncedFetch) => {
    Object.keys(data).forEach(key => {
        const elementId = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        const element = document.getElementById(elementId);
        if (element) {
            element.value = data[key];
        }
    });

    if (data.styleStrength && styleValueDisplay) {
        styleValueDisplay.textContent = data.styleStrength;
    }

    generatePrompt();
    if (debouncedFetch && data.subject) {
        debouncedFetch(data.subject);
    }
};

export const generatePrompt = (finalPromptTextarea) => {
    const promptData = getCurrentFormValues();

    if (!promptData.subject) {
        finalPromptTextarea.value = "Your generated prompt will appear here.";
        return null;
    }

    let prompt = `a high-resolution photo of ${promptData.subject}`;
    if (promptData.action) prompt += `, ${promptData.action}`;
    prompt += `, ${promptData.rendering}, created for a ${promptData.outputPurpose}, ${promptData.lighting}, ${promptData.camera}.`;
    prompt += ` --ar ${promptData.aspectRatio} --s ${promptData.styleStrength}`;
    if (promptData.negativePrompt) prompt += ` --no ${promptData.negativePrompt}`;

    finalPromptTextarea.value = prompt;
    return prompt;
};
