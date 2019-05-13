'use strict';
(function(){
    window.addEventListener('load', function(e) {
        var c1 = new Concatenator({
            target:document.getElementById('root'),
        });
        c1.render();
    })
})();

function Concatenator(options) {
    var defaults = {
        target: document.getElementsByTagName('body')[0],
        emptyLabelValue: 'No image selected',
        width: '800px',
        button: 'Add field',
        verticalMode: false,
    };
    var opts = Object.assign(Object.create(defaults), options);
    var _button = document.createElement('button');
    var _form =  document.createElement('form');
    var _canvas = document.createElement('div'); //change to "canvas"
    var _concatenator = createConcatenator();
    _concatenator.style.width = (parseInt(opts.width) + 6) + 'px';
    var _target = opts.target;
    var self = this;
    function createConcatenator() {
        var elem = document.createElement('div');
        elem.setAttribute('class', 'concatenator');
        //Canvas attributes
        _canvas.setAttribute('class', 'canvas');
        _canvas.style.width = opts.width;
        _canvas.style.height = parseInt(parseInt(opts.width) * 0.75) + 'px';
        //Status bar (optional)
        var bar = createEl('div', 'status-bar');
        var btns = createEl('div', 'buttons');
        var bG = createEl('div', 'button button-green');
        var bY = createEl('div', 'button button-yellow');
        var bR = createEl('div', 'button button-red');
        btns.appendChild(bG);
        btns.appendChild(bY);
        btns.appendChild(bR);
        bar.appendChild(btns);
        //Management bar
        var m = createEl('div', 'management');
        var cB = createEl('input', 'checkbox');
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
        elem.appendChild(bar);
        elem.appendChild(_form);
        elem.appendChild(_canvas);
        return elem;
    }
    function renderConcatenator() {
        _target.appendChild(_concatenator);
    }
    function addField() {
        var label, input, span;
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
        _form.appendChild(label);
    }
    function getFormValues(form) {
        var elements = form.elements;
        var verticalMode = false;
        var result = [];
        var divider = '-';
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
        return /\.(png|jpg)$/i.test(value);
    }
    function setLabelValue(input) {
        var value = opts.emptyLabelValue;
        if (input && input.value) {
            value = input.value.replace(/^.+(\\|\/)/ig, '');
        }
        input.nextElementSibling.textContent = value;
    }
    function renderResult() {
        _canvas.innerHTML = getFormValues(_form);
    }
    function createEl(tag_name, class_name) {
        var res = document.createElement(tag_name);
        res.setAttribute('class', class_name);
        return res;
    }

    _form.addEventListener('input', function(e) {
        var target = e.target;
        if (target && target.type == 'file' && validateType(target.value)) {
            if (!validateType(target.value)) target.value = '';
        }
        for (var key in this.elements) {
            if (this.elements[key]['type'] == 'file') setLabelValue(this.elements[key]);
        }
        self.renderResult();
    });

    _button.addEventListener('click', function(e) {
        e.preventDefault();
        self.addField(_concatenator.querySelector('form'));
    });
    this.addField = addField;
    this.renderResult = renderResult;
    this.render = renderConcatenator;
}