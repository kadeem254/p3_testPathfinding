import Phaser from "phaser";
import * as GLB from "../variables";

// assets to preload
import img_tilesheet from "../assets/tilesheet_complete.png";
import img_survivor from "../assets/survivor.png";
import img_zombie from "../assets/zombie.png";
import json_testLevelMap from "../assets/testLevel.json";

export default class TestLevel extends Phaser.Scene{
  constructor(){
    super( GLB.SceneKeys.testLevel );
  }

  preload(){
    this.load.image( GLB.TextureKeys.tileset, img_tilesheet );
    this.load.image( GLB.TextureKeys.survivor, img_survivor );
    this.load.image( GLB.TextureKeys.zombie, img_zombie );
    this.load.tilemapTiledJSON( GLB.TilemapKeys.testLevel, json_testLevelMap  );
  }

  create(){
    // REMAPPED FUNCTIONS
    const Between = Phaser.Math.Between;

    // SCENE VARIABLES
    this.data.set({
      enemySpawnTime: {
        min: 650,
        max: 3200
      },
      enemySpawnPoint: {
        x: GLB.Resolution.width / 2,
        y: 32
      },
      zombieSpawnCounter: 0
    })

    // ABSTRACT LAYERS
    this.createControls();

    // VISUAL LAYERS
    this.createWalls();
    this.createTilemap();
    this.createNavmesh();
    this.createPlayer();
    this.createEnemyManager();
    this.createTargetObject();

    // INTERACTIONS
    this.defineCollisions();
    this.defineTouchAndClickInteractions();

    // TO RUN ONCE WHEN SCENE IS CREATED
    // this.spawnEnemy();

    return;
  }

  update( time, delta ){
    // handle inputs
    this.__InputHandler();

    // update enemy group
    let zombieUpdateCounter = this.data.get("zombieUpdateTimer");
    if( zombieUpdateCounter <= 0 ){
      this.updateEnemies();
      this.data.set( "zombieUpdateTimer", 250 );
    } else{
      this.data.set( "zombieUpdateTimer", zombieUpdateCounter - delta );
    }

    // spawn more zombies
    if( this.grp_zombieManager.isFull() == false ){
      let zombieSpawnCounter = this.data.get("zombieSpawnCounter");

      if( zombieSpawnCounter <= 0 ){
        this.spawnEnemy();
        this.data.set( "zombieSpawnCounter", Phaser.Math.Between( 650, 2400 ) );
      } else{
        this.data.set( "zombieSpawnCounter", zombieSpawnCounter - delta );
      }
    }

  }

  /*######## CREATE CONTROLS ######### */
  /**Creates all the controls for various inputs for the game */
  createControls(){
    this.ctrls_keyboard = this.input.keyboard.addKeys(
      "W,A,S,D,UP,LEFT,DOWN,RIGHT"
    );

    return;
  }

  /*######## GENERATE MAP ######### */
  createTilemap(){
    // create map
    this.map_testLevel = this.make.tilemap({
      key: GLB.TilemapKeys.testLevel
    });

    // set maps tileset texture
    this.tiles_default = this.map_testLevel.addTilesetImage(
      GLB.TilesetKeys.default, GLB.TextureKeys.tileset
    );

    // create the ground layer
    this.tileLayer_ground = this.map_testLevel.createLayer(
      "ground", GLB.TilesetKeys.default, 0, 0
    );

    // create the wall layer and add collision
    this.tileLayer_walls = this.map_testLevel.createLayer(
      "walls", GLB.TilesetKeys.default, 0, 0
    )
    this.tileLayer_walls.setCollisionByProperty(
      {collides: true}
    );

    return;
  }

  /*######## CREATE PLAYER ######### */
  createPlayer(){
    // create player and add to physics simulation
    this.obj_player = this.physics.add.image(
      32, 32, GLB.TextureKeys.survivor
    );
    this.obj_player.setCircle( 16, 0, 6 );
    this.obj_player.setCollideWorldBounds( true );

    // create motion controls for player
    this.__playerActions = {
      move: new Phaser.Math.Vector2( 0, 0 ),
      shoot: 0
    }

    return;
  }

  /*######## CREATE ENEMY MANAGER ######### */
  createEnemyManager(){
    this.grp_zombieManager = this.physics.add.group({
      runChildUpdate: false,
      maxSize: 30
    });

    this.data.set({
      zombieUpdateTimer: 0
    })

    return;
  }

