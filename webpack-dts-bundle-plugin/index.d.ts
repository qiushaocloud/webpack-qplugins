declare module '@qiushaocloud/webpack-dts-bundle-plugin' {
    import { Compiler } from 'webpack';

    /**
        var dtsBundleOptions = {
            // Required
        
            // name of module likein package.json
            // - used to declare module & import/require
            name: 'cool-project',
            // path to entry-point (generated .d.ts file for main module)
            // if you want to load all .d.ts files from a path recursively you can use "path/project\/**\/*.d.ts"
            //  ^ *** Experimental, TEST NEEDED, see "All .d.ts files" section 
            // - either relative or absolute
            main: 'build/index.d.ts',
        
            // Optional
        
            // base directory to be used for discovering type declarations (i.e. from this project itself)
            // - default: dirname of main
            baseDir: 'build',
            // path of output file. Is relative from baseDir but you can use absolute paths. 
            // if starts with "~/" then is relative to current path. See https://github.com/TypeStrong/dts-bundle/issues/26
            //  ^ *** Experimental, TEST NEEDED    
            // - default: "<baseDir>/<name>.d.ts"
            out: 'dist/cool-project.d.ts',
            // include typings outside of the 'baseDir' (i.e. like node.d.ts)
            // - default: false
            externals: false,
            // reference external modules as <reference path="..." /> tags *** Experimental, TEST NEEDED
            // - default: false
            referenceExternals: false,
            // filter to exclude typings, either a RegExp or a callback. match path relative to opts.baseDir
            // - RegExp: a match excludes the file
            // - function: (file:String, external:Boolean) return true to exclude, false to allow
            // - always use forward-slashes (even on Windows)
            // - default: *pass*
            exclude: /^defs\/$/,
            // delete all source typings (i.e. "<baseDir>\/**\/*.d.ts")
            // - default: false
            removeSource: false,
            // newline to use in output file
            newline: os.EOL,
            // indentation to use in output file
            // - default 4 spaces
            indent: '	',
            // prefix for rewriting module names
            // - default ''
            prefix: '__',
            // separator for rewriting module 'path' names
            // - default: forward slash (like sub-modules)
            separator: '/',
            // enable verbose mode, prints detailed info about all references and includes/excludes
            // - default: false
            verbose: false,
            // emit although included files not found. See "Files not found" section. 
            // *** Experimental, TEST NEEDED
            // - default: false 
            emitOnIncludedFileNotFound: false,
            // emit although no included files not found. See "Files not found" section. 
            // *** Experimental, TEST NEEDED
            // - default: false     
            emitOnNoIncludedFileNotFound: false,    
            // output d.ts as designed for module folder. (no declare modules)
            outputAsModuleFolder: false,
            // path to file that contains the header
            // // insert a header in output file. i.e.: http://definitelytyped.org/guides/contributing.html#header
            // - default: null
            headerPath: "path/to/header/file",
            // text of the the header
            // doesn't work with headerPath
            // // insert a header in output file. i.e.: http://definitelytyped.org/guides/contributing.html#header
            // - default: ''
            headerTex: "" 
        };
    */
    export type IDtsBundleOptions = {
        name: string;
        main: string;
        baseDir?: string | undefined;
        out?: string | undefined;
        externals?: boolean | undefined;
        referenceExternals?: boolean | undefined;
        exclude?: RegExp | ((file: string, external: boolean) => boolean) | undefined;
        removeSource?: boolean | undefined;
        newLine?: string | undefined;
        indent?: string | undefined;
        prefix?: string | undefined;
        separator?: string | undefined;
        verbose?: boolean | undefined;
        emitOnIncludedFileNotFound?: boolean | undefined;
        emitOnNoIncludedFileNotFound?: boolean | undefined;
        outputAsModuleFolder?: boolean | undefined;
        headerPath?: string | undefined;
        headerText?: string | undefined;
    };


    export class WebpackDtsBundlePlugin {
        constructor(
            dtsBundleOptions?: IDtsBundleOptions,
            beforeCallback?: (dtsBundleOptions?: IDtsBundleOptions, ...args: any[]) => void,
            afterCallback?: (dtsBundleOptions?: IDtsBundleOptions, ...args: any[]) => void,
            applyCompiler?: (compiler: Compiler, dtsBundleOptions?: IDtsBundleOptions) => void
        );

        apply(compiler: Compiler): void;
    }
}