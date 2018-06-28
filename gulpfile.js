var gulp = require("gulp");
var typedoc = require("gulp-typedoc");
gulp.task("doc", function() {
    return gulp
        .src(["src/**/*.ts"])
        .pipe(typedoc({
            name: "Polpware typescript data (2.1.0)",            
            out: "docs/",            
            
            module: "commonjs",
            target: "es5",

            experimentalDecorators: true,
            excludePrivate: true,
            excludeExternals: true,

            "lib": [
                "lib.dom.d.ts",
                "lib.es2015.d.ts",                
                "lib.es2016.d.ts"
            ]
            
        }));
});
