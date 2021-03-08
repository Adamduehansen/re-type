import { makeSprite, t } from '@replay/core';
import { WebInputs } from '@replay/web';

interface Props {
  startGame: () => void;
  highScore: number;
}

export const Menu = makeSprite<Props, undefined, WebInputs>({
  render: function ({ props, device }) {
    if (device.inputs.keysJustPressed[' ']) {
      props.startGame();
    }

    return [
      t.text({
        text: 'Re-Type',
        color: 'black',
        y: device.size.height / 2 - 50,
        scaleX: 1.5,
        scaleY: 1.5,
      }),
      t.text({
        color: 'black',
        text: 'Press space to start...',
      }),
      t.text({
        color: 'black',
        text: `High Score: ${props.highScore}`,
        y: 50,
        scaleX: 0.5,
        scaleY: 0.5,
      }),
    ];
  },
});
