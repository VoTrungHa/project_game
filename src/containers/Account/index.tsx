/* eslint-disable react/display-name */
import { Card, Divider, Form, Input, message, TablePaginationConfig } from 'antd';
import { MobileUserAPI } from 'apis/mobileuser';
import { DEFAULT_PAGE_SIZE, SELECT_REFERRAL_ACCOUNT, SELECT_REFERRAL_BY, STATUS, STATUS_KYC } from 'constants/index';
import { PATH } from 'constants/paths';
import {
  parseGetUnixTimeValue,
  parseObjectToParam,
  parseParamToObject,
  parseUnixTimeValueToEndOfDay,
} from 'helpers/common';
import { useAppDispatch, useAppSelector } from 'hooks/reduxcustomhook';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import AccountFilter from './components/AccountFilter';
import AccountModal from './components/AccountModal';
import AccountSummary from './components/AccountSummary';
import AccountTable from './components/AccountTable';
import { getAccount, getAccountStat } from './duck/thunks';
import './index.scss';
interface IModalState {
  type: 'Edit';
  isOpen: boolean;
  data?: IMobileUserDetailResponse | IAccount;
}

const Index: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    account: { list },
  } = useAppSelector((state) => state);
  const history = useHistory();
  const location = useLocation();
  const params = parseParamToObject(location.search);

  const [paramSearch, setParamSearch] = useState<IAccountRequest>({
    ...params,
    isPartner: params.isPartner ? params.isPartner === 'true' : undefined,
    isReferral: params.isReferral ? params.isReferral === 'true' : undefined,
    from: params.from ? parseGetUnixTimeValue(params.from as string) : undefined,
    to: params.to ? parseGetUnixTimeValue(params.to as string) : undefined,
    sortKey: (params.sortKey ? params.sortKey : undefined) as string,
    sortOrder: (params.sortOrder ? params.sortOrder : undefined) as string,
    token: (params.token ? params.token : undefined) as string,
    value: (params.value ? params.value : undefined) as string,
  });
  const [modalState, setModalState] = useState<IModalState | undefined>(undefined);
  const [formEdit] = Form.useForm();
  const inputSearchRef = useRef<Input | null>(null);

  useEffect(() => {
    if (!modalState) {
      formEdit.resetFields();
    }
  }, [formEdit, modalState]);

  useEffect(() => {
    const params = {
      ...paramSearch,
      size: DEFAULT_PAGE_SIZE,
      kycStatus: paramSearch.kycStatus === STATUS_KYC.ALL ? undefined : paramSearch.kycStatus,
      status: paramSearch.status === STATUS.ALL ? undefined : paramSearch.status,
      from: paramSearch.from ? paramSearch.from : undefined,
      sortKey: paramSearch.sortKey ? paramSearch.sortKey : undefined,
      sortOrder: paramSearch.sortOrder ? paramSearch.sortOrder : undefined,
      token: paramSearch.token ? paramSearch.token : undefined,
      value: paramSearch.value ? paramSearch.value : undefined,
      to: paramSearch.to
        ? paramSearch.from === paramSearch.to
          ? parseUnixTimeValueToEndOfDay(paramSearch.to)
          : paramSearch.to
        : undefined,
    };
    dispatch(getAccount(params));
    dispatch(getAccountStat(params));
    history.push({ pathname: PATH.ACCOUNT, search: parseObjectToParam(params) });
  }, [dispatch, history, paramSearch]);

  const isUpdatingStatus = useMemo(() => {
    if (modalState && modalState.data && list) {
      const ele = list.data.find((item) => item.id === modalState.data?.id);
      if (ele) {
        return ele.status !== modalState.data.status;
      }
    }
  }, [list, modalState]);

  const isUpdatingPhone = useMemo(() => {
    if (modalState && modalState.data && list) {
      const ele = list.data.find((item) => item.id === modalState.data?.id);
      if (!ele) return false;
      if (ele.phone) {
        return ele.phone.substr(1) !== modalState.data.phone;
      }
      return Boolean(ele.phone) !== Boolean(modalState.data.phone);
    }
  }, [list, modalState]);

  const onChangeSelect = (value: number) => {
    setModalState((prev) => {
      if (prev && prev.data) {
        return { ...prev, data: { ...prev.data, status: value } };
      }
    });
  };

  const onChangeInput = (value: string) => {
    setModalState((prev) => {
      if (prev && prev.data) {
        return { ...prev, data: { ...prev.data, phone: value } };
      }
    });
  };

  const onChangeTable = useCallback((pagination: TablePaginationConfig, _, sorter) => {
    if (pagination.current) {
      setParamSearch((prev) => ({
        ...prev,
        page: pagination.current,
        sortKey: sorter.column ? sorter.column?.key : undefined,
        sortOrder: sorter.column ? (sorter.order === 'descend' ? 'DESC' : 'ASC') : undefined,
      }));
    }
  }, []);

  const onOpenModal = (payload: IModalState) => setModalState(payload);

  const onCloseModal = () => setModalState(undefined);

  const onEditUser = useCallback(async (record: IAccount) => {
    onOpenModal({ isOpen: true, type: 'Edit', data: undefined });
    try {
      const res = await MobileUserAPI.GET_DETAIL_MOBILE_USER(record.id);
      onOpenModal({ isOpen: true, type: 'Edit', data: { ...res, phone: res.phone && res.phone.substr(1) } });
    } catch (error) {
      onOpenModal({ isOpen: true, type: 'Edit', data: record });
    }
  }, []);

  const onFinishForm = useCallback(
    async (values) => {
      if (!modalState || !modalState.data) return;
      if (modalState.type === 'Edit') {
        try {
          const res = await MobileUserAPI.UPDATE_STATUS({
            id: modalState.data.id,
            status: isUpdatingStatus ? values.status : undefined,
            phone: isUpdatingPhone ? values.phone : undefined,
            reason: values.reason,
          });
          if (res.status) {
            dispatch(getAccount(paramSearch));
            setModalState(undefined);
          }
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message.length > 0) {
            const errorFromServer = error.response.data.message[0];
            if (errorFromServer.message === 'PHONE_INVALID') {
              message.error(t('UPDATE_PHONE_INVALID_ERROR'));
            } else {
              message.error(t('UPDATE_PHONE_USED_ERROR'));
            }
          } else {
            message.error(t('COMMON_UPDATE_STATUS_ERROR'));
          }
        }
      }
    },
    [dispatch, isUpdatingPhone, isUpdatingStatus, modalState, paramSearch, t],
  );

  const onClearFilter = useCallback(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.setValue('');
    }
    setParamSearch({});
    history.push(PATH.ACCOUNT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const onSearchInput = useCallback(
    (value: string) => {
      const keyword = value.trim();
      if (keyword) {
        setParamSearch((prev) => ({
          ...prev,
          keyword,
          page: 1,
        }));
      } else {
        onClearFilter();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClearFilter],
  );

  const onChangeKycStatus = useCallback((kycStatus: number) => setParamSearch((prev) => ({ ...prev, kycStatus })), []);

  const onChangeIsPartner = useCallback(
    (isPartner: number) =>
      setParamSearch((prev) => ({
        ...prev,
        isPartner:
          isPartner === SELECT_REFERRAL_ACCOUNT.ALL ? undefined : isPartner === SELECT_REFERRAL_ACCOUNT.PARTNER,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setParamSearch],
  );

  const onChangeReferralStatus = useCallback(
    (isReferral: number) =>
      setParamSearch((prev) => ({
        ...prev,
        isReferral: isReferral === SELECT_REFERRAL_BY.ALL ? undefined : isReferral === SELECT_REFERRAL_BY.REFERRAL,
      })),
    [],
  );
  const onChangeStatus = useCallback((status: number) => setParamSearch((prev) => ({ ...prev, status })), []);
  const onChangeDatePicker = useCallback((value: any) => {
    setParamSearch((prev) => ({
      ...prev,
      page: 1,
      from: value ? parseGetUnixTimeValue(value[0]) : undefined,
      to: value ? parseGetUnixTimeValue(value[1]) : undefined,
    }));
  }, []);

  const onHandleSortAmount = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    const draft = selectedKeys && selectedKeys.input ? `${selectedKeys.select},${selectedKeys.input}` : undefined;
    setParamSearch((prev) => {
      return {
        ...prev,
        token: dataIndex,
        value: draft,
      };
    });
  }, []);

  const onResetSortAmount = useCallback((clearFilters) => {
    clearFilters();
    setParamSearch((prev) => ({
      ...prev,
      token: undefined,
      value: undefined,
    }));
  }, []);

  return (
    <Card>
      <AccountFilter
        {...{
          paramSearch,
          onSearchInput,
          onChangeDatePicker,
          onChangeStatus,
          onChangeIsPartner,
          onChangeKycStatus,
          onChangeReferralStatus,
        }}
      />
      <Divider />
      <AccountSummary />
      <AccountTable
        {...{ paramSearch, setParamSearch, onHandleSortAmount, onResetSortAmount, onEditUser, onChangeTable }}
      />
      <AccountModal {...{ modalState, onCloseModal, onChangeSelect, onChangeInput, paramSearch, onFinishForm }} />
    </Card>
  );
};

export default Index;
