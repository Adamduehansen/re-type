import { testSprite } from '@replay/test';
import { WebInputs } from '@replay/web';
import { Game, gameProps } from './game';

const initialInputs: WebInputs = {
  keysDown: {},
  keysJustPressed: {},
  pointer: {
    pressed: false,
    numberPressed: 0,
    justPressed: false,
    justReleased: false,
    x: 0,
    y: 0,
  },
};

const startNewGame = function (
  updateInputs: (newInputs: WebInputs) => void,
  nextFrame: () => void
) {
  updateInputs({ ...initialInputs, keysJustPressed: { ' ': true } });
  nextFrame();
  nextFrame();
};

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
        gameProps,
        {
          initInputs: initialInputs,
        }
      );

      // Act
      await loadFiles();
      nextFrame();

      // Assert
      expect(getByText('Press space to start...')).toHaveLength(1);
    });

    test('should transit to level screen when space is pressed', async () => {
      // Arrange
      const { loadFiles, nextFrame, getByText, updateInputs } = testSprite(
        Game(gameProps),
        gameProps,
        {
          initInputs: initialInputs,
        }
      );

      // Act
      await loadFiles();
      nextFrame();
      startNewGame(updateInputs, nextFrame);

      // Assert
      expect(getByText('Press space to start...')).toHaveLength(0);
    });
  });

  describe('level', () => {
    test.each([
      [0.63, 'q'],
      [0.5, 'n'],
    ])(
      'should chose random letter when game starts (%d, %s)',
      async (randomNumber: number, letter: string) => {
        // Arrange
        const {
          loadFiles,
          nextFrame,
          getByText,
          updateInputs,
          setRandomNumbers,
        } = testSprite(Game(gameProps), gameProps, {
          initInputs: initialInputs,
        });

        setRandomNumbers([randomNumber]);

        // Act
        await loadFiles();
        nextFrame();
        startNewGame(updateInputs, nextFrame);
        nextFrame();

        const text = getByText(letter);

        // Assert
        expect(text).toHaveLength(1);
      }
    );
  });
});
