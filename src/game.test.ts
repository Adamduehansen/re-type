import { testSprite } from '@replay/test';
import { Game, gameProps } from './game';

describe('game', () => {
  test('should show loading screen while assets are loaded', async () => {
    // Arrange
    const { getByText, nextFrame } = testSprite(Game(gameProps), gameProps);

    // Act
    nextFrame();

    // Assert
    expect(getByText('loading')).toHaveLength(1);
  });

  describe('menu', () => {
    test('should show menu when files are loaded', async () => {
      // Arrange
      const { loadFiles, nextFrame, getByText } = testSprite(
        Game(gameProps),
        gameProps
      );
      // Act
      await loadFiles();
      nextFrame();

      // Assert
      expect(getByText('Press space to start...')).toHaveLength(1);
    });
  });
});

// import { testSprite } from '@replay/test';
// import { Game, gameProps } from './game';

// const initialInputs = {
//   pointer: {
//     justPressed: false,
//     justReleased: false,
//     x: 0,
//     y: 0,
//     pressed: false,
//     numberPressed: 0,
//   },
//   keysDown: {},
//   keysJustPressed: {},
// };

// describe('Game', () => {
//   // test('should show loading screen while loading assets', () => {
//   //   // Arrange
//   //   const { getByText, nextFrame } = testSprite(Game(gameProps), gameProps);

//   //   // Act
//   //   nextFrame();

//   //   // Assert
//   //   expect(getByText('loading')).toHaveLength(1);
//   // });

//   // test('should show menu when files are loaded', async () => {
//   //   // Arrange
//   //   const { nextFrame, getByText, loadFiles } = testSprite(
//   //     Game(gameProps),
//   //     gameProps
//   //   );

//   //   // Act
//   //   await loadFiles();
//   //   nextFrame();

//   //   // Assert
//   //   expect(getByText('Press space to start')).toHaveLength(1);
//   // });

//   // test.each([[0.63, 'i']])(
//   //   'should choose random letter at first round',
//   //   async (randomNumber: number, expectedLetter: string) => {
//   //     // Arrange
//   //     const {
//   //       setRandomNumbers,
//   //       nextFrame,
//   //       getByText,
//   //       loadFiles,
//   //       updateInputs,
//   //     } = testSprite(Game(gameProps), gameProps);

//   //     setRandomNumbers([randomNumber]);

//   //     // Act
//   //     await loadFiles();
//   //     nextFrame();

//   //     updateInputs({ ...initialInputs, keysJustPressed: { ' ': true } });

//   //     // Assert
//   //     expect(getByText(expectedLetter)).toHaveLength(1);
//   //   }
//   // );

//   // test.skip('should complete level when the word i entered', async () => {
//   //   // Arrange
//   //   const { setRandomNumbers, loadFiles, nextFrame } = testSprite(
//   //     Game(gameProps),
//   //     gameProps
//   //   );

//   //   // 0.63 ensures that 'i' is chosen as the random character.
//   //   setRandomNumbers([0.63]);

//   //   // Act
//   //   await loadFiles();
//   //   nextFrame();

//   //   // Assert
//   // });
// });
