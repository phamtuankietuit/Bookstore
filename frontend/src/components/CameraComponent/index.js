import React from 'react';
import Webcam from 'react-webcam';

const CameraComponent = () => {
    const webcamRef = React.useRef(null);

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
            />
            <button onClick={() => console.log(webcamRef.current.getScreenshot())}>
                Capture photo
            </button>
        </div>
    );
};

export default CameraComponent;
