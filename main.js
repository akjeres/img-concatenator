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
        height: 600,
        button: 'Add field',
        verticalMode: false,
        statusBar: true,
        scalable: false,
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
        let canvasWrapper = createEl('div', 'canvas-wrapper');
        canvasWrapper.style.height = opts.height + 'px';
        _canvas.setAttribute('class', 'canvas');
        canvasWrapper.appendChild(_canvas);
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
        elem.appendChild(canvasWrapper);
        return elem;
    }
    function renderConcatenator() {
        _target.appendChild(_concatenator);
    }
    function addField() {
        let label, input, span, clear;
        label = createEl('label', 'input-label');
        label.setAttribute('tabindex', '0');
        input = createEl('input', 'input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/png,image/jpeg');
        input.setAttribute('tabindex', '-1');
        span = createEl('span', 'file-name');
        span.textContent = opts.emptyLabelValue;
        clear = createEl('span', 'clear-input-hidden');
        clear.setAttribute('title', 'Clear field');
        clear.innerHTML = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="438.536px" height="438.536px" viewBox="0 0 438.536 438.536" xml:space="preserve">
        <g>
        <path d="M421.125,134.191c-11.608-27.03-27.217-50.347-46.819-69.949C354.7,44.639,331.384,29.033,304.353,17.42
        C277.325,5.807,248.969,0.005,219.275,0.005c-27.978,0-55.052,5.277-81.227,15.843C111.879,26.412,88.61,41.305,68.243,60.531
        l-37.12-36.835c-5.711-5.901-12.275-7.232-19.701-3.999C3.807,22.937,0,28.554,0,36.547v127.907c0,4.948,1.809,9.231,5.426,12.847
        c3.619,3.617,7.902,5.426,12.85,5.426h127.907c7.996,0,13.61-3.807,16.846-11.421c3.234-7.423,1.903-13.988-3.999-19.701
        l-39.115-39.398c13.328-12.563,28.553-22.222,45.683-28.98c17.131-6.757,35.021-10.138,53.675-10.138
        c19.793,0,38.687,3.858,56.674,11.563c17.99,7.71,33.544,18.131,46.679,31.265c13.134,13.131,23.555,28.69,31.265,46.679
        c7.703,17.987,11.56,36.875,11.56,56.674c0,19.798-3.856,38.686-11.56,56.672c-7.71,17.987-18.131,33.544-31.265,46.679
        c-13.135,13.134-28.695,23.558-46.679,31.265c-17.987,7.707-36.881,11.561-56.674,11.561c-22.651,0-44.064-4.949-64.241-14.843
        c-20.174-9.894-37.209-23.883-51.104-41.973c-1.331-1.902-3.521-3.046-6.567-3.429c-2.856,0-5.236,0.855-7.139,2.566
        l-39.114,39.402c-1.521,1.53-2.33,3.478-2.426,5.853c-0.094,2.385,0.527,4.524,1.858,6.427
        c20.749,25.125,45.871,44.587,75.373,58.382c29.502,13.798,60.625,20.701,93.362,20.701c29.694,0,58.05-5.808,85.078-17.416
        c27.031-11.607,50.34-27.22,69.949-46.821c19.605-19.609,35.211-42.921,46.822-69.949s17.411-55.392,17.411-85.08
        C438.536,189.569,432.732,161.22,421.125,134.191z" fill='white'/>
        </g>
        </svg>`;
        label.appendChild(input);
        label.appendChild(clear);
        label.appendChild(span);
        let close = createEl('span', 'remove-input');
        close.textContent = '×';
        if (_form.elements.length <= 3) { //Disable adding remove spans to two first inputs type file
            close.classList.remove('remove-input');
            close.classList.add('remove-input-hidden');
        }
        label.appendChild(close);
        label.appendChild(close);
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
                                _canvas.style.width = '';
                                _canvas.style.height = '';
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
                                if (opts.scalable) {
                                    if (_canvas.width > parseInt(_concatenator.style.width)) {
                                        _canvas.style.width = (parseInt(_concatenator.style.width) - 6) + 'px';
                                    }
                                    if (_canvas.clientHeight > opts.height) {
                                        _canvas.style.height = opts.height + 'px';
                                        _canvas.style.width = parseInt(_canvas.width * (opts.height / _canvas.height)) + 'px';
                                    }
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
        let clearValueElem = inp.nextElementSibling;
        if (inp && inp.value) {
            value = inp.value.replace(/^.+(\\|\/)/ig, '');
            clearValueElem.classList.remove('clear-input-hidden');
            clearValueElem.classList.add('clear-input');
        }
        clearValueElem.nextElementSibling.textContent = value;
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
    function clearField() {
        let inp2clear;
        if (arguments && arguments.length) {
            inp2clear = arguments[0]; //event.target
            if (!inp2clear || (inp2clear.type != 'file')) return;
        } else {
            inp2clear = _form.elements[_form.elements.length - 1];
        }
        inp2clear.value = '';
        inp2clear.nextElementSibling.classList.remove('clear-input');
        inp2clear.nextElementSibling.classList.add('clear-input-hidden');
        inp2clear.nextElementSibling.nextElementSibling.textContent = opts.emptyLabelValue;
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
            if (target.closest('span') && target.closest('span').classList.contains('clear-input')) {
                e.preventDefault();
                if (confirm('Clear this field.\nAre you sure?')) {
                    clearField(target.closest('label').childNodes[0]);
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
    this.clearField = clearField;
    this.renderResult = renderResult;
    this.render = renderConcatenator;
}
