function generateMaze(width, height, type = 'dfs') {
    const maze = [];

    for (let y = 0; y < height; y++) {
        maze[y] = [];
        for (let x = 0; x < width; x++) {
            maze[y][x] = 1;
        }
    }

    if (type === 'prim') {
        generatePrimMaze(maze, width, height);
    } else {
        generateDfsMaze(maze, width, height);
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
