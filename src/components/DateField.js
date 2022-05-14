import { useContext } from "react";
import UserContext from "../context/UserContext";

function DateField() {
  const { handleChange } = useContext(UserContext);
  return <div><label className="label" htmlFor="user">From this date to today</label>
  <input type="date" name="date" onChange={(e) => handleChange(e)} /></div>
}

export default DateField;
