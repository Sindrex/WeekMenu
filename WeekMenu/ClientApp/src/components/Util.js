export function makegrid(meals) {
    let grid = [];
    grid.push([]);

    let perrow = 4;
    let rowIndex = 0;
    for (let i = 0; i < meals.length; i++) {
        if (i % perrow === 0 && i > 0) {
            rowIndex++;
            grid.push([]);
        }
        grid[rowIndex][i] = meals[i];
    }
    return grid;
}
export function makegridfromobj(obj) {
    let grid = [];
    grid.push([]);

    let perrow = 4;
    let rowIndex = 0;
    Object.keys(obj).map((key, i) => {
        if (i % perrow === 0 && i > 0) {
            rowIndex++;
            grid.push([]);
        }
        grid[rowIndex][i] = obj[key];
    });
    return grid;
}