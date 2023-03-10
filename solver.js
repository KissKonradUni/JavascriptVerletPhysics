class PhysicsSolver {
    Entities = {
        /** @type {Entity[]} */
        list: []
    };
    static SimulationGridSize = 32.0;
    /** @type {Entity[][][]} */
    SimulationGrid = [];
    static Gravity = new Vector2(0, 9.81);

    update(deltaTime, substeps) {
        let subDeltaTime = deltaTime / substeps;

        for (let i = 0; i < substeps; i++) {
            this.applyGravity();
            this.applyConstraints();
            this.createGrid();
            this.solveCollisions();
    
            this.updatePositions(subDeltaTime);   
        }
    }

    updatePositions(deltaTime) {
        this.Entities.list.forEach((e) => {
            e.updatePositions(deltaTime);
        })
    }

    applyGravity() {
        this.Entities.list.forEach((e) => {
            e.accelerate(PhysicsSolver.Gravity);
        });
    }

    applyConstraints() {
        this.Entities.list.forEach((e) => {
            let left = e.position.x - e.size.x;
            if (left <= 0)
                e.position.x -= (left);

            let right = e.position.x + e.size.x;
            if (right >= screenSize.x)
                e.position.x -= (right - screenSize.x);
            
            let top = e.position.y - e.size.y;
            if (top <= 0)
                e.position.y -= (top);
                
            let bottom = e.position.y + e.size.y;
            if (bottom >= screenSize.y)
                e.position.y -= (bottom - screenSize.y);

        });
    }

    createGrid() {
        for (let x = 0; x < this.SimulationGrid.length; x++) {
            for (let y = 0; y < this.SimulationGrid[x].length; y++) {
                /** @type {Entity[][][]} */
                this.SimulationGrid[x][y].length = 0;
            }
        }

        for (let i = 0; i < entities.list.length; i++) {
            /** @type {Entity} */
            let x = Utils.clamp(Math.round(entities.list[i].position.x / PhysicsSolver.SimulationGridSize), 0, this.SimulationGrid.length - 1);
            let y = Utils.clamp(Math.round(entities.list[i].position.y / PhysicsSolver.SimulationGridSize), 0, this.SimulationGrid[0].length - 1);
            this.SimulationGrid[x][y].push(entities.list[i]);
        }
    }

    solveCollisions() {
        for (let x = 1; x < this.SimulationGrid.length - 1; x++) {
            for (let y = 1; y < this.SimulationGrid[0].length - 1; y++) {
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        this.checkCollisionCells(x, y, x + dx, y + dy);
                    }
                }
            }
        }
    }

    checkCollisionCells(ax, ay, bx, by) {
        for (let i = 0; i < this.SimulationGrid[ax][ay].length; i++) {
            for (let j = 0; j < this.SimulationGrid[bx][by].length; j++) {
                if (this.SimulationGrid[ax][ay][i] == this.SimulationGrid[bx][by][j])
                    continue;
                
                let collisionAxis = this.SimulationGrid[ax][ay][i].position.sub(this.SimulationGrid[bx][by][j].position);
                let distance = collisionAxis.len();
                let radiuses = this.SimulationGrid[ax][ay][i].size.x + this.SimulationGrid[bx][by][j].size.x;
                if (distance < radiuses) {
                    let n = collisionAxis.div(distance);
                    let delta = radiuses - distance;
                    this.SimulationGrid[ax][ay][i].position = this.SimulationGrid[ax][ay][i].position.add(n.mul(delta * 0.5));
                    this.SimulationGrid[bx][by][j].position = this.SimulationGrid[bx][by][j].position.sub(n.mul(delta * 0.5));
                }
            }
        }
    } 

    constructor(entities) {
        this.Entities = entities;
        for (let x = 0; x <= Math.ceil(screenSize.x / PhysicsSolver.SimulationGridSize); x++) {
            this.SimulationGrid.push([]);
            for (let y = 0; y <= Math.ceil(screenSize.y / PhysicsSolver.SimulationGridSize); y++) {
                this.SimulationGrid[x].push([]);
                this.SimulationGrid[x][y].push([]);
            }
        }
    }
}