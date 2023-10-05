export const kelvinToCelsius = (temp: number) => (temp - 273.15).toFixed(2);

export const getRequestValue = (req: any, domain: string, key: string) => {
  if (req && req[domain]) {
    return Array.isArray(req[domain][key])
      ? req[domain][key][0]
      : req[domain][key];
  }
  return undefined;
};
