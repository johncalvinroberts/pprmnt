import hhmmss from 'hhmmss';
import isObject from './isObject';

const ALL_LEVELS = '*';

const rawLogLevel = process.env.PPRMNT_LOG || ALL_LEVELS;
const logLevel = rawLogLevel.split(',');

const loggerCache = {};

const getSecondsToday = () => {
  const now = new Date();

  // create an object using the current day/month/year
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diff = now - today; // ms difference
  return Math.round(diff / 1000); // make seconds
};

const getTimeStamp = () => {
  const seconds = getSecondsToday();
  const formatted = hhmmss(seconds);
  return [`%c[${formatted}]`, 'color: cyan;'];
};

const getNameSpace = (namespace, color) => [
  `%c[${namespace}]`,
  `color: ${color}; font-weight: bold;`,
];

const logMessageLevels = {
  error: `color: red; font-weight: bold;`,
  info: `color: white;`,
  warn: `color: goldenrod;`,
};

const consoleMethods = {
  warn: 'warn',
  info: 'log',
  error: 'error',
  table: 'table',
};

/* eslint-disable no-console */
const buildLogger = ({ namespace, color }) => {
  const [timestampString, timestampStyle] = getTimeStamp();
  const [namespaceString, namespaceStyle] = getNameSpace(namespace, color);

  const isIncluded =
    logLevel.includes(ALL_LEVELS) || logLevel.includes(namespace);

  // return noop if not included in loglevel
  if (!isIncluded) return () => {};

  const log = (message, logLevel = 'info') => {
    const logMessageStyle = logMessageLevels[logLevel];
    const logMessageString = `%c${message}`;
    let method = consoleMethods[logLevel];
    let logString = [
      `${timestampString}${namespaceString} ${logMessageString}`,
    ];
    let logStyles = [timestampStyle, namespaceStyle, logMessageStyle];

    if (isObject(message)) {
      method = consoleMethods.table;
      logString = [`${timestampString}${namespaceString} %c`, ...logStyles];
      logStyles = [message];
    }

    if (logLevel === 'error') {
      console.error(message);
      console.trace(message.stack);
      message = JSON.stringify(message);
    }

    const logFn = console[method];
    logFn(...logString, ...logStyles);
  };
  loggerCache[namespace] = log;
  return log;
};

export const timer = (label, namespace, color) => {
  const start = new Date();
  const stop = () => {
    const end = new Date();
    const elapsedTime = end - start;
    const [namespaceString, namespaceStyle] = getNameSpace(namespace, color);
    const logString = `⏱ ${namespaceString}: ${elapsedTime}ms`;
    console.timeEnd(logString, namespaceStyle);
  };
  return stop;
};

/* eslint-enable no-console */

export default (namespace, color) => {
  if (loggerCache[namespace]) return loggerCache[namespace];
  return buildLogger({ namespace, color });
};
