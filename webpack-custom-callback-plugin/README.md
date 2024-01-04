### 介绍
主要封装一个自定义回调的 webpack 插件，根据传入的回调注册对应的钩子

### 项目源码
* 自建 gitlab 地址: https://gitlab.qiushaocloud.top:61024/qiushaocloud/webpack-qplugins
* github 地址: https://github.com/qiushaocloud/webpack-qplugins

### npm 包
* 安装 npm 包: `npm install --save @qiushaocloud/webpack-custom-callback-plugin`

### 插件 TS 定义
``` typescript
declare module '@qiushaocloud/webpack-custom-callback-plugin' {
    import { Compiler, Compilation } from 'webpack';

    export type IOptions = Record<string, any>;

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
```

### 插件使用示例
``` javascript
// 使用方式1: callbacks 直接定义成 ITapHookFn
module.exports = {
  plugins:[
    // 传入插件实例
    new WebpackCustomCallbackPlugin({
      paramKey: 'paramValue'
    }, (...args) => {}),
  ]
};

// 使用方式2: callbacks 直接定义成 ICallbackJson
module.exports = {
  plugins:[
    // 传入插件实例
    new WebpackCustomCallbackPlugin({
      paramKey: 'paramValue'
    }, {
        // applyCompiler: (compiler, options, callbacks) => {},
        doneTap: (options, ...args) => {},
        // doneTapAsync: (callback, options, compilation, ...args) => {},
        // doneTapPromise: (resolve, reject,  options, compilation, ...args) => {},
    }),
  ]
};
```

### webpack 编写自定义插件资料
##### 构建流程
在编写插件之前，还需要了解一下Webpack的构建流程，以便在合适的时机插入合适的插件逻辑。Webpack的基本构建流程如下：
1. 校验配置文件
2. 生成Compiler对象
3. 初始化默认插件
4. `run/watch`：如果运行在watch模式则执行watch方法，否则执行run方法
5. `compilation`：创建Compilation对象回调compilation相关钩子
6. `emit`：文件内容准备完成，准备生成文件，这是最后一次修改最终文件的机会
7. `afterEmit`：文件已经写入磁盘完成
8. `done`：完成编译

##### Compiler && Compilation对象
在编写Webpack插件过程中，最常用也是最主要的两个对象就是Webpack提供的Compiler和Compilation，Plugin通过访问Compiler和Compilation对象来完成工作。
* Compiler 对象包含了当前运行Webpack的配置，包括entry、output、loaders等配置，这个对象在启动Webpack时被实例化，而且是全局唯一的。Plugin可以通过该对象获取到Webpack的配置信息进行处理。
* Compilation对象可以理解编译对象，包含了模块、依赖、文件等信息。在开发模式下运行Webpack时，每修改一次文件都会产生一个新的Compilation对象，Plugin可以访问到本次编译过程中的模块、依赖、文件内容等信息。

##### 常见钩子
Webpack会根据执行流程来回调对应的钩子，下面我们来看看都有哪些常见钩子，这些钩子支持的tap操作是什么。

| 钩子         | 说明                    | 参数              | 类型 |
| ------------ | ----------------------- | ----------------- | ---- |
| afterPlugins | 启动一次新的编译        | compiler          | 同步 |
| compile      | 创建compilation对象之前 | compilationParams | 同步 |
| compilation  | compilation对象创建完成 | compilation       | 同步 |
| emit         | 资源生成完成，输出之前  | compilation       | 异步 |
| afterEmit    | 资源输出到目录完成      | compilation       | 异步 |
| done         | 完成编译                | stats             | 同步 |


##### Tapable

Tapable是Webpack的一个核心工具，Webpack中许多对象扩展自Tapable类。Tapable类暴露了tap、tapAsync和tapPromise方法，可以根据钩子的同步/异步方式来选择一个函数注入逻辑。

- tap 同步钩子
- tapAsync 异步钩子，通过callback回调告诉Webpack异步执行完毕
- tapPromise 异步钩子，返回一个Promise告诉Webpack异步执行完毕

##### 详细内容参考: https://www.qiushaocloud.top/2024/01/04/zhuan-zai-bian-xie-webpack-zi-ding-yi-cha-jian.html