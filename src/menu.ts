import { makeSprite, t } from '@replay/core';
import { WebInputs } from '@replay/web';

interface Props {
  startGame: () => void;
}

export const Menu = makeSprite<Props, undefined, WebInputs>({
  render: function ({ props, device }) {
    if (device.inputs.keysJustPressed[' ']) {
      props.startGame();
    }

    return [
      t.text({
        color: 'black',
        text: 'Press space to start...',
      }),
    ];
  },
});
