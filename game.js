class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {}

    create() {

        
        const urlParams = new URLSearchParams(window.location.search);

        const mazeSize = urlParams.get('size') || '100';
        const mazeType = urlParams.get('maze') || 'dfs';

        console.log(`MAZE\nDoug Sartori, Windsor Ontario\nGenerating ${mazeSize}x${mazeSize} maze using ${mazeType} algorithm`);
        
        const mazeWidth = parseInt(mazeSize, 10);
        const mazeHeight = parseInt(mazeSize, 10);
        const maze = generateMaze(mazeWidth, mazeHeight, mazeType);
        this.maze = maze;

        const minDistance = 25;
        const positions = getRandomStartEnd(maze, minDistance);
        const startX = positions.start[0];
        const startY = positions.start[1];
        const endX = positions.end[0];
        const endY = positions.end[1];

        const targetCellsWide = 5;
        const targetCellsHigh = 5;
        
        let cellSize = Math.min(
            window.innerWidth * 0.95 / targetCellsWide,
            window.innerHeight * 0.95 / targetCellsHigh
        );
        cellSize = Phaser.Math.Clamp(cellSize, 32, 64);

        const baseZoom = cellSize / 32;
        const zoom = Phaser.Math.Clamp(baseZoom, 1.0, 2.0);

        this.walls = this.physics.add.staticGroup();
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 1) {
                    const wall = this.add.rectangle(x * cellSize + cellSize/2, y * cellSize + cellSize/2, cellSize, cellSize, 0x2d3436);
                    this.walls.add(wall);
                }
            }
        }

        const playerX = startX * cellSize + cellSize / 2;
        const playerY = startY * cellSize + cellSize / 2;
        this.player = this.add.circle(playerX, playerY, 8, 0xe74c3c);
        this.physics.add.existing(this.player);
        this.player.body.setSize(16, 16).setCollideWorldBounds(false).setBounce(0).setFriction(0.95);

        const exitX = endX * cellSize + cellSize / 2;
        const exitY = endY * cellSize + cellSize / 2;
        this.exit = this.add.rectangle(exitX, exitY, cellSize, cellSize, 0x2ecc71);
        this.physics.add.existing(this.exit);
        this.exit.body.setImmovable(true);

        this.physics.add.collider(this.player, this.walls);
        this.physics.add.overlap(this.player, this.exit, this.winGame, null, this);

        const mazePixelWidth = mazeWidth * cellSize;
        const mazePixelHeight = mazeHeight * cellSize;
        this.cameras.main.setBounds(0, 0, mazePixelWidth, mazePixelHeight).zoom = zoom;
        this.cameras.main.startFollow(this.player, true, 0.15, 0.15);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT
        });

        const winTextX = mazePixelWidth - 30;
        const winTextY = mazePixelHeight - 20;
        this.winText = this.add.text(winTextX, winTextY, 'You Win!\nPress R to restart', {
            fontSize: '10px',
            fill: '#ffffff'
        }).setOrigin(1, 1);
        
        const instructionsX = playerX + cellSize * 2;
        const instructionsY = playerY - cellSize;
        this.instructions = this.add.text(instructionsX, instructionsY, 'Explore the ' + mazeType + ' maze\nUse arrow keys to move\nReach the green square', {
            fontSize: '10px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-R', () => {
            if (this.win) this.scene.restart();
        }, this);
        
        this.win = false;
        this.winText.setAlpha(0);
    }

    update() {
        if (this.win) return;

        const p = this.player.body;
        if (this.cursors.up.isDown) p.setAcceleration(0, -400);
        else if (this.cursors.down.isDown) p.setAcceleration(0, 400);
        else if (this.cursors.left.isDown) p.setAcceleration(-400, 0);
        else if (this.cursors.right.isDown) p.setAcceleration(400, 0);
        else p.setDrag(800);

        p.setMaxSpeed(300);
    }

    winGame() {
        this.win = true;
        this.winText.setAlpha(1);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    backgroundColor: '#16213e',
    parent: 'game-container',
    scene: MainScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }
        }
    }
};

const game = new Phaser.Game(config);
