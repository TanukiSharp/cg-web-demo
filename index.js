import { RenderManager } from './lib/renderManager.js';
import { Step0 } from './renderers/step0.js';
import { Step1 } from './renderers/step1.js';
import { Step2 } from './renderers/step2.js';
import { Step3 } from './renderers/step3.js';
import { Step4 } from './renderers/step4.js';
import { Step5 } from './renderers/step5.js';
import { Step6 } from './renderers/step6.js';
import { Step7 } from './renderers/step7.js';
import { Step8 } from './renderers/step8.js';

const availableRenderers = [
    new Step0(),
    new Step1(),
    new Step2(),
    new Step3(),
    new Step4(),
    new Step5(),
    new Step6(),
    new Step7(),
    new Step8(),
];

// ====================================================================================================================

const setupRendererSelector = function (renderManager) {
    const selectElement = document.querySelector('.root-container > .side-bar > .renderer-selector-container > select');

    const rendererMessage = document.querySelector('.root-container > .side-bar > .renderer-message');

    for (const renderer of availableRenderers) {
        const optionElement = document.createElement('option');

        optionElement.text = renderer.name;
        optionElement.title = renderer.message;

        selectElement.appendChild(optionElement);
    }

    const onChange = () => {
        const selectedRenderer = availableRenderers[selectElement.selectedIndex];

        rendererMessage.innerHTML = selectedRenderer.message;
        renderManager.setRenderer(selectedRenderer);
    };

    selectElement.addEventListener('change', onChange);

    onChange();
};

// ====================================================================================================================

const main = function() {
    const canvas = document.querySelector('.root-container > .render');
    const rendererPropertiesContainer = document.querySelector('.root-container > .side-bar > .renderer-properties-scroller');

    const renderManager = new RenderManager(canvas, rendererPropertiesContainer);
    setupRendererSelector(renderManager);
};

window.addEventListener('load', main);
