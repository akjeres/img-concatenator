(document.addEventListener('DOMContentLoaded', function(e) {
    var concatenator = document.querySelector('.concatenator');
    var c1 = new Concatenator(concatenator);
}))();

function Concatenator(elem) {
    var _concatenator = elem;
    var _button = _concatenator.querySelector('button');
    var _form = _concatenator.querySelector('form');
    var _canvas = _concatenator.querySelector('.canvas');
    var self = this;
    var emptyLabelValue = 'No file selected';
    function addField() {
        var label = document.createElement('label');
        label.setAttribute('class', 'input-label');
        label.setAttribute('tabindex', '0');
        var input = document.createElement('input');
        input.setAttribute('class', 'input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/png,image/jpeg');
        input.setAttribute('tabindex', '-1');
        var span = document.createElement('span');
        span.setAttribute('class', 'file-name');
        span.textContent = emptyLabelValue;
        label.appendChild(input);
        label.appendChild(span);
        _form.appendChild(label);
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
        var value = emptyLabelValue;
        if (input && input.value) {
            value = input.value.replace(/.+fakepath(\\|\/)/i, '');
        }
        input.nextElementSibling.textContent = value;
    }
    function renderResult() {
        _canvas.innerHTML = getFormValues(_form);
    }
    this.addField = addField;
    this.renderResult = renderResult;
}