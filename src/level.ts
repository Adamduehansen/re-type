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
  goToMenu: (score: number) => void;
}

interface State {
  length: number;
  lettersToWrite: {
    letter: string;
    entered: boolean;
  }[];
  totalScore: number;
  currentScore: number;
}

const INITIAL_CURRENT_SCORE = 200;

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
      currentScore: INITIAL_CURRENT_SCORE,
      totalScore: 0,
    };
  },
  loop: function ({ state, props, device }) {
    let { lettersToWrite, length, currentScore, totalScore } = state;

    if (currentScore <= 0) {
      props.goToMenu(state.totalScore);
      return { ...state };
    }

    if (Object.values(lettersToWrite).every((letter) => letter.entered)) {
      length += 1;
      totalScore += currentScore;
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
        totalScore: totalScore,
        currentScore: INITIAL_CURRENT_SCORE,
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
        currentScore += 50;
        if (currentScore > INITIAL_CURRENT_SCORE) {
          currentScore = INITIAL_CURRENT_SCORE;
        }
      } else if (
        Object.keys(device.inputs.keysJustPressed).length > 0 &&
        !device.inputs.keysJustPressed[' ']
      ) {
        props.goToMenu(state.totalScore);
      }

      currentScore -= 1;

      return {
        length: length,
        lettersToWrite: lettersToWrite,
        currentScore: currentScore,
        totalScore: totalScore,
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
      t.rectangle({
        color: 'black',
        height: 10,
        width: device.size.width,
        anchorX: -device.size.width / 2,
        x: -device.size.width / 2,
        scaleX: state.currentScore / INITIAL_CURRENT_SCORE,
        y: -device.size.height / 2,
      }),
      t.text({
        text: state.totalScore.toString(),
        color: 'black',
        align: 'left',
        x: -device.size.width / 2,
        y: device.size.height / 2 - 20,
        scaleX: 0.5,
        scaleY: 0.5,
      }),
      t.text({
        text: state.currentScore.toString(),
        color: 'black',
        align: 'left',
        x: -device.size.width / 2,
        y: device.size.height / 2 - 40,
        scaleX: 0.5,
        scaleY: 0.5,
      }),
    ];
  },
});
