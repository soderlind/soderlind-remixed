---
title: Hide block styles in Gutenberg
excerpt: Find and hide Gutenberg block styles.
---

## Find block styles

It's not easy to find the block styles, but the following script will dump all to the console

```javascript
wp.domReady(() => {
	// find blocks styles
	wp.blocks.getBlockTypes().forEach((block) => {
		if (_.isArray(block['styles'])) {
			console.log(block.name, _.pluck(block['styles'], 'name'));
		}
	});
});
```

Sample output:

```bash
core/image (2) ["default", "circle-mask"]
core/quote (2) ["default", "large"]
core/button (2) ["fill", "outline"]
core/pullquote (2) ["default", "solid-color"]
core/separator (3) ["default", "wide", "dots"]
core/table (2) ["regular", "stripes"]
core/social-links (3) ["default", "logos-only", "pill-shape"]
```

## Remove block styles

Using the info above, let's say you want to hide the `circle-mask` style from the image block, add the following to `remove-block-styles.js`

```javascript
wp.domReady(() => {
	wp.blocks.unregisterBlockStyle('core/image', 'circle-mask');
} );
```

## Add to your theme

Load the  `remove-block-styles.js`  in the themes `functions.php` file

```php
add_action( 'init', 'remove_block_style' );
/**
 * Add script to the block editor.
 *
 * @return void
 */
function remove_block_style() {
	// Register the block editor script.
	wp_register_script( 'remove-block-style', get_stylesheet_directory_uri() . '/remove-block-styles.js', [ 'wp-blocks', 'wp-edit-post' ] );
	// register block editor script.
	register_block_type( 'remove/block-style', [
		'editor_script' => 'remove-block-style',
	] );
}
```

## Bonus

If you want to clean up the block settings more, you have ([at the moment](https://github.com/WordPress/gutenberg/issues/15450)) two options:

### add_theme_support

In `functions.php` add

```php
/**
 * Disable colors
 */
add_theme_support( 'editor-color-palette' );
add_theme_support( 'disable-custom-colors' );

/**
 * Disable font sizes.
 */
add_theme_support( 'editor-font-sizes', [] );
add_theme_support( 'disable-custom-font-sizes' );
```

### removeEditorPanel

Put this in the  `remove-block-styles.js` file

```javascript
wp.data.dispatch('core/edit-post').removeEditorPanel('post-status'); // Status and Visibility
wp.data.dispatch('core/edit-post').removeEditorPanel('taxonomy-panel-category'); // Categories
wp.data.dispatch('core/edit-post').removeEditorPanel('taxonomy-panel-TAXONOMY-NAME'); // custom taxonomy
wp.data.dispatch('core/edit-post').removeEditorPanel('taxonomy-panel-post_tag'); // Tags
wp.data.dispatch('core/edit-post').removeEditorPanel('featured-image'); // Featured Image
wp.data.dispatch('core/edit-post').removeEditorPanel('post-excerpt'); // Excerpt
wp.data.dispatch('core/edit-post').removeEditorPanel('post-link'); // permalink
wp.data.dispatch('core/edit-post').removeEditorPanel('page-attributes'); // page attributes
wp.data.dispatch('core/edit-post').removeEditorPanel('discussion-panel'); // Discussion
```