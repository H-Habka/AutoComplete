export function filterData(arrayOfData: string[], query: string) {
  return new Promise((resolve, reject) => {
    if (!query) {
      resolve(arrayOfData); // when the search query is empty i return the entire array of users
      //in real project i should get the first page of data only
    } else {
      const filterdArray: string[] = arrayOfData.filter(
        (item) => item.toLocaleLowerCase().includes(query.toLowerCase()) //return any item that include the search query
      );
      setTimeout(() => {
        resolve(filterdArray);
      }, 1000);
    }
  });
}
