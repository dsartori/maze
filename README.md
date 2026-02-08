# Maze 

A web-based maze game built with Phaser 3. Its purpose is to explore and demonstrate maze algorithms with a simple game.

## Files

- `index.html` - Game container and script loading
- `game.js` - Main game scene (player, physics, UI)
- `maze.js` - Maze generation utilities

## Usage

Open `index.html` in a browser to play.


Specify maze type and size via URL parameter: `?maze=prim&size=25`. 

### Maze Types
- `?maze=dfs` (default). **Depth-First Search**. Recursive backtracker algorithm
- `?maze=prim` **Prim's Algorithm**. Randomized Prim's
- `?maze=ab` **Aldous-Broder**. Aldous-Broder maze algorithm

## Controls

- Arrow keys to move
- 'R' to restart after winning

## License
MIT