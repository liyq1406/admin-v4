// input/textarea占位符
var placeholder = {
  bind: function () {
    var self = this;
    var vModel;
    var handlePlaceholder = function () {
      if (this.input.value.length === 0) {
        this.placeholder.style.display = 'inline';
      } else {
        this.placeholder.style.display = 'none';
      }
    };

    this.placeholder = document.createElement('span');
    this.placeholder.className = 'placeholder';
    this.el.appendChild(this.placeholder);

    this.input = this.el.getElementsByClassName('input-text')[0];
    vModel = this.input.getAttribute('v-model');

    if (vModel) {
      this.vm.$watch(vModel, function (value, oldValue) {
        if (value === undefined || value.length === 0) {
          self.placeholder.style.display = 'inline';
        } else {
          self.placeholder.style.display = 'none';
        }
      }, { immediate: true });
    }

    this.input.addEventListener('input', function () {
      handlePlaceholder.apply(self);
    });

    this.placeholder.addEventListener('click', function () {
      self.input.focus();
    });

    this.input.addEventListener('blur', function () {
      handlePlaceholder.apply(self);
    });

    handlePlaceholder.apply(this);
  },

  update: function (value) {
    this.placeholder.innerText = value;
  }
};

export {placeholder};
