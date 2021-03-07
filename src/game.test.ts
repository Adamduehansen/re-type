import { testSprite } from '@replay/test';
import { WebInputs } from '@replay/web';
import { randomBytes } from 'crypto';
import { Game, gameProps } from './game';
import { Level } from './level';

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

        // Assert
        expect(getByText(letter)).toHaveLength(1);
      }
    );

    test('should transit from first level to next level', async () => {
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

      setRandomNumbers([0.43, 0.47, 0.63]);

      // Act
      await loadFiles();
      nextFrame();
      startNewGame(updateInputs, nextFrame);
      nextFrame();

      updateInputs({
        ...initialInputs,
        keysJustPressed: {
          ['l']: true,
        },
      });

      nextFrame(); // Wait for key input.
      nextFrame(); // Wait for new letters to be generated.

      // Assert
      expect(getByText('m')).toHaveLength(1);
      expect(getByText('q')).toHaveLength(1);
    });

    test('should transit from second level to third level', async () => {
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

      setRandomNumbers([0.43, 0.47, 0.63]);

      // Act
      await loadFiles();
      nextFrame();
      startNewGame(updateInputs, nextFrame);
      nextFrame();

      updateInputs({
        ...initialInputs,
        keysJustPressed: {
          ['l']: true,
        },
      });

      nextFrame(); // Execute key input
      nextFrame(); // Wait for new letters to be generated.

      updateInputs({
        ...initialInputs,
        keysJustPressed: {
          ['m']: true,
        },
      });

      nextFrame(); // Execute key input

      updateInputs({
        ...initialInputs,
        keysJustPressed: {
          ['q']: true,
        },
      });

      nextFrame(); // Execute key input
      nextFrame(); // Wait for new letters to be generated.

      // Assert
      expect(getByText('l')).toHaveLength(1);
      expect(getByText('m')).toHaveLength(1);
      expect(getByText('q')).toHaveLength(1);
    });

    test('should color entered letter green', async () => {
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

      setRandomNumbers([0.43, 0.47, 0.63]);

      // Act
      await loadFiles();
      nextFrame();
      startNewGame(updateInputs, nextFrame);
      nextFrame();

      updateInputs({
        ...initialInputs,
        keysJustPressed: {
          ['l']: true,
        },
      });

      nextFrame(); // Execute key input
      nextFrame(); // Wait for new letters to be generated.

      updateInputs({
        ...initialInputs,
        keysJustPressed: {
          ['m']: true,
        },
      });

      nextFrame(); // Execute key input

      // Assert
      expect(getByText('m')[0].props.color).toEqual('green');
    });

    test('should only color first letter of multiple of same', async () => {
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

      setRandomNumbers([0.43, 0.43, 0.43]);

      // Act
      await loadFiles();
      nextFrame();
      startNewGame(updateInputs, nextFrame);
      nextFrame();

      updateInputs({
        ...initialInputs,
        keysJustPressed: {
          ['l']: true,
        },
      });

      nextFrame(); // Execute key input
      nextFrame(); // Wait for new letters to be generated.

      updateInputs({
        ...initialInputs,
        keysJustPressed: {
          ['l']: true,
        },
      });

      nextFrame(); // Execute key input

      // Assert
      expect(
        getByText('l').filter((texture) => texture.props.color === 'green')
      ).toHaveLength(1);
    });

    test('should do not trigger goToMenu prop when no keys are pressed', async () => {
      // Arrange
      const mockGameOver = jest.fn();
      const { nextFrame, updateInputs, setRandomNumbers } = testSprite(
        Level({
          goToMenu: mockGameOver,
          id: 'Level',
        }),
        gameProps,
        {
          initInputs: initialInputs,
        }
      );

      setRandomNumbers([0.43]);

      // Act

      updateInputs({
        ...initialInputs,
        keysJustPressed: {
          ['e']: true,
        },
      });
      nextFrame();

      // Assert
      expect(mockGameOver).toBeCalledTimes(1);
    });

    test('should game over when player pressed the wrong letter', async () => {
      const mockGameOver = jest.fn();
      const { nextFrame, setRandomNumbers } = testSprite(
        Level({
          goToMenu: mockGameOver,
          id: 'Level',
        }),
        gameProps,
        {
          initInputs: initialInputs,
        }
      );

      setRandomNumbers([0.43]);

      // Act
      nextFrame();

      // Assert
      expect(mockGameOver).not.toBeCalledTimes(1);
    });
  });
});
