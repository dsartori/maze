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

    const generators = { prim: generatePrimMaze, ab: generateAbMaze, dfs: generateDfsMaze, wilson: generateWilsonMaze };
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

function generateWilsonMaze(maze, width, height) {
    const totalCells = Math.floor((width - 2) / 2) * Math.floor((height - 2) / 2);
    let visitedCount = 1;
    
    maze[1][1] = 0;
    
    const directions = [[0, -2], [2, 0], [0, 2], [-2, 0]];
    
    while (visitedCount < totalCells) {
        let startX = -1, startY = -1;
        for (let y = 1; y < height - 1 && startX === -1; y += 2) {
            for (let x = 1; x < width - 1 && startX === -1; x += 2) {
                if (maze[y][x] === 1) {
                    startX = x;
                    startY = y;
                }
            }
        }
        
        if (startX === -1) break;
        
        let cx = startX, cy = startY;
        const path = [[cx, cy]];
        maze[cy][cx] = 2; //  in-path
        
        while (maze[cy][cx] !== 0) {
            const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
            cx += dx;
            cy += dy;
            
            if (cx < 0 || cx >= width || cy < 0 || cy >= height) {
                // Step out of bounds
                cx -= dx;
                cy -= dy;
                continue;
            }
            
            if (maze[cy][cx] === 2) {
                // Loop detected 
                const loopIdx = path.findIndex(p => p[0] === cx && p[1] === cy);
                for (let i = path.length - 1; i > loopIdx; i--) {
                    const [px, py] = path.pop();
                    maze[py][px] = 1;
                }
            } else if (maze[cy][cx] === 0) {
                path.push([cx, cy]);
                break;
            } else {
                path.push([cx, cy]);
            }
        }
        
        for (let i = 0; i < path.length - 1; i++) {
            const [px, py] = path[i];
            const [nx, ny] = path[i + 1];
            maze[py][px] = 0;
            maze[py + (ny - py) / 2][px + (nx - px) / 2] = 0;
            visitedCount++;
        }
        maze[path[path.length - 1][1]][path[path.length - 1][0]] = 0;
    }
}

function getRandomStartEnd(maze, minDistance) {
    const spaces = getMazeSpaces(maze);
    
    const validStartPoints = spaces.filter(start => {
        return spaces.some(end => manhattanDistance(start[0], start[1], end[0], end[1]) >= minDistance);
    });
    
    if (validStartPoints.length === 0) {
        return { start: [1, 1], end: [maze[0].length - 2, maze.length - 2] };
    }
    
    const startPos = validStartPoints[Math.floor(Math.random() * validStartPoints.length)];
    const startX = startPos[0];
    const startY = startPos[1];
    
    const validEndPoints = spaces.filter(end =>
        manhattanDistance(startX, startY, end[0], end[1]) >= minDistance
    );
    
    if (validEndPoints.length > 0) {
        const endPos = validEndPoints[Math.floor(Math.random() * validEndPoints.length)];
        return { start: [startX, startY], end: [endPos[0], endPos[1]] };
    }
    
    return { start: [startX, startY], end: [maze[0].length - 2, maze.length - 2] };
}
