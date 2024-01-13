export const ConvertISO = (dateCreated) => {
    const splitDate = dateCreated.split(' – ');

    if (splitDate[0] === splitDate[1] || splitDate.length === 1) {
        const dateParts = splitDate[0].split('/');

        const startDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]), 0, 0, 0, 1);
        const endDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]), 23, 59, 59, 999);

        // console.log('START', startDate);
        // console.log('END', endDate);

        return {
            startDate: toIsoString(startDate),
            endDate: toIsoString(endDate),
        };

    } else {
        const startDateParts = splitDate[0].split('/');
        const endDateParts = splitDate[1].split('/');

        const startDate = new Date(Number(startDateParts[2]), Number(startDateParts[1]) - 1, Number(startDateParts[0]));
        const endDate = new Date(Number(endDateParts[2]), Number(endDateParts[1]) - 1, Number(endDateParts[0]), 23, 59, 59, 999);

        // console.log('START', startDate);
        // console.log('END', endDate);

        return {
            startDate: toIsoString(startDate),
            endDate: toIsoString(endDate),
        };
    }
}

function toIsoString(date) {
    const pad = function (num) {
        return (num < 10 ? '0' : '') + num;
    };

    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(0) +
        ':' + pad(0) +
        ':' + pad(0) + 'Z';
}
