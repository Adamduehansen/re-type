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

interface Props {
  goToMenu: () => void;
}

interface State {
  length: number;
  lettersToWrite: { [x: string]: boolean };
}

export const Level = makeSprite<Props, State, WebInputs>({
  init: function ({ device }) {
    return {
      length: 1,
      lettersToWrite: {
        [letters[Math.floor(device.random() * letters.length)]]: false,
      },
    };
  },
  loop: function ({ state, device }) {
    let { lettersToWrite, length } = state;

    if (Object.values(lettersToWrite).every(Boolean)) {
      length += 1;
      const nextLetters = Array.from(
        {
          length: length,
        },
        () => {
          return [letters[Math.floor(device.random() * letters.length)], false];
        }
      );

      return {
        length: length,
        lettersToWrite: Object.fromEntries(nextLetters),
      };
    } else {
      const nextLetterToType = Object.entries(lettersToWrite).map(
        (letter) => letter[0]
      )[0];

      if (device.inputs.keysJustPressed[nextLetterToType]) {
        lettersToWrite = { ...lettersToWrite, [nextLetterToType]: true };
      }

      return {
        length: length,
        lettersToWrite: lettersToWrite,
      };
    }
  },
  render: function ({ state }) {
    return [
      t.text({
        text: Object.keys(state.lettersToWrite).join(''),
        color: 'black',
      }),
    ];
  },
});
