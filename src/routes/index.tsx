import { ProtectedRoute } from 'components/ProtectedRoute';
import { PATH } from 'constants/paths';
import responsive from 'constants/responsive';
import { ROLE_TYPE } from 'constants/role';
import { getListCurrency } from 'containers/Broker/duck/thunks';
import ForgotPassword from 'containers/ForgotPassword';
import { getExchangeRate } from 'containers/GlobalConfig/duck/thunks';
import ResetPassword from 'containers/ResetPassword';
import { getStackingConfig } from 'containers/SettingStacking/duck/thunks';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import MainLayout from 'layouts';
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Login = React.lazy(() => import('containers/Auth'));
const KycPage = React.lazy(() => import('containers/Kyc'));
const Campaign = React.lazy(() => import('containers/Campaign'));
const DashBoard = React.lazy(() => import('containers/Dashboard'));
const Users = React.lazy(() => import('containers/Users'));
const Profile = React.lazy(() => import('containers/Profile'));
const NotFound = React.lazy(() => import('containers/NotFound'));
const Deny = React.lazy(() => import('containers/PermissionDeny'));
const MobileUser = React.lazy(() => import('containers/MobileUser'));
const MobileUserDetail = React.lazy(() => import('containers/MobileUserDetail'));
const GlobalSystemConfig = React.lazy(() => import('containers/GlobalConfig'));
const BannerConfig = React.lazy(() => import('containers/BannerConfig'));
const SpinConfig = React.lazy(() => import('containers/SpinPrize'));
const LuckySpin = React.lazy(() => import('containers/LuckySpin'));
const VNDCOrder = React.lazy(() => import('containers/Vndcorder'));
const Partner = React.lazy(() => import('containers/Partner'));
const PartnerDetail = React.lazy(() => import('containers/PartnerDetail'));
const Statistic = React.lazy(() => import('containers/Statistic'));
const Reward = React.lazy(() => import('containers/Reward'));
const SatoshiGame = React.lazy(() => import('containers/SatoshiGame/index'));
const Reward_v2 = React.lazy(() => import('containers/Reward_v2/main/Events/index'));
const event_id = React.lazy(() => import('containers/Reward_v2/main/EventReward/index'));
const HomePageAds = React.lazy(() => import('containers/HomeAdsConfig/index'));
const SaleSchedule = React.lazy(() => import('containers/SaleSchedule/index'));
const PrivateSale = React.lazy(() => import('containers/PrivateSale/index'));
const SendNotification = React.lazy(() => import('containers/SendNotification/index'));
const DepositSatoshiDetail = React.lazy(() => import('containers/DepositSatoshiDetail/index'));
const BitFarm = React.lazy(() => import('containers/BitFarm/index'));
const PlayerList = React.lazy(() => import('containers/PlayerList/index'));
const PlayerDetail = React.lazy(() => import('containers/PlayerDetail/index'));
const TransactionP2P = React.lazy(() => import('containers/TransactionP2P/index'));
const WithdrawalVndc = React.lazy(() => import('containers/WithdrawalVndc/index'));
const Account = React.lazy(() => import('containers/Account/index'));
const Game = React.lazy(() => import('containers/Game/index'));
const Challenge = React.lazy(() => import('containers/Challenge/index'));
const FriendInvitationEvent = React.lazy(() => import('containers/FriendInvitationEvent/index'));
const FriendInvitationEventDetail = React.lazy(() => import('containers/FriendInvitationEventDetail/index'));
const Broker = React.lazy(() => import('containers/Broker/index'));
const BrokerDetail = React.lazy(() => import('containers/BrokerDetail'));
const AnnouncementBitfarm = React.lazy(() => import('containers/AnnouncementBitfarm/index'));
const RankPage = React.lazy(() => import('containers/Rank/index'));
const RankDetail = React.lazy(() => import('containers/RankDetail/index'));
const Referral = React.lazy(() => import('containers/Referral/index'));
const StatisticStacking = React.lazy(() => import('containers/StatisticStacking/index'));
const StackingDetail = React.lazy(() => import('containers/StackingDetail/index'));
const SettingStacking = React.lazy(() => import('containers/SettingStacking/index'));
const LuckySpinStatistic = React.lazy(() => import('containers/LuckySpinStatistic/index'));
const LuckySpinDetail = React.lazy(() => import('containers/LuckySpinStatisticDetail/index'));
const AccountOpeningCampaign = React.lazy(() => import('containers/AccountOpeningCampaign/index'));
const System = React.lazy(() => import('containers/System/index'));

