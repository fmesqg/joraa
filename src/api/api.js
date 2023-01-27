const baseUrl = "https://jo.azores.gov.pt/";
const returnUrl = "https://jo.azores.gov.pt/#/ato/";
const searchEndpoint = "api/public/search/ato?";
const seriesEndpoint = "api/public/series/list";
const entidadesEndpoint = "api/public/entidades/list";
const tiposEndpoint = "api/public/tiposato/list";
const atoEndpoint = "api/public/ato/";

export const seriesUrl = baseUrl + seriesEndpoint;
export const entidadesUrl = baseUrl + entidadesEndpoint;
export const tiposUrl = baseUrl + tiposEndpoint;

export function buildSearchQueryUrl(formData, page, pageSize) {
  const query = `searchText=${formData.searchText}&estados=6&page=${page}&pageSize=${pageSize}&importados&fromDate=${formData.fromDate}&toDate=${formData.toDate}&serie=${formData.serie}&tipoAto=${formData.tipo}&entidade=${formData.entidade}&ordenacao=${formData.ordenacao}`;
  return baseUrl + searchEndpoint + query;
}

export function buildAtoFetchUrl(id) {
  return baseUrl + atoEndpoint + id;
}

export function buildReturnUrl(id) {
  return returnUrl + id;
}
