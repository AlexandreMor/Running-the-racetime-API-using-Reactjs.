import SearchJ1 from "./SearchJ1.js";
import SearchJ2 from "./SearchJ2.js";
import Comparison from "./Comparison.js";
import SubmitButton from "./SubmitButton.js";
import DateField from "./DateField.js";

function Main() {
  return (
    <div>
      <h2>Enter a valid username from Racetime.gg</h2>
      <h6>
        Here is a list of Ocarina of Time Randomizer players :{" "}
        <a href="https://racetime.gg/ootr/leaderboards">Click</a>
      </h6>
      <h6>Keep in mind that this site only collects data from races played on Ocarina of Time Randomizer with the standard ruleset.</h6>
      <div className="form">
        <SearchJ1 />
        <SearchJ2 />
        <DateField />
        <SubmitButton />
        <Comparison />
      </div>
    </div>
  );
}

export default Main;
