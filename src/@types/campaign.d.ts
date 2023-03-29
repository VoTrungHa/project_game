interface ICategoryMasterResponse extends Array<{ value: number; label: string }> {}

interface ICampaign {
  id: string;
  title: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  position: number;
  categoryMaster?: {
    id: number;
    name: string;
  };
}
interface IListCampaignRequest {
  page?: number;
  size?: number;
  title?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: string;
  categoryId?: string;
  keyword?: string;
}

interface IListCampaignResponse {
  page?: number;
  totalRecords?: number;
  data: Array<ICampaign>;
}

interface ICampaignDetail {
  id: string;
  banner?: string;
  title: string;
  slogan?: string;
  logo?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  openLink: string;
  updatedAt: string;
  categoryMaster?: {
    id: number;
    icon?: string;
    name: string;
  };
  campaignCategories: Array<{
    id: number;
    name: string;
    cashbackRate: number;
  }>;
}

interface IAddCampaignRequest {
  title: string;
  banner: string;
  logo: string;
  slogan: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  categoryId: number;
  openLink: string;
}

interface IAddCampaignResponse extends IAddCampaignRequest {
  id: number;
  createdAt: string;
  categoryMaster: {
    id: number;
    name: string;
    icon?: string;
  };
}

interface IUpdateCampaignRequest {
  id: string;
  title?: string;
  banner?: string;
  logo?: string;
  slogan?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  categoryId?: number;
  openLink?: string;
  position?: number;
}

interface IUpdateCampaignResponse extends Omit<IUpdateCampaignRequest, 'categoryId'> {
  categoryMaster: {
    id: number;
    name: string;
  };
}

interface IAddCampaignCategoryRequest {
  name: string;
  cashbackRate: number;
  categoryId: number;
  fromSource: string;
  campaignId: number;
}

interface IAddCampaignCategoryResponse {
  id: number;
  name: string;
  cashbackRate: number;
  campaign: {
    id: number;
    title: string;
  };
}

interface IUpdateCampaignCategoryRequest {
  id: number;
  name: string;
  cashbackRate: number;
}
