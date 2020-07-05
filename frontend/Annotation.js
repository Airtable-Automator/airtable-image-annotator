import React, {useState} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AnnotationTask from './AnnotationTask';
import FullScreenBox from './FullScreenBox';
import {useSettings, ConfigKeys} from './settings';

/**
 * The Annotation component is responsible for the annotation lifecycle.
 */
export default function Annotation({listOfNamesWithPictures, onComplete}) {
    const [completed, setCompleted] = useState([]);

    const {isValid, settings, message} = useSettings();

    function updateAnnotationField(record) {
        settings.table.updateRecordAsync(
            record.recordId, {[settings.annotationField.id]: {name : "Cat"}} 
        );  
    };
    
    
    
    // Go to the next task.
    function nextTask(currentRecord) {
        const newCompleted = [...completed, currentRecord];
        
        updateAnnotationField(currentRecord);

        if (newCompleted.length === listOfNamesWithPictures.length) {
            // All annotations are complete.
            onComplete({
                numTotal: listOfNamesWithPictures.length,
                numCompleted: newCompleted.length,
            });
        } else {
            // There are more annotatins. Next annotation task will be shown.
            setCompleted(newCompleted);
        }
    }

    // First, get the records that have not been completed yet.
    const notCompleted = _.differenceBy(listOfNamesWithPictures, completed, 'recordId');

    // Next, determine the current record by random.
    const currentRecord = _.sample(notCompleted);

    const roundTimeMs = 100000;

    return (
        <FullScreenBox display="flex">
            <AnnotationTask
                // We use a key here to make the component re-mount each round.
                // This is simpler than resetting state within the component.
                key={currentRecord.recordId}
                currentRecord={[currentRecord]}
                currentRecordName={currentRecord.name}
                roundTimeMs={roundTimeMs}
                numCompleted={completed.length}
                numTotal={listOfNamesWithPictures.length}
                onSuccess={() => nextTask(currentRecord)}
            />
        </FullScreenBox>
    );
}

Annotation.propTypes = {
    listOfNamesWithPictures: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            largePictureUrl: PropTypes.string.isRequired,
            smallPictureUrl: PropTypes.string.isRequired,
        }).isRequired,
    ).isRequired,
    onComplete: PropTypes.func.isRequired,
};