  createEnemy( x = 32, y = 32 ){
    const enemy = this.physics.add.image(
      x, y, GLB.TextureKeys.zombie
    );

    enemy.setCollideWorldBounds( true );
    // enemy.setCircle( 16, 0, 6 );
    enemy.setBodySize( 20, 20, true );
    enemy.setCollideWorldBounds( true );
    enemy.setBounce( 0.1 );

    return enemy;
  }

  /*######## CREATE WALLS ######### */
  createWalls(){
    this.grp_walls = this.physics.add.staticGroup();

    let top_wall = this.add.rectangle(
      -50, -50, GLB.Resolution.width + 100, 50
    ).setOrigin( 0 );
    let bottom_wall = this.add.rectangle(
      -50 ,GLB.Resolution.height, GLB.Resolution.width + 100, 50
    ).setOrigin( 0 );
    let left_wall = this.add.rectangle(
      -50, -50, 50, GLB.Resolution.height + 100
    ).setOrigin( 0 );
    let right_wall = this.add.rectangle(
      GLB.Resolution.width, -50, 50, GLB.Resolution.height + 100
    ).setOrigin( 0 );

    let tile_size = 64;

    let room_wall_1 = this.add.rectangle(
      tile_size * 2,
      tile_size * 2,
      tile_size * 2,
      tile_size
    ).setOrigin(0);
    let room_wall_2 = this.add.rectangle(
      tile_size * 2,
      tile_size * 3,
      tile_size,
      tile_size * 8
    ).setOrigin(0)
    let room_wall_3 = this.add.rectangle(
      tile_size * 2,
      tile_size * 10,
      tile_size * 9,
      tile_size
    ).setOrigin(0);
    let room_wall_4 = this.add.rectangle(
      tile_size * 10,
      tile_size * 8,
      tile_size,
      tile_size * 3
    ).setOrigin(0);
    let room_wall_5 = this.add.rectangle(
      tile_size * 7,
      tile_size * 8,
      tile_size * 4,
      tile_size
    ).setOrigin(0);
    let room_wall_6 = this.add.rectangle(
      tile_size * 7,
      tile_size * 5,
      tile_size,
      tile_size * 4
    ).setOrigin(0);
    let room_wall_7 = this.add.rectangle(
      tile_size * 7,
      tile_size * 5,
      tile_size * 4,
      tile_size
    ).setOrigin(0);
    let room_wall_8 = this.add.rectangle(
      tile_size * 10,
      tile_size * 2,
      tile_size,
      tile_size * 4
    ).setOrigin(0);
    let room_wall_9 = this.add.rectangle(
      tile_size * 5,
      tile_size * 2,
      tile_size * 6,
      tile_size
    ).setOrigin(0);

    this.grp_walls.addMultiple([
      top_wall, bottom_wall, left_wall, right_wall,
      room_wall_1, room_wall_2, room_wall_3, room_wall_4,
      room_wall_5, room_wall_6, room_wall_7, room_wall_8,
      room_wall_9
    ]);

    return;
  }

  updateEnemies(){
    let activeZombies = this.grp_zombieManager.getMatching(
      "active", true
    );

    activeZombies.forEach(
      zombie => {
        zombie.update();
      }
    )

    return;
  }

  /**The update loop for active zombies */
  zombieUpdate(){
    // find path to player
    this._pathToTarget = this._navMesh.findPath(
      this, this._target
    );

    // move to next point on path
    if( this._pathToTarget != null ){
      this.scene.physics.moveTo(
        this,
        this._pathToTarget[1].x,
        this._pathToTarget[1].y,
        this._moveSpeed
      );

      // get angle
      let opp = (this._pathToTarget[1].y - this.y).toFixed(4);
      let adj = (this.x - this._pathToTarget[1].x).toFixed(4);
      let hyp = Math.sqrt( (opp * opp) + (adj * adj) ).toFixed( 4 );

      let rad = Math.asin( opp / hyp );
      this.setRotation( rad );
    }
    else{
      this.setVelocity( 0 );
    }

    return;
  }


  /*######## SPAWN ENEMY ######### */
  spawnEnemy( ){
    let spawnPoint = this.data.get( "enemySpawnPoint" );

    // check if any dead zombie in group
    let zombie = this.grp_zombieManager.getFirstDead(
      false, spawnPoint.x, spawnPoint.y, GLB.TextureKeys.zombie
    )

    if( zombie == null ){
      zombie = this.createEnemy( spawnPoint.x, spawnPoint.y );
      this.grp_zombieManager.add( zombie );
    }

    zombie._moveSpeed = Phaser.Math.Between(GLB.Enemy.speed["0"], GLB.Enemy.speed["1"] );
    zombie._target = this.obj_target;
    zombie._navMesh = this.nav_testLevel;
    zombie.update = this.zombieUpdate.bind( zombie );

    return;
  }


