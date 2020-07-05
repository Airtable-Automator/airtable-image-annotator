import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Text, Box, Heading, Button, SelectButtons} from '@airtable/blocks/ui';

import Picture from './Picture';

import {useSettings, ConfigKeys} from './settings';

/**
 * The task completion state describes the state of the task.
 */
const TaskCompletionStates = Object.freeze({
    /** The round has started, nothing is selected, time has not run out yet. */
    IDLE: 'idle',
    /** The player selected the right option within the time period. */
    SUCCESS: 'success',
    /** The player selected the wrong option, or failed to select an option within the time period. */
    SKIP: 'fail',
});

/**
 * The GameRound component is responsible for showing the options and allowing the player to select an option.
 * It also keeps track of time, when the user fails to pick an option within the time, it's a fail.
 */
export default function GameRound({
    currentRecord,
    currentRecordName,
    numTotal,
    numCompleted,
    roundTimeMs,
    onSuccess,
}) {
    const {isValid, settings, message} = useSettings();
    const [roundState, setRoundState] = useState(TaskCompletionStates.IDLE);
    const isRoundComplete = [TaskCompletionStates.SUCCESS, TaskCompletionStates.SKIP].includes(roundState);

    // Whenever `roundState` changes, we want to wait a second before going to the round or game state.
    // This allows the player to see which option was correct.
    useEffect(() => {
        let timeoutId;
        switch (roundState) {
            case TaskCompletionStates.SUCCESS: {
                timeoutId = setTimeout(() => {
                    onSuccess();
                }, 1000);
                break;
            }
            case TaskCompletionStates.SKIP: {
                timeoutId = setTimeout(() => {
                    onSuccess();
                }, 1000);
                break;
            }
        }

        return () => {
            // It's a best practice to cleanup for unexpected unmounts of the component.
            clearTimeout(timeoutId);
        };

        // `onFail` and `onSuccess` are added as dependencies primarily to please eslint,
        // in practice only `roundState` will trigger the effect hook.
    }, [roundState, onSuccess]);

    const annotationChoices = settings.annotationField.options.choices

    const annotateOptions = annotationChoices.map (choice =>
       ({
           label: choice.name,
           value: choice.name
       })
    );

    const [annotationValue, setAnnotationValue] = useState(null);

    function onSelect() {
        setRoundState(TaskCompletionStates.SUCCESS);
    }

    function onTimeEnd() {
        setRoundState(TaskCompletionStates.SKIP);
    }

    // Sample some fun emojis to make it more amusing.
    let emoji;
    if (isRoundComplete) {
        emoji = _.sample(['😍', '👌', '🤗', '🤙', '🤘', '😎', '👏']);        
    } else {
        emoji = _.sample(['🤔', '🙃', '😅', '🧐', '👀', '🤭', '😕', '😧']);
    }

    const emojiClassNames = ['GameRoundEmoji'];
    if (isRoundComplete) {
        emojiClassNames.push('GameRoundEmoji-isRoundComplete');
    }

    

    return (
        <Box flex="auto" display="flex" flexDirection="column">
            <Box flex="none" textAlign="center" marginTop="4vh" paddingX={4}>
                <span className={emojiClassNames.join(' ')}>{emoji}</span>
                <Heading textAlign="center" marginTop={2}>
                    Please select the correct annotation/label
                </Heading>
                <Box display="flex"
                    alignItems="center"
                    justifyContent="center"
                    padding="24px"
                    >
                    <SelectButtons
                        value={annotationValue}
                        onChange={newValue => setAnnotationValue(newValue)}
                        options={annotateOptions}
                        width="320px"
                    />
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Box paddingRight='10px'>
                        <Button variant="danger" size="large" onClick={onTimeEnd}>Skip Record</Button>
                    </Box>
                    <Box paddingRight='10px'>
                        <Button variant="primary" size="large" onClick={onSelect}>Next Record</Button>
                    </Box>
                </Box>
               
                <div className="ProgressBar">
                    <div
                        className="ProgressBar-fill"
                        style={{
                            animationDuration: `${roundTimeMs}ms`,
                            animationPlayState: isRoundComplete ? 'paused' : 'inherit',
                        }}
                        // For the timer we are simply waiting on the CSS transition to complete.
                        onAnimationEnd={isRoundComplete ? undefined : onTimeEnd}
                    />
                </div>
                <Text>
                    Annotation Progress: {numCompleted} of {numTotal}
                </Text>
                
            </Box>
            
                <div className={`PictureGrid PictureGrid-2-options`}>
                    <Picture
                        key={currentRecord[0].recordId}
                        largePictureUrl={currentRecord[0].largePictureUrl}
                        smallPictureUrl={currentRecord[0].smallPictureUrl}
                    />
                </div>
            
        </Box>
    );
}

GameRound.propTypes = {
    currentRecordName: PropTypes.string.isRequired,
    currentRecord: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            largePictureUrl: PropTypes.string.isRequired,
            smallPictureUrl: PropTypes.string.isRequired,
        }).isRequired,
    ).isRequired,
    numTotal: PropTypes.number.isRequired,
    numCompleted: PropTypes.number.isRequired,
    roundTimeMs: PropTypes.number.isRequired,
    onSuccess: PropTypes.func.isRequired
};
