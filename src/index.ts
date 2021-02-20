import { makeSprite, t, GameProps } from '@replay/core';
import { WebInputs, RenderCanvasOptions } from '@replay/web';
import { iOSInputs } from '@replay/swift';

export const options: RenderCanvasOptions = {
  dimensions: 'scale-up',
};

export const gameProps: GameProps = {
  id: 'Game',
  size: {
    landscape: {
      width: 600,
      height: 400,
      maxWidthMargin: 150,
    },
    portrait: {
      width: 400,
      height: 600,
      maxHeightMargin: 150,
    },
  },
  defaultFont: {
    name: 'Courier',
    size: 26,
  },
};

type GameState = {
  loaded: boolean;
};

export const Game = makeSprite<GameProps, GameState, WebInputs | iOSInputs>({
  init({ updateState, preloadFiles }) {
    preloadFiles({
      audioFileNames: ['boop.wav'],
      imageFileNames: ['icon.png'],
    }).then(() => {
      updateState((state) => ({ ...state, loaded: true }));
    });

    return {
      loaded: false,
    };
  },

  loop({ state }) {
    if (!state.loaded) {
      return {
        loaded: false,
      };
    }

    return {
      loaded: true,
    };
  },

  render({ state, device }) {
    if (!state.loaded) {
      return [
        t.text({
          text: 'Loading...',
          color: 'black',
        }),
      ];
    }

    return [
      t.text({
        color: 'black',
        text: 'sample',
      }),
    ];
  },
});
