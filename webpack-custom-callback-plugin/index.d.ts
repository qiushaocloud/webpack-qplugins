declare module '@qiushaocloud/webpack-custom-callback-plugin' {
    import { Compiler, Compilation } from 'webpack';

    export type IOptions = Record<string, any> | undefined;

    export interface ITapHookFn {
        (options: IOptions, ...args: any[]): void;
    }

    export interface ITapAsyncHookFn {
        (callback: () => void, options: IOptions, compilation: Compilation, ...args: any[]): void;
    }

    export interface ITapPromiseHookFn {
        (resolve: (value: any) => void, reject: (reason?: any) => void, options: IOptions, compilation: Compilation, ...args: any[]): void;
    }

    interface ICallbacksExcludeApplyCompiler {
        afterPluginsTap?: ITapHookFn;
        afterPluginsTapAsync?: ITapAsyncHookFn;
        afterPluginsTapPromise?: ITapPromiseHookFn;
        compileTap?: ITapHookFn;
        compileTapAsync?: ITapAsyncHookFn;
        compileTapPromise?: ITapPromiseHookFn;
        compilationTap?: ITapHookFn;
        compilationTapAsync?: ITapAsyncHookFn;
        compilationTapPromise?: ITapPromiseHookFn;
        emitTap?: ITapHookFn;
        emitTapAsync?: ITapAsyncHookFn;
        emitTapPromise?: ITapPromiseHookFn;
        afterEmitTap?: ITapHookFn;
        afterEmitTapAsync?: ITapAsyncHookFn;
        afterEmitTapPromise?: ITapPromiseHookFn;
        doneTap?: ITapHookFn;
        doneTapAsync?: ITapAsyncHookFn;
        doneTapPromise?: ITapPromiseHookFn;
    }

    export interface IApplyCompilerFn {
        (compiler: Compiler, options: IOptions, callbacks: ICallbacksExcludeApplyCompiler): void;
    }

    export interface ICallbacks extends ICallbacksExcludeApplyCompiler {
        applyCompiler?: IApplyCompilerFn;
    }
    
    export class WebpackCustomCallbackPlugin {
        constructor(
            options: IOptions,
            callbacks: ICallbacks | ITapHookFn
        );

        apply(compiler: Compiler): void;
    }
}