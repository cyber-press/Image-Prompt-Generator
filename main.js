// public/main.js

import { generatePrompt, getCurrentFormValues, setFormValues } from '../js/promptGenerator.js';
import { getSavedPrompts, addPrompt, deletePrompt } from '../js/storage.js';
import { debounce, fetchImages } from '../js/imageService.js';
import { handleLockClick, randomizePrompt, clearForm } from '../js/uiState.js';
import { generatePromptVariants } from '../js/promptVariants.js';

document.addEventListener('DOMContentLoaded', () => {
    const allInputs = document.querySelectorAll('input, select');
    const finalPromptTextarea = document.getElementById('final-prompt');
    const subjectInput = document.getElementById('subject');
    const imageBoard = document.getElementById('image-board');
    const styleSlider = document.getElementById('style-strength');
    const styleValueDisplay = document.getElementById('style-value');
    const copyButton = document.getElementById('copy-button');
    const randomizeButton = document.getElementById('randomize-button');
    const clearButton = document.getElementById('clear-button');
    const saveButton = document.getElementById('save-button');
    const savedPromptsList = document.getElementById('saved-prompts-list');
    const formGrid = document.querySelector('.form-grid');
    const variantsButton = document.getElementById('variants-button');
    const variantsList = document.getElementById('variants-list');

    const debouncedFetch = debounce((keyword) => fetchImages(keyword, imageBoard));
    const generatePromptWrapper = () => generatePrompt(finalPromptTextarea);

    const renderSavedPrompts = () => {
        const prompts = getSavedPrompts();
        savedPromptsList.innerHTML = '';

        if (prompts.length === 0) {
            savedPromptsList.innerHTML =
                `<li class="saved-item-placeholder">No saved prompts yet.</li>`;
            return;
        }

        prompts.forEach((promptData, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'saved-item';
            listItem.innerHTML = `
                <p>${promptData.fullPrompt}</p>
                <div class="saved-item-actions">
                    <button title="Load Prompt" data-index="${index}" class="load-btn">⬆️</button>
                    <button title="Delete Prompt" data-index="${index}" class="delete-btn">❌</button>
                </div>
            `;
            savedPromptsList.appendChild(listItem);
        });
    };

    const handleSavePrompt = () => {
        const fullPrompt = generatePromptWrapper();
        if (!fullPrompt || fullPrompt.startsWith('Your generated prompt')) return;

        const promptData = getCurrentFormValues();
        promptData.fullPrompt = fullPrompt;

        addPrompt(promptData);
        renderSavedPrompts();
    };

    const handleLoadPrompt = (index) => {
        const prompts = getSavedPrompts();
        if (prompts[index]) {
            setFormValues(
                prompts[index],
                styleValueDisplay,
                generatePromptWrapper,
                debouncedFetch
            );
        }
    };

    const handleDeletePrompt = (index) => {
        deletePrompt(index);
        renderSavedPrompts();
    };

    const renderVariants = () => {
        const variants = generatePromptVariants();
        variantsList.innerHTML = '';

        if (variants.length === 0) {
            variantsList.innerHTML =
                `<li class="saved-item-placeholder">No variants generated.</li>`;
            return;
        }

        variants.forEach(v => {
            const li = document.createElement('li');
            li.className = 'saved-item';
            li.innerHTML = `
                <p><strong>${v.label}:</strong> ${v.prompt}</p>
                <div class="saved-item-actions">
                    <button class="copy-variant" title="Copy Variant">📋</button>
                </div>
            `;
            variantsList.appendChild(li);

            li.querySelector('.copy-variant').addEventListener('click', () => {
                navigator.clipboard.writeText(v.prompt);
            });
        });
    };

    // Event listeners
    allInputs.forEach(input => input.addEventListener('input', generatePromptWrapper));
    subjectInput.addEventListener('input', () => debouncedFetch(subjectInput.value));
    styleSlider.addEventListener('input', (e) => (styleValueDisplay.textContent = e.target.value));
    formGrid.addEventListener('click', handleLockClick);

    savedPromptsList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const index = parseInt(target.dataset.index, 10);
        if (target.classList.contains('load-btn')) handleLoadPrompt(index);
        if (target.classList.contains('delete-btn')) handleDeletePrompt(index);
    });

    saveButton.addEventListener('click', handleSavePrompt);
    randomizeButton.addEventListener('click', () =>
        randomizePrompt(allInputs, formGrid, styleSlider, styleValueDisplay, generatePromptWrapper, debouncedFetch, subjectInput)
    );
    clearButton.addEventListener('click', () =>
        clearForm(allInputs, styleValueDisplay, generatePromptWrapper, debouncedFetch)
    );
    copyButton.addEventListener('click', () => {
        const buttonText = copyButton.querySelector('.button-text');
        if (finalPromptTextarea.value && finalPromptTextarea.value !== "Your generated prompt will appear here.") {
            navigator.clipboard.writeText(finalPromptTextarea.value).then(() => {
                buttonText.textContent = 'Copied! ✅';
                copyButton.style.background = 'rgba(76, 175, 80, 0.3)';
                setTimeout(() => {
                    buttonText.textContent = 'Copy Prompt';
                    copyButton.style.background = '';
                }, 2000);
            });
        }
    });
    variantsButton.addEventListener('click', renderVariants);

    // Initial calls
    generatePromptWrapper();
    renderSavedPrompts();
    fetchImages(subjectInput.value, imageBoard);
});
