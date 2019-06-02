import { Exclude, Expose, Type } from 'class-transformer';
import { GameObject } from './game-object';

@Exclude()
export class GameScene {
  @Expose()
  public name: string;
  @Expose()
  @Type(() => GameObject)
  public gameObjects: GameObject[];

  constructor(name: string, gameObjects) {
  	this.name = name;
  	this.gameObjects = gameObjects;
  }
}
