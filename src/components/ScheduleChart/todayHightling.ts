import React from 'react'

const isSameUTCDate = (date: Date, now: Date): boolean => {
    return date.getUTCFullYear() === now.getUTCFullYear() &&
        date.getUTCMonth() === now.getUTCMonth() &&
        date.getUTCDate() === now.getUTCDate()
};

export default isSameUTCDate;
