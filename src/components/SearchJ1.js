import { useContext } from "react";
import UserContext from "../context/UserContext";
import Field from "./Field";

function SearchJ1() {
  const player1="Player 1";
  const { user1 } = useContext(UserContext);
  const username= "username1";
  const scrim = "userscrim1";
  return (
    <div>
      <Field user={user1} name={username} player={player1} scrim={scrim} />
    </div>
  );
}
export default SearchJ1;
