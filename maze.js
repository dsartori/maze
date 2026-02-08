function getMazeSpaces(maze){
    const spaces = [];
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 0) {
                spaces.push([x, y]);
            }
        }
    }
    return spaces;
}

function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function generateMaze(width, height, type = 'dfs') {
    const maze = [];

    for (let y = 0; y < height; y++) {
        maze[y] = [];
        for (let x = 0; x < width; x++) {
            maze[y][x] = 1;
        }
    }

    const generators = { prim: generatePrimMaze, ab: generateAbMaze, dfs: generateDfsMaze };
    generators[type](maze, width, height);

    for (let x = 0; x < width; x++) {
        maze[0][x] = 1;
        maze[height - 1][x] = 1;
    }
    for (let y = 0; y < height; y++) {
        maze[y][0] = 1;
        maze[y][width - 1] = 1;
    }

    return maze;
}

function generateDfsMaze(maze, width, height) {
    const startX = 1;
    const startY = 1;
    
    const stack = [[startX, startY]];
    maze[startY][startX] = 0;

    const directions = [
        [0, -2], [2, 0], [0, 2], [-2, 0]
    ];

    while (stack.length > 0) {
        const [cx, cy] = stack[stack.length - 1];
        const neighbors = [];

        for (const [dx, dy] of directions) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && maze[ny][nx] === 1) {
                neighbors.push([nx, ny, dx, dy]);
            }
        }

        if (neighbors.length > 0) {
            let [nx, ny, dx, dy] = neighbors[Math.floor(Math.random() * neighbors.length)];

            maze[cy + dy / 2][cx + dx / 2] = 0;
            maze[ny][nx] = 0;
            stack.push([nx, ny]);
        } else {
            stack.pop();
        }
    }
}

function generatePrimMaze(maze, width, height) {
    const walls = [];
    
    let startX = Math.floor(Math.random() * ((width - 1) / 2)) * 2 + 1;
    let startY = Math.floor(Math.random() * ((height - 1) / 2)) * 2 + 1;
    
    maze[startY][startX] = 0;

    const directions = [[0, -2], [2, 0], [0, 2], [-2, 0]];
    
    for (const [dx, dy] of directions) {
        const nx = startX + dx;
        const ny = startY + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && maze[ny][nx] === 1) {
            walls.push([startX, startY, dx, dy]);
        }
    }

    while (walls.length > 0) {
        const idx = Math.floor(Math.random() * walls.length);
        const [px, py, dx, dy] = walls[idx];
        walls.splice(idx, 1);

        const nx = px + dx;
        const ny = py + dy;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height && maze[ny][nx] === 1) {
            maze[py + dy / 2][px + dx / 2] = 0;
            maze[ny][nx] = 0;

            for (const [adx, ady] of directions) {
                const nnx = nx + adx;
                const nny = ny + ady;
                if (nnx >= 0 && nnx < width && nny >= 0 && nny < height && maze[nny][nnx] === 1) {
                    walls.push([nx, ny, adx, ady]);
                }
            }
        }
    }
}

function generateAbMaze(maze, width, height) {
    let cx = Math.floor(Math.random() * ((width - 1) / 2)) * 2 + 1;
    let cy = Math.floor(Math.random() * ((height - 1) / 2)) * 2 + 1;
    
    maze[cy][cx] = 0;

    const directions = [[0, -2], [2, 0], [0, 2], [-2, 0]];

    let totalCells = 0;
    for (let y = 1; y < height - 1; y += 2) {
        for (let x = 1; x < width - 1; x += 2) {
            totalCells++;
        }
    }

    let visitedCount = 1;

    while (visitedCount < totalCells) {
        const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
        const nx = cx + dx;
        const ny = cy + dy;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (maze[ny][nx] === 1) {
                maze[cy + dy / 2][cx + dx / 2] = 0;
                maze[ny][nx] = 0;
                cx = nx;
                cy = ny;
                visitedCount++;
            } else {
                cx = nx;
                cy = ny;
            }
        }
    }
}

function getRandomStartEnd(maze, minDistance) {
    const spaces = getMazeSpaces(maze);
    
    // Filter to only valid start points (have at least one partner far enough)
    const validStartPoints = spaces.filter(start => {
        return spaces.some(end => manhattanDistance(start[0], start[1], end[0], end[1]) >= minDistance);
    });
    
    if (validStartPoints.length === 0) {
        // Fallback to default positions
        return { start: [1, 1], end: [maze[0].length - 2, maze.length - 2] };
    }
    
    const startPos = validStartPoints[Math.floor(Math.random() * validStartPoints.length)];
    const startX = startPos[0];
    const startY = startPos[1];
    
    // Find valid end positions for this start
    const validEndPoints = spaces.filter(end =>
        manhattanDistance(startX, startY, end[0], end[1]) >= minDistance
    );
    
    if (validEndPoints.length > 0) {
        const endPos = validEndPoints[Math.floor(Math.random() * validEndPoints.length)];
        return { start: [startX, startY], end: [endPos[0], endPos[1]] };
    }
    
    // Fallback
    return { start: [startX, startY], end: [maze[0].length - 2, maze.length - 2] };
}
