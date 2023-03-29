import axiosClient from 'helpers/axiosClient';

export const BrokerAPI = {
  GET_LIST_BROKER: async (params: IGetListBrokerrequest): Promise<IBrokerListResponse> => {
    return await axiosClient.get('/broker-management', {
      params,
    });
  },
  ADD_BROKER: async (params: IAddBrokerRequest): Promise<IBrokerItem> => {
    return await axiosClient.post('/broker-management', { ...params });
  },
  GET_DETAIL_BROKER: async (id: string): Promise<IBrokerItem> => {
    return await axiosClient.get(`/broker-management/${id}`);
  },
  UPDATE_BROKER: async ({ id, ...payload }: IUpdateBrokerRequest): Promise<IBrokerItem> => {
    return await axiosClient.patch(`/broker-management/${id}`, payload);
  },
  GET_LIST_CURRENCY: async (payload): Promise<ICurrencyList> => {
    return await axiosClient.get('/currency', { ...payload });
  },
  ADD_DEPOSIT: async ({ id, ...params }: IBrokerManagerDepositRequest): Promise<{ currencyId: string }> => {
    return await axiosClient.post(`/broker-management/${id}/deposit`, { ...params });
  },
  GET_BROKER_TRANSACTION: async ({ id, ...params }: IBrokerTransactionRequest): Promise<IBrokerTransactionResponse> => {
    return await axiosClient.get(`/broker-management/${id}/transactions`, { params });
  },
  GET_BROKER_TRANSACTION_STAT: async (id: string, { ...params }): Promise<IBrokerDetailTransactionStat> => {
    return await axiosClient.get(`/broker-management/${id}/transaction-stats`, { params });
  },
};
