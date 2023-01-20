import classes from "./styles.module.css";
import { useState, useEffect, useRef } from "react";
import { fetchData } from "../../api";
import { filterData } from "../../utils";
import { ReactComponent as CancelIcon } from "../../assets/icons/cancel.svg";
const AutoComplete = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [usersArray, setUsersArray] = useState<string[]>([]);
  const [filterdData, setFilterdData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [closeDropDown, setCloseDropDown] = useState<boolean>(true);
  const [highlightedItemIdx, setHighlightedItemIdx] = useState<number>(-1);

  const autoCompleteContainerRef = useRef<HTMLDivElement>(null);
  const autoCompleteInputRef = useRef<HTMLInputElement>(null);
  const autoCompleteDropDown = useRef<HTMLUListElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCloseDropDown(false);
  };

  const handleItemClick = (item: string) => {
    setSearchQuery(item);
    setCloseDropDown(true);
  };

  const handleCancelSelected = () => {
    setSearchQuery("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        setHighlightedItemIdx((prev) =>
          prev === filterdData.length ? prev : prev + 1
        );
        return;
      case "ArrowUp":
        setHighlightedItemIdx((prev) => (prev === -1 ? prev : prev - 1));
        return;
      case "Enter":
        if (
          highlightedItemIdx >= 0 &&
          highlightedItemIdx < filterdData.length
        ) {
          setSearchQuery(filterdData[highlightedItemIdx]);
          setCloseDropDown(true);
        }
        return;
      case "Escape":
        setCloseDropDown(true);
    }
  };

  if (autoCompleteDropDown.current) {
    autoCompleteDropDown.current.scrollTop =
      highlightedItemIdx >= 7 ? (highlightedItemIdx - 7) * 29 : 0; // 29px is the height of each item in the list
  }

  useEffect(() => {
    setHighlightedItemIdx(-1);
  }, [closeDropDown]);

  useEffect(() => {
    // setCloseDropDown(false); //if dropdown state is false you should set it back to true when i change the search query
    setIsLoading(true);
    filterData(usersArray, searchQuery)
      .then((res: any) => {
        setIsLoading(false);
        setFilterdData(res);
      })
      .catch((err) => console.log(err));
  }, [searchQuery, usersArray]);

  useEffect(() => {
    fetchData()
      .then((res) => setUsersArray(res))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // click event listener on the document to hide or show drop down
    const clickEventHandler = (e: any) => {
      if (!autoCompleteContainerRef.current?.contains(e?.target)) {
        setCloseDropDown(true);
      } else if (autoCompleteInputRef.current?.contains(e?.target)) {
        setCloseDropDown(false);
      }
    };

    document.documentElement.addEventListener("click", clickEventHandler);
    // cleanup function
    // component will unmount
    return () => {
      document.documentElement.removeEventListener("click", clickEventHandler);
    };
  }, []);

  return (
    <div
      ref={autoCompleteContainerRef}
      className={classes.AutoCompleteContainer}
    >
      {searchQuery && (
        <CancelIcon
          onClick={handleCancelSelected}
          className={classes.cancelIcon}
        />
      )}

      <input
        ref={autoCompleteInputRef}
        onKeyDown={handleInputKeyDown}
        type="text"
        onChange={handleInputChange}
        className={classes.inputField}
        value={searchQuery}
      />
      {!closeDropDown && (
        <ul ref={autoCompleteDropDown} className={classes.dropDown}>
          {isLoading ? (
            <p className={classes.loadingText}>loading...</p>
          ) : filterdData.length === 0 ? (
            <div className={classes.noDataFound}>No Result Found...</div>
          ) : (
            // to highlight matches i tried to split the item and then the length of the array will be equal to (number of matches + 1) so i should show the search query between every to elements, in other words after every element instaid the last one.
            //so i did the following
            filterdData.map((item: string, idx: number) => {
              const splitedItem = item
                .toLowerCase()
                .split(searchQuery.toLowerCase());
              return (
                <p
                  onClick={() => handleItemClick(item)}
                  key={idx}
                  className={classes.listItem}
                  style={{
                    backgroundColor:
                      highlightedItemIdx === idx ? "cyan" : "",
                  }}
                >
                  {splitedItem.map((item, idx) =>
                    // the last element should not have a search query content after it
                    idx === splitedItem.length - 1 ? (
                      <span key={idx}>{item}</span>
                    ) : (
                      // the parent span is to give the idx to it as a key
                      // and the two child elements to show item and search query content which is the match itself
                      <span key={idx}>
                        <span>{item}</span>
                        <span className={classes.heighlight}>
                          {searchQuery}
                        </span>
                      </span>
                    )
                  )}
                </p>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
