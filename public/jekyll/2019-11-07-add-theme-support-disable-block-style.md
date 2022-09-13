---
title: add_theme_support( 'disable_block_style')
---

Add to `functions.php`
```php
<?php
require_once 'get_theme_support_block_style.php';

add_theme_support( 'disable_block_style', [
	'cap'         => 'manage_options',   // hide if you don't have this capability, eg. hide for Editors ...
	'core/image'  => [
		'circle-mask',
	],
	'core/button' => [
		'default',
		'fill',
		'outline',
		'squared',
	],
] );

```


Save `get_theme_support_block_style.php` in the same folder as `functions.php`
```php
<?php
add_action( 'enqueue_block_assets', 'get_theme_support_block_style', 11 );
function get_theme_support_block_style() {
	if ( ! current_theme_supports( 'disable_block_style' ) ) {
		return false;
	}
	$disable_block_style = get_theme_support( 'disable_block_style' )[0];
	if ( ! is_array( $disable_block_style ) ) {
		return false;
	}
	if ( isset( $disable_block_style['cap'] ) and current_user_can( $disable_block_style['cap'] ) ) {
		return false;
	}
	unset( $disable_block_style['cap'] );
	wp_enqueue_script( 'remove-block-style', get_stylesheet_directory_uri() . '/block-script.js', [ 'wp-blocks', 'wp-edit-post' ] );
	wp_localize_script( 'remove-block-style', 'oDelBlockStyles', $disable_block_style );
}
```

`block-script.js`

```js
/**
 * Hide block styles
 */
wp.domReady(() => {
	if (_.isObject(oDelBlockStyles)) {
		_.map(oDelBlockStyles, (styleVariationName, blockName) => {
			styleVariationName.forEach((style) => {
				wp.blocks.unregisterBlockStyle(blockName, style);
			});
		});
	}
});
```