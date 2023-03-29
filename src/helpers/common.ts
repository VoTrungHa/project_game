import confirm from 'antd/lib/modal/confirm';
import { LANGUAGES } from 'constants/language';
import { ROLE_TYPE } from 'constants/role';
import { createBrowserHistory } from 'history';
import moment, { Moment } from 'moment';
import { parse, stringify } from 'query-string';
import { EventValue } from 'rc-picker/lib/interface';
import { RouteProps } from 'react-router-dom';

export const parseParamToObject = (searchString: string) => parse(searchString);
export const parseObjectToParam = (object: Record<string, any>) => stringify(object);
export const parseArrayToStringWithComma = (array: string[]) => array.join(',');
export const parseStringWithCommaToArray = (str: string) => str.split(',');
export const parseStringWithCommaToObject = (str: string) => {
  const keys = str.split(',');
  return keys.reduce((acc, cur) => {
    acc[cur] = true;
    return acc;
  }, {});
};
export const removeLeadingZero = (value: string) => {
  const temp = value.replace(/^0+/gi, '').replace(/\D/gi, '');
  return Number(temp);
};

export const isEditable = (requiredRoleToEdit: Array<ROLE_TYPE>, currentRole?: ROLE_TYPE) => {
  if (currentRole) return requiredRoleToEdit.includes(currentRole);
  return false;
};

export const convertToVNDC = (amount?: number | string, rate?: number | string) => {
  if (amount && rate) {
    return (Number(amount) * Number(rate)).toFixed();
  } else {
    return amount;
  }
};

export const convertToNumber = (value: string) => parseFloat(value).toFixed(7);

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  maximumFractionDigits: 7,
});

export const history = createBrowserHistory();

/**
 * Base props for pages defined.
 */
export type BasePageProps = RouteProps;

export const getLanguageSupport = () => defaultLanguage;

export const getQueryString = (key) => {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  return params.get(key);
};

export const mapQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => searchParams.append(key, params[key]));

  return searchParams.toString();
};

export const redirectTo = (path) => history.push(path);

export const isNullOrEmpty = (str): boolean => {
  let returnValue = false;
  if (!str || str === 'null' || str === '' || str === '{}' || str === 'undefined' || str.length === 0) {
    returnValue = true;
  }
  return returnValue;
};

export const logData = (title, ...args) => {
  try {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log(
        `%c ${isNullOrEmpty(title) ? 'LOGGER DEVELOP' : title}`,
        'display:block;background:#fff;color:red;width:100%;text-align:center;font-weight:bold;font-size:12px;margin:12px auto 0 auto;padding:4px 12px;border-radius:2px',
      );
      // console.log('Arguments')
      console.group('Arguments');
      if (args) {
        args.forEach((item) => console.log(item));
        console.groupEnd();
      }
    }
  } catch (err) {
  } finally {
    console.groupEnd();
  }
};

const defaultLanguage = 'en';
const getCurrentLanguage = (): LanguageCulture => {
  const _lang = localStorage.getItem('lang') || defaultLanguage;
  const _def = LANGUAGES.filter((t) => t.code === _lang);
  if (_def.length > 0) return _def[0];
  return LANGUAGES[0];
};

const generateSelect = (role: number) => {
  const temp: number[] = [];
  for (let i = 1; i < 5; i++) {
    if (role <= i) {
      temp.push(i);
    }
  }
  return temp;
};

const downloadCSV = (file: string, filemame: string) => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const link = document.createElement('a');
    const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
    link.href = window.URL.createObjectURL(new Blob([BOM, file]));
    link.setAttribute('download', filemame);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

const showConfirm = ({ title, onOk, okText, onCancel, content, cancelText, icon }: IConfirmOptions) => {
  confirm({
    title: title,
    ...(content && { content }),
    okText: okText,
    cancelText: cancelText,
    icon,
    width: 594,
    onOk() {
      onOk && onOk();
    },
    onCancel() {
      onCancel && onCancel();
    },
  });
};

