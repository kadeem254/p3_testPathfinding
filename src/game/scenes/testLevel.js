import Phaser from "phaser";
import * as GLB from "../variables";

// assets to preload
import img_tilesheet from "../assets/tilesheet_complete.png";
import json_testLevelMap from "../assets/testLevel.json";

export default class TestLevel extends Phaser.Scene{
  constructor(){
    super( GLB.SceneKeys.testLevel );
  }

  preload(){
    this.load.image( GLB.TextureKeys.tileset, img_tilesheet );
    this.load.tilemapTiledJSON( GLB.TilemapKeys.testLevel, json_testLevelMap  );
  }

  create(){
    // ABSTRACT LAYERS
    this.createControls();

    // VISUAL LAYERS
    this.createTilemap();
    this.createNavmesh();
    this.createPlayer();
    this.createTestObject();

    // INTERACTIONS
    this.defineCollisions();
    this.defineTouchAndClickInteractions();

    return;
  }

  update(){
    this.__InputHandler();
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
    this.obj_player = this.add.circle(
      32, 32, 16, 0xff6400
    );
    this.physics.world.enableBody( this.obj_player );
    this.obj_player.body.setCircle( 16 )

    // create motion controls for player
    this.__playerActions = {
      move: new Phaser.Math.Vector2( 0, 0 ),
      shoot: 0
    }

    return;
  }

  /*######## CREATE NAVMESH ######### */
  /**Create the navmesh using the tilemap */
  createNavmesh(){

    let drawMesh = true;
    let spacing = 10;

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
  createTestObject(){
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
      this.nav_testLevel.debugDrawPath(path, 0xffd900);
    }


    return;
  }

}