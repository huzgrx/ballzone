import { Player } from '@/common/types/player.type';

import { MOVE, PLAYER_SIZE } from '../constants/settings';
import { makePosition } from './makePosition';

export const handlePlayersMovement = (
  players: Map<string, Player>
): Map<string, Player> => {
  players.forEach((player, id) => {
    const { direction, velocityVector, position } = player;

    if (direction.x === 1) {
      velocityVector.x = Math.min(
        velocityVector.x + MOVE.ACCELERATION,
        MOVE.MAX_SPEED
      );
    } else if (direction.x === -1) {
      velocityVector.x = Math.max(
        velocityVector.x - MOVE.ACCELERATION,
        -MOVE.MAX_SPEED
      );
    } else if (velocityVector.x > 0) {
      velocityVector.x = Math.max(velocityVector.x - MOVE.DECELERATION, 0);
    } else if (velocityVector.x < 0) {
      velocityVector.x = Math.min(velocityVector.x + MOVE.DECELERATION, 0);
    }

    if (direction.y === 1) {
      velocityVector.y = Math.min(
        velocityVector.y + MOVE.ACCELERATION,
        MOVE.MAX_SPEED
      );
    } else if (direction.y === -1) {
      velocityVector.y = Math.max(
        velocityVector.y - MOVE.ACCELERATION,
        -MOVE.MAX_SPEED
      );
    } else if (velocityVector.y > 0) {
      velocityVector.y = Math.max(velocityVector.y - MOVE.DECELERATION, 0);
    } else if (velocityVector.y < 0) {
      velocityVector.y = Math.min(velocityVector.y + MOVE.DECELERATION, 0);
    }

    let newPosition = makePosition(
      position.x + velocityVector.x,
      position.y + velocityVector.y
    );

    players.forEach((playerCollision, playerCollisionId) => {
      if (id === playerCollisionId) return;

      const distanceX = newPosition.x - playerCollision.position.x;
      const distanceY = newPosition.y - playerCollision.position.y;
      const length = Math.sqrt(distanceX ** 2 + distanceY ** 2) || 1;

      if (length < PLAYER_SIZE * 2 + 1) {
        const unitX = distanceX / length;
        const unitY = distanceY / length;

        newPosition = makePosition(
          playerCollision.position.x + (PLAYER_SIZE * 2 + 1) * unitX,
          playerCollision.position.y + (PLAYER_SIZE * 2 + 1) * unitY
        );

        players.set(playerCollisionId, {
          ...playerCollision,
          velocityVector: { x: -unitX * 1.2, y: -unitY * 1.2 },
        });
      }
    });

    players.set(id, {
      ...player,
      position: newPosition,
      velocityVector,
    });
  });

  return players;
};