export const Routes: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    systemconfig: { rate },
    settingStacking: { stacking },
    auth: { isLoggedIn },
    broker: { currencyList },
  } = useAppSelector((state) => state);

  useEffect(() => {
    if (isLoggedIn) {
      if (!rate) {
        dispatch(getExchangeRate());
      }
    }
  }, [dispatch, isLoggedIn, rate]);

  useEffect(() => {
    if (isLoggedIn) {
      if (!stacking) {
        dispatch(getStackingConfig());
      }
    }
  }, [dispatch, isLoggedIn, stacking]);

  useEffect(() => {
    if (currencyList.length === 0) {
      dispatch(getListCurrency({ status: 1 }));
    }
  }, [dispatch, isLoggedIn, currencyList.length]);

  return (
    <BrowserRouter>
      <div style={{ maxWidth: responsive.MAX_WIDTH_DESKTOP, margin: 'auto', height: '100vh' }}>
        <Suspense fallback={null}>
          <Switch>
            <Route exact path={PATH.LOGIN} component={Login} />
            <Route exact path={PATH.FORGOTPASSWORD} component={ForgotPassword} />
            <Route exact path={PATH.RESETPASSWORD} component={ResetPassword} />
            <MainLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.ADMIN, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={DashBoard}
                    path={PATH.DASHBOARD}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.ADMIN, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Profile}
                    path={PATH.PROFILE}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.ADMIN, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Users}
                    path={PATH.USERS}
                  />
                  {/* TODO: Temporary comment kyc */}
                  {/* <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={KycPage}
                    path={PATH.KYC}
                  /> */}
                  {/* TODO: Temporary hiding */}
                  {/* <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={MobileUser}
                    path={PATH.MOBILEUSER}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Partner}
                    path={PATH.PARTNER}
                  /> */}
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Account}
                    path={PATH.ACCOUNT}
                  />
                  {/* TODO: Delete laters */}
                  {/* <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Statistic}
                    path={PATH.STATISTIC}
                  /> */}
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Reward_v2} //Reward
                    path={PATH.REWARD}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={event_id} //Reward
                    path={PATH.EVENTID}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={SatoshiGame}
                    path={PATH.SATOSHIGAME}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={DepositSatoshiDetail}
                    path={PATH.DEPOSITSATOSHIDETAIL}
                  />
                  {/* TODO: Uncomment later */}
                  {/* <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={VNDCOrder}
                    path={PATH.VNDCORDER}
                  /> */}
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={MobileUserDetail}
                    path={`${PATH.MOBILEUSERDETAIL}/:userId`}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={PartnerDetail}
                    path={`${PATH.PARTNERDETAIL}/:userId`}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Campaign}
                    path={PATH.CAMPAIGN}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={AccountOpeningCampaign}
                    path={PATH.ACCOUNTOPENINGCAMPAIGN}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={System}
                    path={PATH.SYSTEMCONFIG}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={AnnouncementBitfarm}
                    path={PATH.ANNOUNCEMENTBITFARM}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={SaleSchedule}
                    path={PATH.SALESCHEDULE}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={PrivateSale}
                    path={PATH.PRIVATESALE}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={BitFarm}
                    path={PATH.BITFARM}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={PlayerList}
                    path={PATH.PLAYERLIST}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={PlayerDetail}
                    path={`${PATH.PLAYERDETAIL}/:playerId`}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={RankDetail}
                    path={`${PATH.RANKDETAIL}/:rankId`}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={TransactionP2P}
                    path={PATH.P2PTRANSACTION}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={WithdrawalVndc}
                    path={PATH.WITHDRAWALVNDC}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={RankPage}
                    path={PATH.RANK}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Referral}
                    path={PATH.REFERRAL}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={StatisticStacking}
                    path={PATH.STATISTIC_STACKING}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={LuckySpinStatistic}
                    path={PATH.LUCKYSPINSTATISTIC}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={LuckySpinDetail}
                    path={`${PATH.LUCKYSPINSTATISTICDETAIL}/:dateSpin`}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={StackingDetail}
                    path={`${PATH.STATISTIC_STACKING_DETAIL}/:stackingId`}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={SettingStacking}
                    path={PATH.SETTING_STACKING}
                  />
                  {/* TODO: Temporary hiding */}
                  {/* <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Game}
                    path={PATH.GAME}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Challenge}
                    path={PATH.CHALLENGE}
                  /> */}
                  {/* TODO: Temporary hiding */}
                  {/* <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={FriendInvitationEvent}
                    path={PATH.FRIENDINVITATIONEVENT}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={FriendInvitationEventDetail}
                    path={`${PATH.FRIENDINVITATIONEVENTDETAIL}/:eventId`}
                  /> */}
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={Broker}
                    path={PATH.BROKER}
                  />
                  <ProtectedRoute
                    role={[ROLE_TYPE.MANAGER, ROLE_TYPE.EDITOR, ROLE_TYPE.USER]}
                    exact
                    component={BrokerDetail}
                    path={`${PATH.BROKERDETAIL}/:brokerId`}
                  />

                  <ProtectedRoute role={[ROLE_TYPE.MANAGER]} exact component={LuckySpin} path={PATH.LUCKYSPIN} />
                  <ProtectedRoute path={PATH.PERMISSIONDENY} exact component={Deny} />
                  <ProtectedRoute component={NotFound} />
                </Switch>
              </Suspense>
            </MainLayout>
          </Switch>
        </Suspense>
      </div>
    </BrowserRouter>
  );
};
