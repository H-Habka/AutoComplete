export async function fetchData() {
  return fetch("https://randomuser.me/api?results=50")
    .then((response) => response.json())
    .then((json) => {
      const data: any = json?.results?.map(
        (item: any) =>
          `${item?.name?.title} ${item?.name?.first} ${item?.name?.last}`
      );
      return data;
    });
}
