interface AppStore {
  openMenu: boolean;
}

interface LanguageCulture {
  code: string;
  culture: string;
  key: string;
  show: boolean;
  image: any;
}

interface IConfirmOptions {
  title: string;
  okText: string;
  content?: React.ReactNode;
  cancelText: string;
  onOk?: () => void;
  onCancel?: () => void;
  icon?: React.ReactNode;
}
