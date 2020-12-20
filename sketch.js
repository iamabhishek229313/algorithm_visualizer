var cols = 25;
var rows = 25;

var grid = new Array(rows);

var start;
var end;

var w, h;

var openSet = [];
var closedSet = [];
var path = [];

function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.previous = undefined;
    this.neighbours = [];
    this.wall = false;

    if (random(1) < 0.3) {
        this.wall = true;
    }

    this.show = function (col) {
        fill(col);
        if (this.wall) {
            fill(0);
        }
        noStroke(0);
        rect(this.i * w, this.j * h, w - 1, h - 1);
    }

    this.addNeighbours = function (grid) {
        var i = this.i;
        var j = this.j;
        if (i < rows - 1) {
            this.neighbours.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbours.push(grid[i - 1][j]);
        }
        if (j < cols - 1) {
            this.neighbours.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbours.push(grid[i][j - 1]);
        }
    }
}

function setup() {
    createCanvas(400, 400);
    console.log('A*');

    w = width / cols;
    h = height / rows;

    for (let i = 0; i < rows; ++i) {
        grid[i] = new Array(cols);
    }

    for (let i = 0; i < rows; ++i)
        for (let j = 0; j < cols; ++j)
            grid[i][j] = new Spot(i, j);

    for (let i = 0; i < rows; ++i)
        for (let j = 0; j < cols; ++j)
            grid[i][j].addNeighbours(grid);

    // Top left to bottom right.
    start = grid[0][0];
    end = grid[rows - 1][cols - 1];

    start.wall = false;
    end.wall = false;

    openSet.push(start);

    console.log(grid);
}

function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; --i)
        if (arr[i] == elt)
            arr.splice(i, 1);
}

function heuristic(a, b) {
    return dist(a.i, a.j, b.i, b.j);
}

function draw() {
    if (openSet.length > 0) {
        let lowestSet = 0;
        for (var i = 0; i < openSet.length; ++i) {
            if (openSet[i].f < openSet[lowestSet].f) {
                lowestSet = i;
            }
        }

        var current = openSet[lowestSet];

        if (current === end) {
            // Now find the path.


            noLoop();
            console.log("Done !");
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbours = current.neighbours;
        for (let i = 0; i < neighbours.length; ++i) {
            var neighbour = neighbours[i];
            if (!closedSet.includes(neighbour) && !neighbour.wall) {
                var tempG = current.g + 1;
                if (openSet.includes(neighbour)) {
                    if (tempG < neighbour.g) {
                        neighbour.g = tempG;
                    }
                } else {
                    neighbour.g = tempG;
                    openSet.push(neighbour);
                }

                neighbour.h = heuristic(neighbour, end)

                neighbour.f = neighbour.g + neighbour.h;

                neighbour.previous = current;

            }

        }

    } else {
        // No Solution.
    }

    background(0);

    for (let i = 0; i < rows; ++i)
        for (let j = 0; j < cols; ++j)
            grid[i][j].show(255);

    for (var i = 0; i < closedSet.length; ++i)
        closedSet[i].show(color(255, 0, 0));

    for (var i = 0; i < openSet.length; ++i)
        openSet[i].show(color(0, 255, 0));

    path = [];

    var temp = current;
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }

    for (var i = 0; i < path.length; ++i)
        path[i].show(color(0, 0, 225));

}