import classNames from "classnames/bind";
import styles from './ChartComp.module.scss';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line, Bar, Chart } from 'react-chartjs-2';


defaults.maintainAspectRatio = false;
defaults.responsive = true;

const cx = classNames.bind(styles);

function ChartComp({ type, labels, datasets, options }) {
    let Comp = Bar;

    if (type === 'line') {
        Comp = Line;
    }

    return (
        <Comp
            data={{
                labels: labels,
                datasets: datasets,
            }}
            options={options}
        />
    );
}

export default ChartComp;