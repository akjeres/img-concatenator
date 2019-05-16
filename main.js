'use strict';
(function(){
   window.addEventListener('load', function(e) {
        let c1 = new Concatenator({
            target:document.getElementById('root'),
        });
        c1.render();
   })
})();

function Concatenator(options) {
    let defaults = {
        target: document.getElementsByTagName('body')[0],
        emptyLabelValue: 'No image selected',
        width: '800px',
        button: 'Add field',
        verticalMode: false,
        statusBar: true,
    };
    let opts = Object.assign(Object.create(defaults), options);
    let _button = document.createElement('button');
    let _form =  document.createElement('form');
    let _canvas = document.createElement('div'); //change to "canvas"
    let _concatenator = createConcatenator();
    _concatenator.style.width = (parseInt(opts.width) + 6) + 'px';
    let _target = opts.target;
    let self = this;
    function createConcatenator() {
        let elem = document.createElement('div');
        elem.setAttribute('class', 'concatenator');
        //Canvas attributes
        _canvas.setAttribute('class', 'canvas');
        _canvas.style.width = opts.width;
        _canvas.style.height = parseInt(parseInt(opts.width) * 0.75) + 'px';
        //Management bar
        let m = createEl('div', 'management');
        let cB = createEl('input', 'checkbox');
        cB.setAttribute('type', 'checkbox');
        cB.setAttribute('name', 'verticalMode');
        cB.setAttribute('tabindex', '0');
        opts.verticalMode && cB.setAttribute('checked', opts.verticalMode);
        _button.textContent = opts.button;
        m.appendChild(cB);
        m.appendChild(_button);
        _form.appendChild(m);
        //Append fields
        addField();addField();
        //Status bar (optional)
        if (opts.statusBar) {
            let bar = createEl('div', 'status-bar');
            let btns = createEl('div', 'buttons');
            let bG = createEl('div', 'button button-green');
            let bY = createEl('div', 'button button-yellow');
            let bR = createEl('div', 'button button-red');
            btns.appendChild(bG);
            btns.appendChild(bY);
            btns.appendChild(bR);
            bar.appendChild(btns);
            elem.appendChild(bar);
        }
        elem.appendChild(_form);
        elem.appendChild(_canvas);
        return elem;
    }
    function renderConcatenator() {
        _target.appendChild(_concatenator);
    }
    function addField() {
        let label, input, span;
        label = createEl('label', 'input-label');
        label.setAttribute('tabindex', '0');
        input = createEl('input', 'input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/png,image/jpeg');
        input.setAttribute('tabindex', '-1');
        span = createEl('span', 'file-name');
        span.textContent = opts.emptyLabelValue;
        label.appendChild(input);
        label.appendChild(span);
        if (_form.elements.length > 3) { //Disable adding remove spans to two first inputs type file
            let close = createEl('span', 'remove-input');
            close.textContent = '×';
            label.appendChild(close);
        }
        _form.appendChild(label);
    }
    function getFormValues(form) {
        let elements = form.elements;
        let verticalMode = false;
        let result = [];
        let divider = '-';
        Array.prototype.map.call(elements, function(i) {
            if (i.type != 'checkbox' && validateType(i.value)) {
                result.push(i.value);
                return;
            }
            if (i.checked) divider = '<br>';
        });
        return result.join(divider);
    }
    function validateType(value) {
        return /\.(jpe?g|png|gif)$/i.test(value);
    }
    function setLabelValue(inp) {
        let value = opts.emptyLabelValue;
        if (inp && inp.value) {
            value = inp.value.replace(/^.+(\\|\/)/ig, '');
        }
        inp.nextElementSibling.textContent = value;
    }
    function renderResult() {
        _canvas.innerHTML = getFormValues(_form);
    }
    function createEl(tag_name, class_name) {
        let res = document.createElement(tag_name);
        res.setAttribute('class', class_name);
        return res;
    }
    function removeField() {
        let input = arguments[0]; //event.target
        if (_form.elements.length > 4) { //Disable removing two first inputs type file
            if (arguments && arguments.length) {
                input.tagName.toLowerCase() == 'span' && input.parentNode.remove();
            } else {
                _form.elements[_form.elements.length - 1].parentNode.remove();
            }
        }
    }
    //Event listeners
    _form.addEventListener('click', function(e) {
        let target = e.target;
        if (target) {
            if (target.classList.contains('remove-input')) {
                e.preventDefault();
                if (confirm('Remove this field.\nAre you sure?')) {
                    removeField(target.previousElementSibling);
                    self.renderResult();
                }
                return;
            }
            if (target.tagName.toLowerCase() == 'button') {
                e.preventDefault();
                self.addField();
            }
        }
    });
    _form.addEventListener('input', function(e) {
        let target = e.target;
        if (target && target.type == 'file' && validateType(target.value)) {
            if (!validateType(target.value)) target.value = '';
        }
        for (let key in this.elements) {
            if (this.elements[key]['type'] == 'file') setLabelValue(this.elements[key]);
        }
        self.renderResult();
    });
    //Public methods
    this.addField = addField;
    this.removeField = removeField;
    this.renderResult = renderResult;
    this.render = renderConcatenator;
}
