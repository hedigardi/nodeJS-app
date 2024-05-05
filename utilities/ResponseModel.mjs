class ResponseModel {
  constructor({ status, error, data }) {
    this.success = status >= 200 && status <= 299;
    this.status = status;
    this.error = error || null;
    this.items = data ? (Array.isArray(data) ? data.length : 1) : 0;
    this.data = data || null;
  }
}

export default ResponseModel;