const REGREX_NUMBER = /^[0-9]*$/;

const formatDate = (value?: number | string | Moment, type?: string) => {
  if (value) {
    return moment(value).format(type);
  } else {
    return moment().format(type);
  }
};

const parseTime = (value?: string | number | Moment, type?: string) => moment.unix(Number(value) / 1000).format(type);
const parseUnixDateNow = () => moment().unix();
const parseUnix = (value: string | number | Moment | EventValue<Moment>) => moment(value).unix();
const parseGetUnixTimeValue = (value: string | number | Moment | EventValue<Moment>) =>
  moment(Number(value)).unix() * 1000;
const parseGetUnixTime = () => moment().unix() * 1000;
const parseUnixTime = (value: string | number | Moment | EventValue<Moment>) => moment(Number(value)).unix();
const parseUnixTimeValueToStartOfMonth = (value: string | number | Moment | EventValue<Moment>) =>
  moment(Number(value)).startOf('month').unix() * 1000;
const parseUnixTimeToStartOfMonth = () => moment().startOf('month').unix() * 1000;
const parseUnixTimeValueToEndOfMonth = (value: string | number | Moment | EventValue<Moment>) =>
  moment(Number(value)).endOf('month').unix() * 1000;
const parseUnixTimeToEndOfMonth = () => moment().endOf('month').unix() * 1000;
const parseUnixTimeValueToStartOfDay = (value: string | number | Moment | EventValue<Moment>) =>
  moment(value).startOf('day').unix() * 1000;
const parseUnixTimeValueToEndOfDay = (value: string | number | Moment | EventValue<Moment>) =>
  moment(value).endOf('day').unix() * 1000;
const parseUnixTimeSubtractCountDays = (value: number) => moment().subtract(value, 'days').unix() * 1000;
const parseGetUnixTimeValueAddMinutes = (value: string | number | Moment | EventValue<Moment>, minitues: number) =>
  moment(Number(value)).add(minitues, 'minutes').unix() * 1000;
const parseUnixTimeValueToStartOfYear = (value: string | number | Moment | EventValue<Moment>) =>
  moment(Number(value)).startOf('year').unix() * 1000;
const parseUnixTimeValueToEndOfYear = (value: string | number | Moment | EventValue<Moment>) =>
  moment(Number(value)).endOf('year').unix() * 1000;
const formatCountMinutes = (value: string | number | Moment | EventValue<Moment>, count: number, type: string) =>
  moment(value).add(count, 'minutes').format(type);
const parseUTCUnixTimeValue = (value: string | number | Moment | EventValue<Moment>) =>
  moment(value).utc().unix() * 1000;
const parseUTCUnixTimeToStartOfDay = () => moment().utc().startOf('day').unix() * 1000;
const parseUTCUnixTimeToEndOfDay = () => moment().utc().endOf('day').unix() * 1000;

const parseSubtractCountDays = (value: number) => moment().subtract(value, 'days');
const formatSubtractCountDays = (value: number, type: string) => moment().subtract(value, 'days').format(type);
const parseRanges = (value: number) => [moment().subtract(value, 'days'), moment()];
const parseRangesToday = () => [moment().startOf('day'), moment().endOf('day')];
const parseRangesThisMonth = () => [moment().startOf('month'), moment().endOf('month')];
const parseRangesQuarter = (value: string | number | Moment | EventValue<Moment>) => [moment(value), moment()];

const isSame = (start: string | number | Moment, end: string | number | Moment) => moment(start).isSame(moment(end));
const isAfter = (start: string | number | Moment, end: string | number | Moment) => moment(start).isAfter(moment(end));
const parseIsSame = (start: string | number | Moment, end: string | number | Moment) => moment(start).isSame(end);
const parseIsAfter = (start: string | number | Moment, end: string | number | Moment) => moment(start).isAfter(end);
const parseIsBefore = (start: string | number | Moment, end: string | number | Moment) => moment(start).isBefore(end);

