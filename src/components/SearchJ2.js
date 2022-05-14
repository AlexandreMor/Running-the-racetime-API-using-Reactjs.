import { useContext } from "react";
import UserContext from "../context/UserContext";
import Field from "./Field";

function SearchJ2() {
  const player2="Player 2";
  const { user2 } = useContext(UserContext);
  const username = "username2";
  const scrim = "userscrim2";
  return (
    <div>
      <Field user={user2} name={username} player={player2} scrim={scrim} />
    </div>
  );
}
export default SearchJ2;
