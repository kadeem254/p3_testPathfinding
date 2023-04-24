import Phaser from "phaser";
import TestLevel from "./scenes/testLevel";
import * as GLB from "./variables";

export default function StartGame(){
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: GLB.Resolution.width,
    height: GLB.Resolution.height,

    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },

    parent: document.getElementById("game-container"),
    scene: [TestLevel],

    physics: {
      default: "arcade",
      arcade: {
        debug: true
      }
    }
  })

  return game;
}