const standardizeMoment = (value?: string | number | Moment) => moment(value);
const getQuarterRange = (quarter: number, year: string): [EventValue<Moment>, EventValue<Moment>] => {
  const start = moment(year, 'YYYY').quarter(quarter).startOf('quarter');
  const end = moment(year, 'YYYY').quarter(quarter).endOf('quarter');
  return [start, end];
};

const momentNow = () => moment();
const parseMoment = (value: string | number | Moment | EventValue<Moment>) => moment(value);
const formatDateNowMoment = (type: string) => moment().format(type);
const formatMoment = (value: string | number | Moment | EventValue<Moment>, type: string) => moment(value).format(type);
const parseDate = (value: string | number | Moment | EventValue<Moment>, type: string) => moment(value, type);

const formatEndOfDay = (value: string | number, type: string) => moment(value).endOf('day').format(type);
const formatMomentUTC = (value: string | number | Moment | EventValue<Moment>, type: string) =>
  moment(value).utc().format(type);
const startOfDay = () => moment().startOf('day');
const endOfDay = () => moment().endOf('day');
const parseLastMonth = () => [
  moment().subtract(1, 'months').startOf('month'),
  moment().subtract(1, 'months').endOf('month'),
];
const formatMonth = (value: string | number | Moment | EventValue<Moment>) => moment(value).month();

const FORMAT_MOMENT = {
  DATE_LONG: 'YYYY-MM-DD',
  MONTH: 'MM',
  MM_YYYY: 'MM/YYYY',
  YYYY_MM_DD_SLASH: 'YYYY/MM/DD',
  DATE_SLASH_LONG: 'DD/MM/YYYY',
  DATE_SLASH_SHORT: 'DD/MM/YY',
  DD_MM_YYYY: 'DD-MM-YYYY',
  DATE_TIME_LONG: 'YYYY-MM-DD HH:mm:ss',
  DATE_TIME_SHORT: 'YYYY-MM-DD HH:mm',
  DATE_TIME_SLASH_LONG: 'DD/MM/YYYY HH:mm:ss',
  DATE_TIME_SLASH_SHORT: 'DD/MM/YYYY HH:mm',
  TIME_SHORT: 'HH:mm',
  HH_MM_DD_MM_YY: 'HH:mm DD-MM-YY',
};

const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export {
  LANGUAGES,
  getCurrentLanguage,
  defaultLanguage,
  generateSelect,
  downloadCSV,
  showConfirm,
  REGREX_NUMBER,
  formatDate,
  FORMAT_MOMENT,
  parseTime,
  parseUnixTime,
  convertArrayToObject,
  parseGetUnixTimeValue,
  parseUnixTimeValueToStartOfMonth,
  parseUnixTimeValueToEndOfMonth,
  parseUnixTimeToStartOfMonth,
  parseUnixTimeToEndOfMonth,
  parseUnixTimeValueToEndOfDay,
  parseGetUnixTime,
  parseUnixTimeSubtractCountDays,
  parseSubtractCountDays,
  parseUnixTimeValueToStartOfDay,
  parseGetUnixTimeValueAddMinutes,
  parseRanges,
  parseRangesToday,
  parseRangesThisMonth,
  parseRangesQuarter,
  isSame,
  isAfter,
  standardizeMoment,
  getQuarterRange,
  formatSubtractCountDays,
  formatEndOfDay,
  formatMoment,
  parseMoment,
  formatMomentUTC,
  parseIsAfter,
  parseDate,
  parseIsSame,
  formatDateNowMoment,
  startOfDay,
  endOfDay,
  momentNow,
  parseIsBefore,
  parseLastMonth,
  formatMonth,
  parseUnixTimeValueToStartOfYear,
  parseUnixTimeValueToEndOfYear,
  formatCountMinutes,
  parseUnixDateNow,
  parseUnix,
  parseUTCUnixTimeValue,
  parseUTCUnixTimeToStartOfDay,
  parseUTCUnixTimeToEndOfDay,
};
export type { Moment };
