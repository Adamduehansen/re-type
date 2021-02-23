import { makeSprite, t } from '@replay/core';

export const Menu = makeSprite({
  render: function () {
    return [
      t.text({
        color: 'black',
        text: 'Press space to start...',
      }),
    ];
  },
});
