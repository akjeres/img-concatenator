'use strict';
(function(){
    window.addEventListener('load', function(e) {
        var c1 = new Concatenator({target:document.getElementById('root')});
        c1.render();
    })
})();

function Concatenator(options) {
    var defaults = {
        target: document.getElementsByTagName('body')[0],
        emptyLabelValue: 'No image selected',
        width: '800px',
    };
    var opts = Object.assign(Object.create(defaults), options);
    var _concatenator = createConcatenator();
    _concatenator.style.width = (parseInt(opts.width) + 6) + 'px';
    var _target = opts.target;
    var _button = _concatenator.querySelector('button');
    var _form = _concatenator.querySelector('form');
    var _canvas = _concatenator.querySelector('.canvas');
    var self = this;
    function createConcatenator() {
        var elem = document.createElement('div');
        elem.setAttribute('class', 'concatenator');
        elem.innerHTML = `<div class="status-bar">
            <div class="buttons">
                <div class="button button-green"></div>
                <div class="button button-yellow"></div>
                <div class="button button-red"></div>
            </div>
        </div>
        <form>
            <div class="management">
                <input type="checkbox" name="verticalMode" class="checkbox" tabindex="0">
                <button type="button">Add field</button>
            </div>
            <label class="input-label" tabindex="0">
                <input type="file" accept="image/png,image/jpeg" class="input" tabindex="-1">
                <span class="file-name">No image selected</span>
            </label>
            <label class="input-label" tabindex="0">
                <input type="file" accept="image/png,image/jpeg" class="input" tabindex="-1">
                <span class="file-name">No image selected</span>
            </label>
        </form>
        <div class="canvas" style="width:${opts.width};height:${parseInt(parseInt(opts.width) * 0.75) + 'px'}"></div>`;

        return elem;
    }
    function renderConcatenator() {
        _target.appendChild(_concatenator);
    }
    function addField() {
        var label, input, span;
        label = document.createElement('label');
        label.setAttribute('class', 'input-label');
        label.setAttribute('tabindex', '0');
        input = document.createElement('input');
        input.setAttribute('class', 'input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/png,image/jpeg');
        input.setAttribute('tabindex', '-1');
        span = document.createElement('span');
        span.setAttribute('class', 'file-name');
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
            value = input.value.replace(/.+fakepath(\\|\/)/i, '');
        }
        input.nextElementSibling.textContent = value;
    }
    function renderResult() {
        _canvas.innerHTML = getFormValues(_form);
    }

    _form.addEventListener('input', function(e) {
        var target = e.target;
        if (target && target.type == 'file' && validateType(target.value)) {
            if (!validateType(target.value)) target.value = '';
            setLabelValue(target);
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