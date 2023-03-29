import * as _ from 'lodash';
import account from './_account.json';
import bitFarm from './_bit_farm.json';
import broker from './_broker.json';
import campaign from './_campaign.json';
import chickenFarm from './_chicken_farm.json';
import common from './_common.json';
import commonButton from './_common_button.json';
import commonInvalidError from './_common_invalid_error.json';
import commonRequiredError from './_common_required_error.json';
import dashboard from './_dashboard.json';
import forgotPassword from './_forgot_password.json';
import game from './_game.json';
import kyc from './_kyc.json';
import mission from './_mission.json';
import mobileuser from './_mobileuser.json';
import mobileuserDetail from './_mobileuserdetail.json';
import partner from './_partner.json';
import profile from './_profile.json';
import rank from './_rank.json';
import spin from './_spin.json';
import statistic from './_statistic.json';
import statisticStacking from './_statistic_stacking.json';
import systemConfig from './_systemconfig.json';
import users from './_users.json';

const entries = [
  broker,
  game,
  account,
  bitFarm,
  statistic,
  partner,
  spin,
  dashboard,
  campaign,
  mobileuserDetail,
  kyc,
  users,
  mobileuser,
  systemConfig,
  forgotPassword,
  commonInvalidError,
  commonButton,
  commonRequiredError,
  common,
  profile,
  chickenFarm,
  rank,
  statisticStacking,
  mission,
];
const en = {};
_.forEach(entries, function (lang) {
  Object.assign(en, lang);
});

export default en;
