import { AppReducer } from 'App/reducer';
import { AccountReducer } from 'containers/Account/duck/reducers';
import { AnnouncementBitfarmReducer } from 'containers/AnnouncementBitfarm/duck/reducers';
import { AuthReducer } from 'containers/Auth/duck/reducer';
import { BannerConfigReducer } from 'containers/BannerConfig/duck/reducers';
import { BitfarmReducer } from 'containers/BitFarm/duck/reducers';
import { BrokerReducer } from 'containers/Broker/duck/reducers';
import { BrokerDetailReducer } from 'containers/BrokerDetail/duck/reducers';
import { CampaignReducer, CategoryMasterReducer } from 'containers/Campaign/duck/reducers';
import { ChallengeReducer } from 'containers/Challenge/duck/reducer';
import { DashboardReducer } from 'containers/Dashboard/duck/reducer';
import { DepositSatoshiDetailReducer } from 'containers/DepositSatoshiDetail/duck/reducers';
import { FriendInvitationEventReducer } from 'containers/FriendInvitationEvent/duck/reducers';
import { FriendInvitationEventDetailReducer } from 'containers/FriendInvitationEventDetail/duck/reducers';
import { GameReducer } from 'containers/Game/duck/reducer';
import { SystemConfigReducer } from 'containers/GlobalConfig/duck/reducers';
import { HomePageBannerConfigReducer } from 'containers/HomeAdsConfig/duck/reducers';
import { KycReducer } from 'containers/Kyc/duck/reducers';
import { LuckySpinReducer } from 'containers/LuckySpin/duck/reducers';
import { LuckySpinStatisticReducer } from 'containers/LuckySpinStatistic/duck/reducers';
import { LuckySpinDetailReducer } from 'containers/LuckySpinStatisticDetail/duck/reducers';
import { MobileUserReducer } from 'containers/MobileUser/duck/reducers';
import { PartnerReducer } from 'containers/Partner/duck/reducers';
import { PartnerDetailReducer } from 'containers/PartnerDetail/duck/reducers';
import { PlayerDetailReducer } from 'containers/PlayerDetail/duck/reducers';
import { PlayerListReducer } from 'containers/PlayerList/duck/reducers';
import { PrivateSaleReducer } from 'containers/PrivateSale/duck/reducers';
import { ProfileReducer } from 'containers/Profile/duck/reducer';
import { RankReducer } from 'containers/Rank/duck/reducers';
import { RankDetailReducer } from 'containers/RankDetail/duck/reducers';
import { ReferralReducer } from 'containers/Referral/duck/reducers';
import { RewardReducer } from 'containers/Reward_v2/duck/reducers';
import { SaleScheduleReducer } from 'containers/SaleSchedule/duck/reducers';
import { SatoshiGameReducer } from 'containers/SatoshiGame/duck/reducers';
import { SettingStackingReducer } from 'containers/SettingStacking/duck/reducers';
import { SpinPrizeReducer } from 'containers/SpinPrize/duck/reducers';
import { StatisticStackingDetailReducer } from 'containers/StackingDetail/duck/reducers';
import { ReferralCounterReducer } from 'containers/Statistic/duck/reducers';
import { StatisticStackingReducer } from 'containers/StatisticStacking/duck/reducers';
import { P2PListReducer } from 'containers/TransactionP2P/duck/reducers';
import { UserReducer } from 'containers/Users/duck/reducers';
import { withdrawalVndcReducer } from 'containers/WithdrawalVndc/duck/reducers';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  user: UserReducer,
  kyc: KycReducer,
  categorymaster: CategoryMasterReducer,
  campaign: CampaignReducer,
  mobileuser: MobileUserReducer,
  systemconfig: SystemConfigReducer,
  profile: ProfileReducer,
  dashboard: DashboardReducer,
  banner: BannerConfigReducer,
  spin: SpinPrizeReducer,
  luckyspin: LuckySpinReducer,
  partner: PartnerReducer,
  partnerdetail: PartnerDetailReducer,
  referralCounter: ReferralCounterReducer,
  satoshiGame: SatoshiGameReducer,
  homepageBanner: HomePageBannerConfigReducer,
  saleSchedule: SaleScheduleReducer,
  privateSale: PrivateSaleReducer,
  depositSatoshiDetail: DepositSatoshiDetailReducer,
  bitFarm: BitfarmReducer,
  playerList: PlayerListReducer,
  playerDetail: PlayerDetailReducer,
  p2pTransaction: P2PListReducer,
  withdrawalVndc: withdrawalVndcReducer,
  account: AccountReducer,
  reward: RewardReducer,
  game: GameReducer,
  challenge: ChallengeReducer,
  friendInvitationEvent: FriendInvitationEventReducer,
  friendInvitationEventDetail: FriendInvitationEventDetailReducer,
  broker: BrokerReducer,
  brokerDetail: BrokerDetailReducer,
  announcementBitfarm: AnnouncementBitfarmReducer,
  settingStacking: SettingStackingReducer,
  rankDetail: RankDetailReducer,
  rank: RankReducer,
  referral: ReferralReducer,
  statisticStacking: StatisticStackingReducer,
  statisticStackingDetail: StatisticStackingDetailReducer,
  luckySpinStatistic: LuckySpinStatisticReducer,
  luckySpinDetail: LuckySpinDetailReducer,
});

export default rootReducer;
