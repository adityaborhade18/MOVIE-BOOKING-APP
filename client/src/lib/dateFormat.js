const dateFormat = (dateValue) => {
    const date = new Date(dateValue);
    const localDate = date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
    return localDate;
};


export default dateFormat;