// js/uiState.js

export const handleLockClick = (e) => {
    const button = e.target.closest('.lock-btn');
    if (!button) return;

    const isLocked = button.classList.toggle('locked');
    button.title = isLocked ? 'Unlock field' : 'Lock field';
};

export const randomData = {
    subjects: [
        "a majestic lion with a cosmic mane",
        "a cyberpunk city at midnight",
        "an enchanted forest library",
        "a retro robot barista",
        "a forgotten temple on a jungle planet",
        "a bio-luminescent jellyfish in a nebula",
        "a steampunk clockwork dragon",
        "a lone samurai under a blood moon"
    ],
    actions: [
        "gazing at a binary sunset",
        "serving a glowing coffee",
        "reading a glowing book",
        "navigating asteroid fields",
        "standing stoically in the rain",
        "emerging from a swirling portal",
        "overlooking a neon metropolis"
    ]
};

export const randomizePrompt = (allInputs, formGrid, styleSlider, styleValueDisplay, generatePromptFn, debouncedFetch, subjectInput) => {
    allInputs.forEach(input => {
        const lockBtn = formGrid.querySelector(`.lock-btn[data-field-id="${input.id}"]`);
        if (lockBtn && lockBtn.classList.contains('locked')) return;

        if (input.tagName === 'SELECT') {
            input.selectedIndex = Math.floor(Math.random() * input.options.length);
        } else if (input.type === 'range') {
            input.value = Math.floor(Math.random() * 251) + 50;
        } else if (input.id === 'subject' || input.id === 'action') {
            const key = input.id + 's';
            input.value = randomData[key][Math.floor(Math.random() * randomData[key].length)];
        } else {
            input.value = '';
        }
    });

    styleValueDisplay.textContent = styleSlider.value;
    generatePromptFn();
    debouncedFetch(subjectInput.value);
};

export const clearForm = (allInputs, styleValueDisplay, generatePromptFn, debouncedFetch) => {
    allInputs.forEach(input => {
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        } else if (input.type === 'range') {
            input.value = 100;
        } else {
            input.value = '';
        }
    });

    styleValueDisplay.textContent = '100';
    generatePromptFn();
    debouncedFetch('');
};
