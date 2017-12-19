var gulp = require("gulp");
var typedoc = require("gulp-typedoc");
gulp.task("doc", function() {
    return gulp
        .src(["dist/**/*.ts"])
        .pipe(typedoc({
            name: "Principleware typescipt data (1.0.0)",            
            out: "docs/",            
            
            module: "commonjs",
            target: "es5",

            experimentalDecorators: true,
            excludePrivate: true,
            excludeExternals: true
        }));
});
