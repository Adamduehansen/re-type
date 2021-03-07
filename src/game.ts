import { makeSprite, t, GameProps } from '@replay/core';
import { WebInputs, RenderCanvasOptions } from '@replay/web';
import { iOSInputs } from '@replay/swift';
import { Menu } from './menu';
import { Level } from './level';

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

type Screens = 'Menu' | 'Level';

type GameState = {
  loaded: boolean;
  screen: Screens;
};

const initialState: GameState = {
  loaded: false,
  screen: 'Menu',
};

export const Game = makeSprite<GameProps, GameState, WebInputs | iOSInputs>({
  init({ updateState, preloadFiles }) {
    preloadFiles({
      audioFileNames: [],
      imageFileNames: [],
    }).then(() => {
      updateState((state) => ({ ...state, loaded: true }));
    });

    return { ...initialState };
  },

  loop({ state }) {
    if (!state.loaded) {
      return {
        ...state,
      };
    } else {
      return {
        ...state,
        loaded: true,
      };
    }
  },

  render({ state, updateState }) {
    if (!state.loaded) {
      return [
        t.text({
          text: 'Loading...',
          color: 'black',
        }),
      ];
    }

    return [
      state.screen === 'Menu'
        ? Menu({
            id: 'Menu',
            startGame: function () {
              updateState((state) => {
                return {
                  ...state,
                  screen: 'Level',
                };
              });
            },
          })
        : null,
      state.screen === 'Level'
        ? Level({
            id: 'Level',
            goToMenu: function () {
              updateState((state) => {
                return {
                  ...state,
                  screen: 'Menu',
                };
              });
            },
          })
        : null,
    ];
  },
});
