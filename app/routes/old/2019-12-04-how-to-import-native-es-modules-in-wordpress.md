---
title: How to import native ES modules in WordPress
image: "/assets/import-module.png"
---

Don't want to use Webpack et al? You [can import](https://caniuse.com/#feat=mdn-javascript_statements_import) native EcmaScript modules in WordPress:

```php
add_action( 'wp_enqueue_scripts', function() {
	$handle  = 'ps-import-module-one-handle';
	$src     = get_stylesheet_directory_uri() . '/main.js';
	$deps    = [];
	$version = '1.0.0';
	wp_enqueue_script( $handle, $src, $deps, $version, true );

} );

/**
 *Script that import modules must use a script tag with type="module", 
 * so let's set it for the script.
 */
add_filter( 'script_loader_tag', function ( $tag, $handle, $src ) {

	switch ( $handle ) {
		case 'ps-import-module-one-handle':
			return '<script type="module" src="' . esc_url( $src ) . '"></script>';
			break;

		default:
			return $tag;
			break;
	}

}, 10, 3 );
```

The EcmaScripts:

```javascript
//------ main.js ------
import { square, diag } from './lib.js';
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5
```

```javascript
//------ lib.js ------
export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    return sqrt(square(x) + square(y));
}
```

EcmaScript credits: [Peter Chang](https://hackernoon.com/import-export-default-require-commandjs-javascript-nodejs-es6-vs-cheatsheet-different-tutorial-example-5a321738b50f)