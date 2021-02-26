import { makeSprite, t } from '@replay/core';
import { WebInputs } from '@replay/web';

const letters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

interface Letter {
  letter: string;
  entered: boolean;
}

interface Props {
  goToMenu: () => void;
}

interface State {
  lettersToWrite: Letter[];
}

export const Level = makeSprite<Props, State, WebInputs>({
  init: function () {
    return {
      lettersToWrite: [],
    };
  },
  loop: function ({ state, device }) {
    let { lettersToWrite } = state;

    if (lettersToWrite.length === 0) {
      lettersToWrite = [
        {
          entered: false,
          letter: letters[Math.floor(device.random() * letters.length)],
        },
      ];
    }

    return {
      lettersToWrite: lettersToWrite,
    };
  },
  render: function ({ state }) {
    return [
      t.text({
        text: state.lettersToWrite.map(({ letter }) => letter).join(),
        color: 'black',
      }),
    ];
  },
});
