import { useContext } from "react";
import UserContext from "../context/UserContext";

function Field(props) {
  const { handleChange } = useContext(UserContext);
  return (
    <div className="inputs">
      <label className="label" htmlFor="user">{props.player}</label>
      <input
        type="text"
        className="field"
        value={props.user.name}
        id={props.name}
        name={props.name}
        onChange={(e) => handleChange(e)}
      />
      <p className="hashtag">#</p>
      <input
        type="text"
        className="field"
        value={props.user.scrim}
        id={props.scrim}
        name={props.scrim}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
}

export default Field;
