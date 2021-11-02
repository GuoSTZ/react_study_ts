import React from 'react';

let defaultPrefix: string = 'guos-react';

let viewPrefix: string = '';

const setPrefix = (customPrefix?: string) => {
  viewPrefix = customPrefix || defaultPrefix;
}
setPrefix();

export {viewPrefix};
