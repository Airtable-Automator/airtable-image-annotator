import React from 'react';
import PropTypes from 'prop-types';

import IdleAnnotationScreen from './IdleAnnotationScreen';

/**
 * The GameCompletedScreen is shown when the user wins or loses the game.
 */
export default function GameCompletedScreen({gameReport, onStartAnnotation, onShowSettings}) {
    const didUserWinTheGame = gameReport.numCompleted === gameReport.numTotal;
    return (
        <IdleAnnotationScreen
            emoji={didUserWinTheGame ? '🏆' : '💀'}
            title={didUserWinTheGame ? '🎉 Game completed! 🎉' : '🙁 Game over! 🙁'}
            text={
                didUserWinTheGame
                    ? `Congrats, you recognized all ${gameReport.numTotal} people!`
                    : `You recognized ${gameReport.numCompleted} out of ${gameReport.numTotal} people`
            }
            buttonLabel={didUserWinTheGame ? 'Go again' : 'Try again'}
            onStartAnnotation={onStartAnnotation}
            onShowSettings={onShowSettings}
        />
    );
}

GameCompletedScreen.propTypes = {
    gameReport: PropTypes.shape({
        numCompleted: PropTypes.number.isRequired,
        numTotal: PropTypes.number.isRequired,
    }).isRequired,
    onStartAnnotation: PropTypes.func.isRequired,
    onShowSettings: PropTypes.func.isRequired,
};
