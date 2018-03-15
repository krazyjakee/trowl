# Trowl

Masonry-style grid library.

- Ultra-lightweight (1kb uglified and gzipped)
- Uses [CSS Grid](https://caniuse.com/#search=css%20grid)
- Zero dependencies

### Installation

`npm install trowl`

### Usage

Import it: `import trowl from 'trowl';`

Prepare your HTML
```html
<div id="grid">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    ...
</div>
```

Use it:
```javascript
const numberOfColumns = 5; // The number of columns in the grid
const gapSize = 10; // The size of the gap between items in pixels
const callback = () => alert('yay!'); // A callback after the grid has finished sorting items
trowl(document.getElementById('grid'), numberOfColumns, gapSize, callback);
```

### Tip

I would make the grid `opacity: 0` and use the callback to make it `1` with a low transition time (0.2s). There is a small chance that for a few microseconds, the interface shuffles about as it adjusts items.