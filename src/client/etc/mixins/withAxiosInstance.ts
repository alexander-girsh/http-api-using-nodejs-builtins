import axios from 'axios';

export class WithAxiosInstance {
  protected axiosInstance: ReturnType<typeof axios.create>;
  constructor(axiosInstanceConfig: Parameters<typeof axios.create>[0]) {
    this.axiosInstance = axios.create(axiosInstanceConfig);
  }
}
