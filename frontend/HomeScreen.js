import React from 'react';
import PropTypes from 'prop-types';

import IdleAnnotationScreen from './IdleAnnotationScreen';

/**
 * The HomeScreen is shown when the settings are valid and the player can start the game.
 */
export default function HomeScreen({onStartAnnotation, onShowSettings}) {
    return (
        <IdleAnnotationScreen
            emoji="👁 👁"
            title="Welcome to the Image Annotation block"
            text="Each task will show you an image, select the annotation/label that corresponds to the image!"
            buttonLabel="Start Annotation"
            onStartAnnotation={onStartAnnotation}
            onShowSettings={onShowSettings}
        />
    );
}

HomeScreen.propTypes = {
    onStartAnnotation: PropTypes.func.isRequired,
    onShowSettings: PropTypes.func.isRequired,
};
