const storage = {
  setValueIntoKey(key: string, value: string) {
    localStorage.setItem(key, value);
  },
  getValueFromKey(key: string) {
    return localStorage.getItem(key) as string;
  },
  setObjectIntoKey(key: string, obj: {}) {
    localStorage.setItem(key, JSON.stringify(obj));
  },
  getObjectFromKey(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  },
  setAccessToken(token: string) {
    this.setValueIntoKey('token', token);
  },
  setRefreshToken(refreshToken: string) {
    this.setValueIntoKey('refreshToken', refreshToken);
  },
  getAccessToken() {
    const token: string = this.getValueFromKey('token');
    if (!token) return null;
    return token;
  },
  getRefreshToken() {
    const token = this.getValueFromKey('refreshToken');
    if (!token) return '';
    return token;
  },
  getLanguage() {
    return this.getValueFromKey('lang');
  },
  removeAccessToken() {
    const token = this.getAccessToken();
    if (!token) return null;
    localStorage.removeItem('token');
  },
  removeRefreshToken() {
    const token = this.getRefreshToken();
    if (!token) return null;
    localStorage.removeItem('refreshToken');
  },
  removePersist() {
    localStorage.removeItem('persist:app');
  },
  removeLanguage() {
    localStorage.removeItem('lang');
  },
};

export default storage;
