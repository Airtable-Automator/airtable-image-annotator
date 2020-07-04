import React, {useState} from 'react';
import {viewport, runInfo} from '@airtable/blocks';
import {initializeBlock} from '@airtable/blocks/ui';

import SettingsForm from './SettingsForm';
import HomeScreen from './HomeScreen';
import AnnotationCompletedScreen from './AnnotationCompletedScreen';
import Annotation from './Annotation';
import loadCSS from './loadCSS';

// Load all the CSS used in our block.
loadCSS();

// Determines the minimum size the block needs before it asks the user to enlarge the block.
viewport.addMinSize({
    height: 520,
    width: 600,
});

// Determines the maximum size of the block in fullscreen mode.
viewport.addMaxFullscreenSize({
    height: 740,
    width: 800,
});

/**
 * The game state determines what screen to render.
 */
const AnnotationStates = Object.freeze({
    /**
     * The player is configuring settings to be able to play the game.
     * If the game is configured, other users will see the home screen instead.
     */
    CONFIGURING_SETTINGS: 'configuringSettings',
    /**
     * The player is viewing the home screen and is able to start the game,
     * or when settings are invalid update the settings.
     */
    HOME_SCREEN: 'homeScreen',
    /**
     * The player is playing the game, any update in settings or any update to settings,
     * the records or the base, will not interrupt the game.
     */
    PLAYING: 'playing',
    /**
     * The player completed the game, they either picked all correctly and won the game, or failed.
     * They can go again or update the settings.
     */
    ANNOTATION_COMPLETED: 'gameCompleted',
});

/**
 * The name trainer block is a game that shows a single name for multiple pictures.
 * Each round the player needs to select the matching picture for the name within the time limit.
 *
 * This component handles all of the game lifecycle and renders a component based on the state of the game.
 */
function ImageAnnotationBlock() {
    const [annotationData, setAnnotationData] = useState({
        // On first run of the block show the settings screen.
        annotationState: runInfo.isFirstRun ? AnnotationStates.CONFIGURING_SETTINGS : AnnotationStates.HOME_SCREEN,
        // The game report will be populated when a game ends. It is used by the `GameCompletedScreen`.
        annotationReport: null,
        // The list of names with pictures the game will use.
        listOfNamesWithPictures: null,
    });

    const {annotationState, annotationReport, listOfNamesWithPictures} = annotationData;

    /**
     * Start the game with a list of names with pictures.
     *
     * @param {Array<{recordId: string, name: string, largePictureUrl: string, smallPictureUrl: string}>} listOfNamesWithPictures
     */
    function startAnnotation(listOfNamesWithPictures) {
        // Enter the block in fullscreen to have more real estate for annotation.
        viewport.enterFullscreenIfPossible();
        setAnnotationData({
            annotationState: AnnotationStates.PLAYING,
            annotationReport: null,
            listOfNamesWithPictures,
        });
    }

    function annotationCompleted(newAnnotationReport) {
        setAnnotationData({
            annotationState: AnnotationStates.ANNOTATION_COMPLETED,
            annotationReport: newAnnotationReport,
            listOfNamesWithPictures: null,
        });
    }

    function showSettings() {
        setAnnotationData({
            annotationState: AnnotationStates.CONFIGURING_SETTINGS,
            annotationReport: null,
            listOfNamesWithPictures: null,
        });
    }

    function showHomeScreen() {
        setAnnotationData({
            annotationState: AnnotationStates.HOME_SCREEN,
            annotationReport: null,
            listOfNamesWithPictures: null,
        });
    }

    switch (annotationState) {
        case AnnotationStates.CONFIGURING_SETTINGS:
            return <SettingsForm onDone={showHomeScreen} />;
        case AnnotationStates.PLAYING:
            return (
                <Annotation
                    listOfNamesWithPictures={listOfNamesWithPictures}
                    onComplete={annotationCompleted}
                />
            );
        case AnnotationStates.HOME_SCREEN:
            return <HomeScreen onStartAnnotation={startAnnotation} onShowSettings={showSettings} />;
        case AnnotationStates.ANNOTATION_COMPLETED:
            return (
                <AnnotationCompletedScreen
                    annotationReport={annotationReport}
                    onStartAnnotation={startAnnotation}
                    onShowSettings={showSettings}
                />
            );
        default:
            throw new Error('Unexpected state: ', annotationState);
    }
}

initializeBlock(() => <ImageAnnotationBlock />);