  /*######## CREATE NAVMESH ######### */
  /**Create the navmesh using the tilemap */
  createNavmesh(){

    let drawMesh = false;
    let spacing = 8;

    this.nav_testLevel = this.navMeshPlugin.buildMeshFromTilemap(
      "test_level_navmesh",
      this.map_testLevel,
      [this.tileLayer_walls],
      ( tile ) => {
        return !tile.collides;
      },
      spacing
    )

    // draw navmesh level
    this.nav_testLevel.enableDebug();

    // draw navmesh
    if( drawMesh ){

      this.nav_testLevel.debugDrawMesh({
        drawCentroid: true,
        drawBounds: false,
        drawNeighbors: true,
        drawPortals: true
      });

    }

    return;
  }
  
  /*######## CREATE TEST OBJECT FOR PATH FINDING ######### */
  createTargetObject(){
    this.obj_target = this.add.rectangle(
      0, 0, 16, 16, 0xffffff
    );

    this.tweens.add({
      targets: [this.obj_target],
      yoyo: true,
      repeat: -1,
      scale: 1.75,
      duration: 750
    })

    return;
  }

  /*######## DEFINE COLLISIONS ######### */
  defineCollisions(){

    // player and walls collision
    this.physics.add.collider( this.obj_player, this.tileLayer_walls );

    // zombies
    this.physics.add.collider( this.grp_zombieManager, this.grp_walls );
    // this.physics.add.collider( this.grp_zombieManager, this.grp_zombieManager );

    return;
  }

  /*######## CREATE TOUCH | CLICK INTERACTIONS ######### */
  defineTouchAndClickInteractions(){

    this.input.on(
      "pointerdown", this.__scenePointerDownHandler, this
    )

    return;
  }

  /*######## MOVE PLAYER ######### */
  __movePlayer(){
    // normalize direction vector
    let vector = this.__playerActions.move.normalize();

    this.obj_player.body.setVelocity(
      vector.x * GLB.Player.speed,
      vector.y * GLB.Player.speed
    )

    // change player angle
    if( this.__playerActions.move.length() == 0 ){
      return;
    }

    this.obj_player.setRotation( this.__playerActions.move.angle() );
    // console.log( this.__playerActions.move.angle() );

    return;
  }
  
  /*######## MOVE TARGET ######### */
  __moveTarget(x, y){
    this.obj_target.setPosition( x, y );
    return;
  }

  /*######## DEFINE COLLISIONS ######### */
  /**Incharge of updating all inputs for the game*/
  __InputHandler(){
    // HANDLE PLAYER DIRECTIONS
    this.__playerActions.move.reset();
    // up
    if(
      this.ctrls_keyboard["W"].isDown ||
      this.ctrls_keyboard["UP"].isDown
    ){
      this.__playerActions.move.y -= 1
    }
    // left
    if(
      this.ctrls_keyboard["A"].isDown ||
      this.ctrls_keyboard["LEFT"].isDown
    ){
      this.__playerActions.move.x -= 1
    }
    // down
    if(
      this.ctrls_keyboard["S"].isDown ||
      this.ctrls_keyboard["DOWN"].isDown
    ){
      this.__playerActions.move.y += 1
    }
    // right
    if(
      this.ctrls_keyboard["D"].isDown ||
      this.ctrls_keyboard["RIGHT"].isDown
    ){
      this.__playerActions.move.x += 1
    }

    // call the move player function
    this.__movePlayer();


    return;
  }

  __scenePointerDownHandler( pointer ){
    // move the target to the click location
    this.__moveTarget( pointer.x, pointer.y );

    // clear current navmesh debug
    this.nav_testLevel.debugDrawClear();

    // find path between the player and target
    // and draw it out
    const path = this.nav_testLevel.findPath(
      this.obj_player, this.obj_target
    );
    if( path != null ){
      this.obj_target.setFillStyle( 0xffff00 );
      // console.log( path );
      // this.nav_testLevel.debugDrawPath(path, 0xffd900);
    } else {
      this.obj_target.setFillStyle( 0xff0000 );
    }

    return;
  }

}