const { src, dest, parallel } = require('gulp');
const typedoc = require("gulp-typedoc");
const bumpversion = require('gulp-bump');

// `fs` is used instead of require to prevent caching in watch (require caches)
const fs = require('fs');

function doc() {
    return src(["projects/polpware/fe-data/src/lib/**/*.ts"])
        .pipe(typedoc({
            name: "Polpware typescript data (3.0.1)",            
            out: "docs/",            
            
            module: "commonjs",
            target: "es5",

            exclude: "projects/polpware/fe-data/src/lib/**/*.spec.ts",                        

            experimentalDecorators: true,
            excludePrivate: true,
            excludeExternals: true,

            "lib": [
                "lib.dom.d.ts",
                "lib.es2015.d.ts",                
                "lib.es2016.d.ts"
            ]
            
        }));
}

 
function getVersion() {
    return fs.readFileSync('./VERSION', 'utf8', function(err, data) {
        return data;
    });
};

function bump() {

    const newVer = getVersion().trim();

// bump versions on package/bower/manifest
    return src(['./package.json', './projects/polpware/fe-data/package.json'])
        .pipe(bump({
            version: newVer
        }))
        .pipe(dest(function(x) {
            return x.base;
        }));
}

exports.bump = bump;
exports.doc = doc;
exports.default = doc;
