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
        width: 800,
        button: 'Add field',
        verticalMode: false,
        statusBar: true,
    };
    let opts = Object.assign(Object.create(defaults), options);
    let _button = document.createElement('button');
    let _form =  document.createElement('form');
    let _canvas = document.createElement('canvas');
    let _concatenator = createConcatenator();
    _concatenator.style.width = (parseInt(opts.width) + 6) + 'px';
    let _target = opts.target;
    let self = this;
    function createConcatenator() {
        let elem = document.createElement('div');
        elem.setAttribute('class', 'concatenator');
        //Canvas attributes
        _canvas.setAttribute('class', 'canvas');
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
        let canvParam = {
            w: 0,
            h: 0,
        };
        getValue(elements[0]);
        function getValue(it) {
            if (it.type != 'checkbox' && validateType(it.value)) {
                let nI = new Image();
                let file = it.files[0];
                let reader  = new FileReader();
                reader.addEventListener("load", function () {
                    nI.src = reader.result;
                    nI.onload = function() {
                        result.push({
                            nI: nI,
                            w: nI.width,
                            h: nI.height,
                        });
                        if (it.parentNode.nextElementSibling) {
                            getValue(it.parentNode.nextElementSibling.childNodes[0]);
                        }
                        for (let t = 0; t < result.length; t++) {
                            if (verticalMode) {
                                result[t]['h'] = parseInt(result[t]['h'] * (result[0]['w'] / result[t]['w']));
                                result[t]['w'] = result[0]['w'];
                                canvParam['w'] = result[0]['w'];
                                canvParam['h'] = (t > 0) ? canvParam['h'] + result[t]['h'] : result[t]['h'];
                            } else {
                                result[t]['w'] = parseInt(result[t]['w'] * (result[0]['h'] / result[t]['h']));
                                result[t]['h'] = result[0]['h'];
                                canvParam['w'] = (t > 0) ? canvParam['w'] + result[t]['w'] : result[t]['w'];
                                canvParam['h'] = result[0]['h'];
                            }
                            if (t == result.length - 1) {
                                _canvas.width = canvParam['w'];
                                _canvas.height = canvParam['h'];
                                const ctx = _canvas.getContext("2d");
                                let dx, dy;
                                for (let u = 0; u < result.length; u++) {
                                    if (verticalMode) {
                                        dx = 0;
                                        dy = (u > 0) ? dy + result[u - 1]['h'] : 0;
                                    } else {
                                        dx = (u > 0) ? dx + result[u - 1]['w'] : 0;
                                        dy = 0;
                                    }
                                    ctx.drawImage(result[u]['nI'], dx, dy, result[u]['w'], result[u]['h']);
                                }
                            }
                        }
                    }
                }, false);
                if (file) {
                    reader.readAsDataURL(file);
                }
            }
            if (it.type == 'checkbox') {
                verticalMode = it.checked;
            }
            if (it.parentNode.nextElementSibling && (!validateType(it.value) || it.type == 'checkbox')) {
                getValue(it.parentNode.nextElementSibling.childNodes[0]);
            }
        }
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
        let context = _canvas.getContext('2d');
        context.clearRect(0, 0, parseInt(opts.width), parseInt(opts.width) * 0.75);
        getFormValues(_form);
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
