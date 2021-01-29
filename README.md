### TODO

- Add testing page & update createWorld() to make use of this
  - Test different ball angle collisions
  - Setup canvas like actual game
    - Paddle bound to zone
    - Scoring Zone
    - Scoreboard
- Fix Ball Speed
  - Find good ball speed for gameplay
  - Add speed property to ball and change vx, vy to direction vector
- Change ballBounce() to bounce balls more realistically
  - Ensure infinite ball stuck scenarios can't happen
  - Ball bounces are effected by Paddle movement

- Solo version where I bounce against wall
- Two player local
- Arbitrary number of player field generation
- Draw from center of canvas/window versus top left(?)
- Look into canvas scaling with window
- Add color property to game object constructor
- Expose color changing for all classes 
- BUG with shallow angle bounce (probably because of variable framerate)
