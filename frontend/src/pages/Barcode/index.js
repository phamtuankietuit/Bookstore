import React from "react";
import classNames from "classnames/bind";
import styles from './Barcode.module.scss';
import Html5QrcodePlugin from "~/pages/Html5QrCodePlugin";

const cx = classNames.bind(styles);

class Barcode extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scannedText: "",
            scannedResult: ""
        };

        this.onNewScanResult = this.onNewScanResult.bind(this);
    }

    render() {
        const { scannedText, scannedResult } = this.state;
        return (
            <div className={cx('wrapper')}>
                {/* <h1>Html5Qrcode React example!</h1> */}
                <Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={this.onNewScanResult}
                />
            </div>
        );
    }

    onNewScanResult(decodedText, decodedResult) {
        this.setState({
            scannedText: decodedText,
            scannedResult: JSON.stringify(decodedResult)
        });
    }
}

export default Barcode;
