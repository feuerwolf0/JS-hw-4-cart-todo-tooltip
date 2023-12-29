const aElements = document.querySelectorAll('.has-tooltip');

const tooltip = document.createElement('div');
tooltip.setAttribute('class', 'tooltip');
tooltip.classList.add('tooltip_active');

// Установка положения всплывающей подсказки. Варианты: top, left, right, bottom
tooltip.setAttribute('data-position', 'bottom');


function setPositionTooltip(pos, position) {
    const tooltipPosition = tooltip.getBoundingClientRect();
    if (pos === 'top') {
        let top = position.top - tooltipPosition.height;
        let left = position.left;
        // Если элемент не помещается - отображать снизу
        if ((top < 0) || (position.right + 20 + tooltipPosition.width > window.innerWidth)) {
            setPositionTooltip('bottom', position);
        } else {
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }
        
    } else if (pos === 'bottom') {
        let top = position.bottom;
        let left = position.left;
        // Если элемент не помещается - отображать сверху
        if (top > window.innerHeight) {
            setPositionTooltip('top', position);
        } else {
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }
       
    } else if (pos === 'left') {
        let top = position.top-5;
        let left = position.left-tooltipPosition.width;
        // Если элемент не помещается - отображать справа
        if (left < 0) {
            setPositionTooltip('right', position);
        } else {
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }
        
    } else {
        let left = position.right;
        let top = position.top-5;
        // Если справа + скроллбар 15px не хватает места - отображать слева
        if (left + 20 + tooltipPosition.width > window.innerWidth) {
            setPositionTooltip('left', position);
        } else {
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        };
    };
};


let lastTarget = null;

aElements.forEach((elem) => {
    elem.addEventListener('click', (e) => {
        e.preventDefault();

        const title = elem.getAttribute('title');
        const position = elem.getBoundingClientRect();
        const currentTarget = e.target;

        tooltip.textContent = title;

        const dataPosition = tooltip.getAttribute('data-position');

        // Если это второй клик подряд по этому элементу - убрать подсказку
        if (lastTarget === currentTarget) {
            tooltip.classList.remove('tooltip_active');
            lastTarget = null;
        } else {
            tooltip.classList.add('tooltip_active');
            elem.insertAdjacentElement('afterend', tooltip);
            setPositionTooltip(dataPosition, position);
            
            lastTarget = currentTarget;
            
        };
    });
});