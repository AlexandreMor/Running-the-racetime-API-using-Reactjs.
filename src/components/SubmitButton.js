import { useContext } from "react";
import UserContext from "../context/UserContext";

function SubmitButton() {
  const { handleSubmit } = useContext(UserContext);
  return <div><button onClick={(e) => handleSubmit(e)}>Submit</button></div>;
}
export default SubmitButton;
