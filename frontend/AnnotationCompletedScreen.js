import React from 'react';
import PropTypes from 'prop-types';

import IdleAnnotationScreen from './IdleAnnotationScreen';

/**
 * The AnnotationCompletedScreen is shown when the user completes all the annotations.
 */
export default function AnnotationCompletedScreen({annotationReport, onStartAnnotation, onShowSettings}) {
    return (
        <IdleAnnotationScreen
            emoji={'🏆'}
            title={'🎉 Annotation Completed! 🎉'}
            text={
                `You completed ${annotationReport.numCompleted} out of ${annotationReport.numTotal} annotations`
            }
            buttonLabel={'Review your annotations'}
            onStartAnnotation={onStartAnnotation}
            onShowSettings={onShowSettings}
        />
    );
}

AnnotationCompletedScreen.propTypes = {
    annotationReport: PropTypes.shape({
        numCompleted: PropTypes.number.isRequired,
        numTotal: PropTypes.number.isRequired,
    }).isRequired,
    onStartAnnotation: PropTypes.func.isRequired,
    onShowSettings: PropTypes.func.isRequired,
};
