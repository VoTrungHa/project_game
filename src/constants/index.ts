export const DEFAULT_PAGE_SIZE = 10;

export enum STATUS {
  INACTIVE,
  ACTIVE,
  ALL,
}

export enum UNIT {
  'none',
  '%',
}

export const REWARD = ['eventId', 'phone', 'rank', 'note', 'reward', 'amount'];

export enum STATUS_KYC {
  EMPTY = 0,
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  ALL = 4,
}

export enum KYC_DOC_TYPE {
  IDENTITY_CARD = 1,
  CITIZEN_IDENTIFICATION = 2,
  PASSPORT = 3,
}

export enum TYPE_TIME {
  DAY = 1,
  WEEK = 2,
  MONTH = 3,
}

export enum STATUS_CASHBACK {
  PROCESSING = 1,
  SUCCESS = 2,
  FAILURE = 3,
  REJECTED = 4,
  APPROVED = 5,
  ALL = 6,
}

export enum TIME_SELECT {
  TODAY = 1,
  YESTERDAY = 2,
  THIS_WEEK = 3,
  THIS_MONTH = 4,
  CUSTOM = 5,
}

export enum WALLET_TYPE {
  DEPOSIT = 1,
  PAYMENT = 2,
  WITHDRAWAL = 3,
}

export enum DAILY_LUCKY_WHEEL_TYPE {
  SATOSHI = 1,
  PAYMENT = 2,
  NONE = 3,
}

export enum DAILY_LUCKY_WHEEL_TYPE_UNIT {
  'SAT' = 1,
  '%' = 2,
  ' ' = 3,
}

export enum REWARD_STATUS {
  NOT_USED = 1,
  USED = 2,
  EXPIRED = 3,
}

export enum APPROVE_SPIN {
  YES = 1,
  NO = 2,
}

export enum SELECT_REFERRAL_ACCOUNT {
  ALL = 1,
  PARTNER = 2,
  MOBILE_USER = 3,
}

export enum STATUS_EVENT_CONFIG {
  NEW = 'NEW',
  RUNNING = 'RUNNING',
  FINISH = 'FINISH',
}

export enum TIME_UNIT_VNDC {
  TODAY = 1,
  THIS_WEEK = 2,
  THIS_MONTH = 3,
  ALL = 4,
}

export enum CHICKEN_FARM_EGG_EVENT_STATUS {
  RUNNING = 1,
  PENDING = 2,
  FINISH = 3,
}

export enum ACCOUNTS_TO_SEND {
  ALL = 1,
  KYC = 2,
  NON_KYC = 3,
  PARTNER = 4,
  WITHDRALABLE = 5,
}

export enum TIME_UNIT_BUY_SATOSHI {
  THIS_MONTH = 1,
  LAST_MONTH = 2,
  ALL = 3,
}

export enum CHICKEN_STATUS {
  ALIVE = 1,
  DIE = 2,
}

export enum CHICKEN_TYPE {
  MARS = 1,
  JUPITER = 2,
  VENUS = 3,
  MERCURY = 4,
  SATURN = 5,
}

export enum CHICKEN_FARM_TRANSACTION_TYPE {
  GOLDEN_EGG = 1,
  EGG = 2,
  CHICKEN = 3,
  BONUS_CHICKEN_EGG = 4,
  COMMISSION_GOLDEN_EGG = 5,
  ALL = 6,
}

export enum CHICKEN_FARM_TRANSACTION_STATUS {
  PROCESSING = 1,
  SUCCESS = 2,
  FAILED = 3,
  ALL = 4,
}

export enum PLAYER_TRANSACTION_TYPE {
  SELLER = 1,
  BUYER = 2,
}

export enum STATUS_GAME {
  FREE = 1,
  PAID = 2,
}

export enum BIT_PLAY_CHALLENGE_STATUS {
  RUNNING = 1,
  PENDING = 2,
  FINISH = 3,
  PAID_OUT = 4,
}

export enum EVENT_STATUS {
  ACTIVE = 1,
  INACTIVE = 2,
  ALL = 3,
}

export enum WALLET_TYPE {
  ALL = 1,
  VNDC = 'VNDC',
  KAI = 'KAI',
}

export enum COIN_TYPE {
  ALL = 1,
  VNDC = 'VNDC',
  SAT = 'SAT',
}

export enum CHICKEN_GENDER {
  HEN = 1,
  ROOSTER = 2,
}

export enum SELECT_REFERRAL_BY {
  ALL = 1,
  REFERRAL = 2,
  NONE_REFERRAL = 3,
}

export enum OPERATOR {
  GREATER = '>',
  LESS = '<',
  EQUAL = '=',
  GREATER_EQUAL = '>=',
  LESS_EQUAL = '<=',
}

export enum REFERRAL_RANKING_STATUS {
  HAPPENING = 1,
  LOCKED = 2,
  AWARDED = 3,
}

export enum PRIZE {
  PRIZE_50 = 'prize50',
  PRIZE_100 = 'prize100',
  PRIZE_200 = 'prize200',
  PRIZE_300 = 'prize300',
  PRIZE_400 = 'prize400',
  PRIZE_500 = 'prize500',
}

export enum SORT_ORDER {
  DESC = 'DESC',
  ASC = 'ASC',
}
