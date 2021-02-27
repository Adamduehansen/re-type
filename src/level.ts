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
  lettersToWrite: {
    letter: string;
    entered: boolean;
  }[];
}

export const Level = makeSprite<Props, State, WebInputs>({
  init: function ({ device }) {
    return {
      length: 1,
      lettersToWrite: [
        {
          entered: false,
          letter: letters[Math.floor(device.random() * letters.length)],
        },
      ],
    };
  },
  loop: function ({ state, device }) {
    let { lettersToWrite, length } = state;

    if (Object.values(lettersToWrite).every((letter) => letter.entered)) {
      length += 1;
      return {
        length: length,
        lettersToWrite: Array.from(
          {
            length: length,
          },
          () => {
            return {
              entered: false,
              letter: letters[Math.floor(device.random() * letters.length)],
            };
          }
        ),
      };
    } else {
      const nextLetterToType = lettersToWrite
        .filter((letter) => !letter.entered)
        .map((letter) => letter.letter)[0];

      if (device.inputs.keysJustPressed[nextLetterToType]) {
        const indexOfLetter = lettersToWrite.findIndex(
          (letter) => letter.letter === nextLetterToType && !letter.entered
        );
        lettersToWrite = lettersToWrite.map((letterToWrite, index) => {
          if (index !== indexOfLetter) {
            return letterToWrite;
          } else {
            return {
              ...letterToWrite,
              entered: true,
            };
          }
        });
      }

      return {
        length: length,
        lettersToWrite: lettersToWrite,
      };
    }
  },
  render: function ({ state, device }) {
    return [
      ...state.lettersToWrite.map((letterToWrite, index) => {
        return t.text({
          text: letterToWrite.letter,
          color: letterToWrite.entered ? 'green' : 'black',
          x: -7.5 * state.lettersToWrite.length + 15 * index,
          align: 'left',
        });
      }),
      t.text({
        text: state.length.toString(),
        color: 'black',
        align: 'left',
        x: -device.size.width / 2,
        y: device.size.height / 2 - 20,
      }),
    ];
  },
});
