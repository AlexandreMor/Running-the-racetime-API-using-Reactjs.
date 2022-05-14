import { useContext } from "react";
import UserContext from "../context/UserContext";

function Comparison() {
  const { user1, user2, date, datasRetrieved } = useContext(UserContext);
  return (
    <div>
      <h3>
        Comparison between these two players{" "}
        {date !== null ? `since the ${date}` : ""}
      </h3>
      <div className="main">
        {datasRetrieved === "yes" ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>
                  {user1.name}#{user1.scrim}
                </th>
                <th>
                  {user2.name}#{user2.scrim}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Races</th>
                <td>{user1.pastRaces.length}</td>
                <td>{user2.pastRaces.length}</td>
              </tr>
              <tr>
                <th>1st place</th>
                <td>{user1.numFirst}</td>
                <td>{user2.numFirst}</td>
              </tr>
              <tr>
                <th>2nd place</th>
                <td>{user1.numSecond}</td>
                <td>{user2.numSecond}</td>
              </tr>
              <tr>
                <th>3rd place</th>
                <td>{user1.numThird}</td>
                <td>{user2.numThird}</td>
              </tr>
              <tr>
                <th>Forfeit(s)</th>
                <td>{user1.forfeit}</td>
                <td>{user2.forfeit}</td>
              </tr>
              <tr>
                <th>Best time</th>
                <td>{user1.bestTime}</td>
                <td>{user2.bestTime}</td>
              </tr>
              <tr>
                <th>Win(s) vs opponent</th>
                <td>{user1.numWin}</td>
                <td>{user2.numWin}</td>
              </tr>
            </tbody>
          </table>
        ) : datasRetrieved === "processing" ? (
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Comparison;
