import classes from "./App.module.css";
import AutoComplete from "./components/AutoComplete";

function App() {
  return (
    <div className={classes.container}>
      <div className={classes.title}>AutoComplete Component</div>
      <AutoComplete />
    </div>
  );
}

export default App;
