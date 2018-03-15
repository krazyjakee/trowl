export default (gridContainer, columns, gap, callback) => {

    // presets
    columns = columns || 5;
    gap = gap || 10;

    // container styling
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    gridContainer.style.gridGap = `${gap}px`;
    
    // Start gathering information about the grid
    let gridItems = gridContainer.children;
    const gridContainerTop = gridContainer.getBoundingClientRect().top;
    const rowCount = Math.ceil(gridItems.length / columns);

    // Hard write grid positions
    const itemData = Array.apply(null, { length: rowCount }).map(n => ([]));
    for (let i = 0; i < gridItems.length; i += 1) {
        const item = gridItems[i];
        const row = Math.floor(i / columns);
        const position = [row, i - (row * columns)];
        item.style.gridArea = `${position[0] + 1} / ${position[1] + 1}`;
        itemData[position[0]][position[1]] = item;
    }

    // Nudge elements upwards
    for (let i = 0; i < rowCount - 1; i += 1) {
        for (let j = 0; j < columns; j += 1) {
            const below = itemData[i + 1][j];

            const aRect = itemData[i][j].getBoundingClientRect();
            const nudgeUp = (aRect.top - below.getBoundingClientRect().top) + (aRect.height + gap);
            if (nudgeUp) {
                below.style.transform = `translateY(${nudgeUp}px)`;
                below.gridNudge = nudgeUp;
            }
        }
    }

    // Re-assign the lowest element to the end of a different column and nudge.
    const shuffle = () => {
        // Order items by lowPoint
        let lowPoints = [];
        for (let i = 0; i < gridItems.length; i += 1) {
            const elem = gridItems[i];
            const rect = elem.getBoundingClientRect();
            lowPoints[i] = {
                elem,
                column: Math.abs(elem.style.gridArea.trim().replace(/([\s\/]+)/g, '-').split('-')[1]) - 1,
                lowPoint: rect.top + rect.height,
                rect,
            }
        }
        lowPoints.sort((a, b) => b.lowPoint - a.lowPoint);
        
        // Find the highest of the bottom items per column
        const lowestPerColumn = [];
        for (let i = 0; i < lowPoints.length; i += 1) {
            const item = lowPoints[i];
            if (!lowestPerColumn[item.column]) {
                lowestPerColumn[item.column] = [item, item.lowPoint];
            }
        }
        lowestPerColumn.sort((a, b) => a[1] - b[1]);

        const highest = lowestPerColumn[0][0];
        
        // Move the lowest to the highest column and nudge
        for (let i = 1; i < lowestPerColumn.length; i += 1) {
            const lowest = lowestPerColumn[i][0];
            if (highest.lowPoint + gap + lowest.rect.height >= lowest.lowPoint) {
                if (i === lowestPerColumn.length - 1) {
                    gridContainer.style.height = `${lowest.lowPoint - gridContainerTop}px`;
                    if (callback){
                        callback();
                        return;
                    }
                }
            } else {
                const nudgeUp = (highest.rect.top - lowest.rect.top) + (highest.rect.height + gap);
                const nudge = (lowest.elem.gridNudge || 0) + nudgeUp;
                lowest.elem.style.gridColumn = highest.column + 1;
                lowest.elem.style.transform = `translateY(${nudge}px)`;
                lowest.elem.gridNudge = nudge;
                break;
            }
        }
        window.requestAnimationFrame(shuffle);
    }

    shuffle();
}