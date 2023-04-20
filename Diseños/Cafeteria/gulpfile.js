//Dependencias de gulp
const { src, dest, watch, series, parallel } = require('gulp'); //Importando los modulos de gulp
//Dependencias de CSS y SASS
const sass = require('gulp-sass')(require('sass')); // Importamos el modulo de sass
const postcss = require('gulp-postcss'); //Importamos modulo gulp-postcss
const autoprefixer = require('autoprefixer'); //Importamos modulo autoprefixer
//Dependencias de Imagnes
const imagenmin = require('gulp-imagemin');//Importamos modulo gulp-imagemin
const webp = require('gulp-webp');//Importamos modulo gulp-webp
//Dependencia para source maps
const sourcemaps = require('gulp-sourcemaps')
//Dependencia nano (Para mejorar el codigo css de forma automatica)
const cssnano = require('cssnano')


function css(done) { //Copilación
    //copilar sass
    // pasos: 1 - Identificar archivo de la hoja de estilo de SASS
    src('src/scss/app.scss')
        //source maps para inicialor y copilarlo
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' })) // pasos: 2 - Copilarlar
        .pipe(postcss([autoprefixer(), cssnano()])) // aplica prefijos de proveedores CSS utilizando PostCSS, 
        //una herramienta de procesamiento de CSS. En este caso, se utiliza el plugin 
        //autoprefixer() para agregar automáticamente los prefijos de proveedores CSS necesarios.
        //Guardar el source maps
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css')) // pasos: 3 - guardar el .css

    done(); // Finaliza la fucción 
}

function imagenes(done) { // Construcción de imagenes
    src('src/img/**/*')
        .pipe(imagenmin({ optimizationLever: 3 })) //Reducción de tamaño
        .pipe(dest('build/img')) //Creacción de carpeta
    done();
}

function versionWebp() { //Tienen que ser imagenes jpg o png
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp())
        .pipe(dest('build/img')) //Creacción de carpeta
}

/*
El error indica que el módulo gulp-avif no admite el formato de archivo .jpeg. Esto significa que si estás intentando convertir archivos .jpeg a .avif usando gulp-avif, debes convertir los archivos de imagen a un formato compatible con gulp-avif antes de realizar la conversión.

Una forma de solucionar este problema es convertir los archivos .jpeg a un formato compatible con gulp-avif, como .png o .webp, antes de realizar la conversión a .avif. Puedes hacer esto usando otro módulo de gulp, como gulp-webp o gulp-imagemin.

En este ejemplo, se utiliza primero gulp-webp para convertir los archivos .jpeg a .webp, luego gulp-imagemin para reducir el tamaño de los archivos de imagen y finalmente gulp-avif para convertir los archivos a .avif.
*/
//const avif = require('gulp-avif');//Importamos modulo gulp-avif
//exports.versionAvif = versionAvif;
//function versionAvif() {
//let opciones = {
//quality: 80
//}
//return src('src/img/**/*.{png}')
//.pipe(avif(opciones))
//.pipe(dest('build/img'))
//}


function dev() { //Comprueba si hay modificación el app.scss para copilarlo de forma automatica
    watch('src/**/*.scss', css);
    watch('src/img/**/*', imagenes);
    watch('src/img/**/*.{png,jpg}', versionWebp);
}

exports.css = css; //Para iniciar desde terminal la fucción (Comando gulp css)
exports.dev = dev; //Para iniciar desde terminal la fucción (Comando gulp dev)
exports.imagenes = imagenes;//Para iniciar desde terminal la fucción (Comando gulp imagenes)
exports.versionWebp = versionWebp;
exports.default = series(imagenes, versionWebp, css, dev)
                    // Defaul: Inicia este javascript cuando introducimos por consola gulp
                        // - Series: incializa una tarea hasta que termina, para iniciar la siguiente
                        // - Parallel: inicializar todas las tareas a la misma vez