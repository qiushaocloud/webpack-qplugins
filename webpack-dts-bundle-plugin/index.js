const dtsBundle = require('dts-bundle');

class WebpackDtsBundlePlugin {
    constructor (dtsBundleOptions, beforeCallback, afterCallback, applyCompiler) {
        this.dtsBundleOptions = dtsBundleOptions;
        this.beforeCallback = beforeCallback;
        this.afterCallback = afterCallback;
        this.applyCompiler = applyCompiler;
    }
  
    apply (compiler) {
        console.log('start apply doneTap dtsBundleOptions:', this.dtsBundleOptions);

        if (!!compiler.hooks) {
            compiler.hooks.done.tap('WebpackDtsBundlePlugin', this._doneTapHandler.bind(this));
        } else {
            compiler.plugin('done', this._doneTapHandler.bind(this));
        }

        if (this.applyCompiler) {
            console.log('start applyCompiler dtsBundleOptions:', this.dtsBundleOptions);
            this.applyCompiler(compiler, this.dtsBundleOptions);
            console.log('end applyCompiler dtsBundleOptions:', this.dtsBundleOptions);
        }

        console.log('finsh apply doneTap dtsBundleOptions:', this.dtsBundleOptions);
    }

    _doneTapHandler (...args) {
        console.log('start _doneTapHandler dtsBundleOptions:', this.dtsBundleOptions);

        if (this.beforeCallback) {
            console.log('start beforeCallback dtsBundleOptions:', this.dtsBundleOptions);
            this.beforeCallback(this.dtsBundleOptions, ...args);
            console.log('end beforeCallback dtsBundleOptions:', this.dtsBundleOptions);
        }

        console.log('start dtsBundle bundle dtsBundleOptions:', this.dtsBundleOptions);
        dtsBundle.bundle(this.dtsBundleOptions);
        console.log('end dtsBundle bundle dtsBundleOptions:', this.dtsBundleOptions);

        if (this.afterCallback) {
            console.log('start afterCallback dtsBundleOptions:', this.dtsBundleOptions);
            this.afterCallback(this.dtsBundleOptions, ...args);
            console.log('end afterCallback dtsBundleOptions:', this.dtsBundleOptions);
        }

        console.log('finsh _doneTapHandler dtsBundleOptions:', this.dtsBundleOptions);
    }
}

module.exports = WebpackDtsBundlePlugin;