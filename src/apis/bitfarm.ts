import axiosClient from 'helpers/axiosClient';

export const BitfarmAPI = {
  GET_CHICKEN_FARM_STATS: async (params: IChickenFarmStatsResquest): Promise<IChickenFarmStatsResponse> => {
    return await axiosClient.get('/chicken-farm-stats/hatching-stats', {
      params,
    });
  },
  GET_CHICKEN_ADULTS_STATS: async (): Promise<IChickenAdultStatsResponse> => {
    return await axiosClient.get('/chicken-farm-stats/adult-stats');
  },
  GET_LIST_BUY_SATOSHI: async (params: IListBuySatoshiRequest): Promise<IListBuySatoshiResponse> => {
    return await axiosClient.get('/statistics/buy-satoshi/data', {
      params,
    });
  },
  GET_LIST_PLAYER: async (params: IPlayerListRequest): Promise<IPlayerListResponse> => {
    return await axiosClient.get('/chicken-farm-stats/account-data', {
      params,
    });
  },
  GET_LIST_PLAYER_STAT: async (): Promise<IPlayerListStat> => {
    return await axiosClient.get('/chicken-farm-stats/account-data-stats');
  },
  GET_BROKER_TRANSACTION_BY_ID: async (id: string): Promise<IGetBrokerTransaction> => {
    return await axiosClient.get(`/chicken-farm-stats/account/${id}`);
  },
  GET_LIST_EGG_BY_ID: async ({ id, ...params }: IListEggByAccountResquest): Promise<IListEggByAccountResponse> => {
    return await axiosClient.get(`/chicken-farm-stats/account/${id}/eggs`, { params });
  },
  GET_LIST_CHICKEN_BY_ID: async ({
    id,
    ...params
  }: IListChickenByAccountRequest): Promise<IListChickenByAccountResponse> => {
    return await axiosClient.get(`/chicken-farm-stats/account/${id}/chickens`, { params });
  },
  GET_DETAIL_EGG_BY_ID: async ({ id, eggId }: { id: string; eggId: string }): Promise<IDetailEggResponse> => {
    return await axiosClient.get(`/chicken-farm-stats/account/${id}/eggs/${eggId}`);
  },
  GET_DETAIL_CHICKEN_BY_ID: async ({ id, chickenId }: { id: string; chickenId: string }): Promise<IChickenItem> => {
    return await axiosClient.get(`/chicken-farm-stats/account/${id}/chickens/${chickenId}`);
  },
  GET_LIST_TRANSACTION_P2P: async (params: ITransactionP2PResquest): Promise<ITransactionP2PResponse> => {
    return await axiosClient.get(`/chicken-farm-stats/transactions`, { params });
  },
  GET_STAT_TRANSACTION_P2P: async (): Promise<ITransactionP2PStatResponse> => {
    return await axiosClient.get(`/chicken-farm-stats/transaction-stats`);
  },
  GET_ACCOUNT_TRANSACTION_DATA: async ({
    id,
    ...params
  }: IAccountTransactionRequest): Promise<IAccountTransactionResponse> => {
    return await axiosClient.get(`/chicken-farm-stats/account/${id}/transaction`, { params });
  },
  GET_LIST_WITHDRAWAL_VNDC: async (params: IWithdrawalVndcRequest): Promise<IWithdrawalVndcReponse> => {
    return await axiosClient.get(`/statistics/cashback-exchange/data`, { params });
  },
  GET_STAT_WITHDRAWAL_VNDC: async (params: IStatRequest): Promise<IWithdrawalVndcStats> => {
    return await axiosClient.get(`/statistics/cashback-exchange`, { params });
  },
  GET_STAT_DEPOSIT_SATOSHI: async (params: IStatRequest): Promise<IDepositSatoshiDetailStats> => {
    return await axiosClient.get(`/statistics/buy-satoshi`, { params });
  },
  DOWNLOAD_CSV: async (params: IWithdrawalVndcRequest): Promise<string> => {
    return await axiosClient.get('/statistics/cashback-exchange/export', { params });
  },
  UPDATE_TRANSACTION_STATUS: async ({ id, ...payload }: IUpdateTransactionStatus): Promise<{ status: boolean }> => {
    return await axiosClient.patch(`/statistics/cashback-exchange/${id}/status`, payload);
  },
};
