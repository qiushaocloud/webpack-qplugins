class WebpackCustomCallbackPlugin {
    constructor (options, callbacks) {
        this.options = options;
        this.callbacks = callbacks;
    }
  
    apply (compiler) {
        if (!this.callbacks)
            return console.error('apply callbacks is empty');

        if (typeof this.callbacks === 'function') {
            this._bindTapHook(compiler, 'done', this.callbacks);
            return;
        }

        if (typeof this.callbacks === 'object') {
            for (const callbackName in this.callbacks) {
                const callbackFn = this.callbacks[callbackName];
                if (callbackName === 'applyCompiler') {
                    typeof callbackFn === 'function' && callbackFn(compiler, this.options, this.callbacks);
                    continue;
                }

                if (/Tap$/.test(callbackName)) {
                    const useHookName = callbackName.replace(/Tap$/, '');
                    this._bindTapHook(compiler, useHookName, callbackFn);
                    continue;
                }

                if (/TapAsync$/.test(callbackName)) {
                    const useHookName = callbackName.replace(/TapAsync$/, '');
                    this._bindTapAsyncHook(compiler, useHookName, callbackFn);
                    continue;
                }

                if (/TapPromise$/.test(callbackName)) {
                    const useHookName = callbackName.replace(/TapPromise$/, '');
                    this._bindTapPromiseHook(compiler, useHookName, callbackFn);
                    continue;
                }

                console.log('invalid callback, callbackName: ', callbackName);
            }
        }
    }

    _bindTapHook (compiler, hookName, hookCallback) {
        if (typeof hookCallback !== 'function')
            return console.error('_bindTapHook hookCallback not is function, hookName:', hookName);

        if (!compiler.hooks[hookName] || typeof compiler.hooks[hookName].tap !== 'function')
            return console.error('_bindTapHook hooks not found valid hook, hookName:', hookName);

        compiler.hooks[hookName].tap('WebpackCustomCallbackPlugin', (...args) => {
            try {
                console.log('_bindTapHook start run hookCallback, hookName:', hookName);
                hookCallback(this.options, ...args);
                console.log('_bindTapHook finsh run hookCallback, hookName:', hookName);
            } catch (err) {
                console.error('_bindTapHook run hookCallback catch err:', err, ' ,hookName:', hookName);
            }
        });
    }

    _bindTapAsyncHook (compiler, hookName, hookCallback) {
        if (typeof hookCallback !== 'function')
            return console.error('_bindTapAsyncHook hookCallback not is function, hookName:', hookName);

        if (!compiler.hooks[hookName] || typeof compiler.hooks[hookName].tapAsync !== 'function')
            return console.error('_bindTapAsyncHook hooks not found valid hook, hookName:', hookName);

        compiler.hooks[hookName].tapAsync('WebpackCustomCallbackPlugin', (compilation, callback, ...args) => {
            try {
                console.log('_bindTapAsyncHook start run hookCallback, hookName:', hookName);
                hookCallback(callback, this.options, compilation, ...args);
                console.log('_bindTapAsyncHook finsh run hookCallback, hookName:', hookName);
            } catch (err) {
                console.error('_bindTapAsyncHook run hookCallback catch err:', err, ' ,hookName:', hookName);
            }
        });
    }

    _bindTapPromiseHook (compiler, hookName, hookCallback) {
        if (typeof hookCallback !== 'function')
            return console.error('_bindTapPromiseHook hookCallback not is function, hookName:', hookName);

        if (!compiler.hooks[hookName] || typeof compiler.hooks[hookName].tapAsync !== 'function')
            return console.error('_bindTapPromiseHook hooks not found valid hook, hookName:', hookName);

        compiler.hooks[hookName].tapAsync('WebpackCustomCallbackPlugin', (compilation, ...args) => {
            return new Promise((resolve, reject) => {
                try {
                    console.log('_bindTapPromiseHook start run hookCallback, hookName:', hookName);
                    hookCallback(resolve, reject, this.options, compilation, ...args);
                    console.log('_bindTapPromiseHook finsh run hookCallback, hookName:', hookName);
                } catch (err) {
                    console.error('_bindTapPromiseHook run hookCallback catch err:', err, ' ,hookName:', hookName);
                }
            });
        });
    }
}

module.exports = WebpackCustomCallbackPlugin;