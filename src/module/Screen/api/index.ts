export const fetchData = () => {
  return fetch('/api/leftPageData').then((response: any) => {
    return response.data;
  })
  .catch((e: any) => {
    console.log("error: ", e);
  });
}