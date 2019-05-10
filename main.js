var concatenator = document.querySelector('.concatenator');
var c1 = new Concatenator(concatenator);
var c2 = new Concatenator(document.querySelectorAll('.concatenator')[1]);

function Concatenator(elem) {
    var _concatenator = elem;
    var _button = _concatenator.querySelector('button');
    var _form = _concatenator.querySelector('form');
    var _canvas = _concatenator.querySelector('.canvas');
    var self = this;
    function addField() {
        var input = _form.elements[0];
        var newInput = input.cloneNode();
        _form.appendChild(newInput);
    }

    _form.addEventListener('input', function(e) {
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
            if (i.type != 'radio') {
                result.push(i.value);
                return;
            }
            if (i.checked && i.value) divider = '<br>';
        });
        return result.join(divider);
    }
    function renderResult() {
        _canvas.innerHTML = getFormValues(_form);
    }
    this.addField = addField;
    this.renderResult = renderResult;
}