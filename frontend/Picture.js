import React from 'react';
import PropTypes from 'prop-types';

export default function Picture({
    largePictureUrl,
    smallPictureUrl,
}) {
    const classNames = ['Picture'];
    // classNames.push('Picture-isRoundComplete');
    // classNames.push('Picture-winner');
    // classNames.push('Picture-pickedSucessfully')    
    return (
        <div
            className={classNames.join(' ')}
            style={{
                // Use multiple background URLs to provide a quick loading fallback to make the game playable on poor connection.
                backgroundImage: `url("${largePictureUrl}"), url("${smallPictureUrl}")`,
            }}
        />
    );
}

Picture.propTypes = {
    largePictureUrl: PropTypes.string.isRequired,
    smallPictureUrl: PropTypes.string.isRequired,
};
