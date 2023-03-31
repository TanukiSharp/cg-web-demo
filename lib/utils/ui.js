export class Subscriptions {
    constructor() {
        this._subscriptions = [];
    }

    add(f) {
        if (typeof f === 'function') {
            this._subscriptions.push(f);
        }
    }

    dispose() {
        for (const f of this._subscriptions) {
            f();
        }
        this._subscriptions = [];
    }
}

export class UiUtils {
    static prop(subscriptions, key, elementInfo, title) {
        const container = document.createElement('div');
        container.classList.add('renderer-property');

        if (title) {
            container.setAttribute('title', title);
        }

        const keyElement = document.createElement('span');
        keyElement.innerText = key;
        keyElement.classList.add('property-key');

        container.appendChild(keyElement);
        container.appendChild(elementInfo.element);
        elementInfo.element.classList.add('property-value')

        if (typeof elementInfo.reset === 'function') {
            const onClick = () => elementInfo.reset();

            const resetButton = document.createElement('button');
            resetButton.classList.add('reset');
            resetButton.innerText = 'R';
            resetButton.title = 'Reset';
            resetButton.addEventListener('click', onClick);

            subscriptions.add(() => resetButton.removeEventListener('click', onClick));

            container.appendChild(resetButton);
        }

        return container;
    }

    static separator() {
        const element = document.createElement('div');
        element.classList.add('separator');
        return element;
    }

    static createBoundCheckbox(subscriptions, getter, setter) {
        const initialValue = getter();

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = getter();

        const onInput = () => setter(Boolean(checkbox.checked));

        checkbox.addEventListener('input', onInput);

        subscriptions.add(() => checkbox.removeEventListener('input', onInput));

        return {
            element: checkbox,
            reset: () => { checkbox.checked = initialValue; onInput(); },
        };
    }

    static createBoundSlider(subscriptions, min, max, step, getter, setter) {
        const initialValue = getter();

        const container = document.createElement('div');
        container.classList.add('property-value-slider-container');

        const valueIndicator = document.createElement('span');
        valueIndicator.classList.add('value-indicator');

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = getter();

        const onInput = () => {
            setter(Number(slider.value));
            valueIndicator.innerText = slider.value;
        };

        slider.addEventListener('input', onInput);

        valueIndicator.innerText = slider.value;

        container.appendChild(slider);
        container.appendChild(valueIndicator);

        subscriptions.add(() => slider.removeEventListener('input', onInput));

        return {
            element: container,
            reset: () => { slider.value = initialValue; onInput(); },
        };
    }

    static createBoundSpan(getUpdateFunc) {
        const span = document.createElement('span');

        const updateFunc = (txt) => span.innerText = txt;

        getUpdateFunc(updateFunc);

        return {
            element: span,
        };
    }
}
