// js/storage.js

const STORAGE_KEY = 'advancedPrompts';

export const getSavedPrompts = () =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

export const savePrompts = (prompts) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));

export const addPrompt = (promptData) => {
    const prompts = getSavedPrompts();

    if (prompts.some(p => p.fullPrompt === promptData.fullPrompt)) {
        console.warn("Save aborted: This exact prompt is already saved.");
        return prompts;
    }

    prompts.unshift(promptData);
    savePrompts(prompts);
    return prompts;
};

export const deletePrompt = (index) => {
    const prompts = getSavedPrompts();
    prompts.splice(index, 1);
    savePrompts(prompts);
    return prompts;
};
