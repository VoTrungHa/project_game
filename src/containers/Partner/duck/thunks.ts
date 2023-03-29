import { PartnerAPI } from 'apis/partner';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import * as actions from 'containers/Partner/duck/actions';
import { AppDispatch } from 'store';

export const getListPartner = (params: any) => async (dispatch: AppDispatch) => {
  dispatch(actions.getListPartnerRequested());
  try {
    const res = await PartnerAPI.GET_LIST_PARTNER({
      ...params,
      size: DEFAULT_PAGE_SIZE,
      isPartner: true,
    });
    dispatch(actions.getListPartnerSuccess(res));
  } catch (error) {
    dispatch(actions.getListPartnerFailed());
  }
};
