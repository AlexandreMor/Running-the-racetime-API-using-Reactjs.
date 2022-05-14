import { useCallback, useState } from "react";
import "./App.css";
import Main from "./components/Main.js";
import axios from "axios";
import UserContext from "./context/UserContext";
import { userDatas } from "./datas/UserDatas";

function App() {
  const [user1, setUser1] = useState(userDatas);
  const [user2, setUser2] = useState(userDatas);

  const [datasRetrieved, setDatasRetrieved] = useState("no");

  const [date, setDate] = useState(null);

  const proxy = "http://127.0.0.1:8080/https://racetime.gg/";

  const handleChange = (e) => {
    e.preventDefault();
    switch (e.target.name) {
      case "username1":
        setUser1((prevState) => ({ ...prevState, name: e.target.value }));
        break;
      case "username2":
        setUser2((prevState) => ({ ...prevState, name: e.target.value }));
        break;
      case "userscrim1":
        setUser1((prevState) => ({ ...prevState, scrim: e.target.value }));
        break;
      case "userscrim2":
        setUser2((prevState) => ({ ...prevState, scrim: e.target.value }));
        break;
      case "date":
        setDate(e.target.value);
        break;
      default:
        setUser1({ ...userDatas });
        setUser2({ ...userDatas });
        break;
    }
  };

  const getRaces = useCallback(
    async (username, userscrim, setter) => {
      try {
        //First, we must indicate that we are collecting the datas to trigger the display of the "loading" icon.
        setDatasRetrieved("processing");
        //We need to clean the data to avoid displaying false ones.
        setter((prev) => ({
          ...userDatas,
          name: prev.name,
          scrim: prev.scrim,
        }));
        //We are collecting the ids of each player.
        const reqId = axios.get(
          proxy + `user/search/?name=${username}&scrim=${userscrim}`
        );
        const resId = await reqId;
        const id = resId.data.results[0].id;
        setter((prevState) => ({
          ...prevState,
          id: resId.data.results[0].id,
        }));
        //With these ids we can get the list of races he has participated in.
        //The races array can only hold ten races at a time, so we need to loop through the number of pages to get them all.
        const reqNumPages = axios.get(proxy + `user/${id}/races/data`);
        const resNumPages = await reqNumPages;
        const numPages = resNumPages.data.num_pages;
        const ootRaces = [];
        let bestTime = null;

        for (let i = 1; i < numPages; i++) {
          const resRaces = await axios.get(
            proxy + `user/${id}/races/data?page=${i}`
          );
          const dataRaces = await resRaces.data.races;
          //We only get the races from the date desired by the user till today.
          for (let j = 0; j < dataRaces.length; j++) {
            if (
              ((date !== null && date <= dataRaces[j].opened_at) ||
                date === null) &&
              dataRaces[j].name.includes("ootr") &&
              dataRaces[j].goal.name === "Standard Ruleset"
            ) {
              ootRaces.push(dataRaces[j].name);
            }
          }
        }
        setter((prevState) => ({
          ...prevState,
          pastRaces: ootRaces,
        }));
        //These loops allow us to count the number of podium places for each player.
        if (ootRaces.length !== 0) {
          for (let i = 0; i < ootRaces.length; i++) {
            const reqStats = await axios.get(proxy + ootRaces[i] + `/data`);
            const resStats = reqStats;
            const entrants = await resStats.data.entrants;
            for (let j = 0; j < entrants.length; j++) {
              if (entrants[j].user.id === id) {
                if (
                  (entrants[j].finish_time < bestTime && bestTime !== null) ||
                  bestTime === null
                ) {
                  bestTime = entrants[j].finish_time;
                }
                switch (entrants[j].place_ordinal) {
                  case "1st":
                    setter((prev) => ({
                      ...prev,
                      numFirst: prev.numFirst + 1,
                    }));
                    break;
                  case "2nd":
                    setter((prev) => ({
                      ...prev,
                      numSecond: prev.numSecond + 1,
                    }));
                    break;
                  case "3rd":
                    setter((prev) => ({
                      ...prev,
                      numThird: prev.numThird + 1,
                    }));
                    break;
                  case null:
                    setter((prev) => ({
                      ...prev,
                      forfeit: prev.forfeit + 1,
                    }));
                    break;
                  default:
                    console.log("aucun podium");
                    break;
                }
              }
            }
          }
          //We need to format the display of the player's best time for more understanding.
          const bestTimeFormatted = bestTime.slice(4, 12);
          setter((prevState) => ({
            ...prevState,
            bestTime: bestTimeFormatted,
          }));
        }

        //Necessary to return a promise for the chaining of asynchronous functions
        return new Promise((resolve) => resolve({ id: id, races: ootRaces }));
      } catch {
        setDatasRetrieved("no");
        alert(
          "An error has occured. Please enter two valid usernames with the correct associated scrims."
        );
      }
    },
    [date]
  );

  const getRacesInCommon = useCallback(async (array) => {
    try {
      //We collect all races in common between players.
      const request = new Promise((accepted) => {
        const inCommon = [];
        for (let i = 0; i < array[0].races.length; i++) {
          if (array[1].races.includes(array[0].races[i])) {
            inCommon.push(array[0].races[i]);
          }
        }
        accepted(inCommon);
      });
      const res = await request;

      //By comparing the place of the players on each race, we can award them a victory (or not if both players have forfeited)
      for (let i = 0; i < res.length; i++) {
        const request2 = axios.get(proxy + res[i] + `/data`);
        const res2 = await request2;
        const data2 = res2.data;
        let user1Index = data2.entrants.findIndex(
          (entrant) => entrant.user.id === array[0].id
        );
        let user2Index = data2.entrants.findIndex(
          (entrant) => entrant.user.id === array[1].id
        );
        if (
          data2.entrants[user1Index].place < data2.entrants[user2Index].place &&
          data2.entrants[user1Index].place !== null
        ) {
          setUser1((prevState) => ({
            ...prevState,
            numWin: prevState.numWin + 1,
          }));
        }
        if (
          data2.entrants[user1Index].place > data2.entrants[user2Index].place &&
          data2.entrants[user2Index].place !== null
        ) {
          setUser2((prevState) => ({
            ...prevState,
            numWin: prevState.numWin + 1,
          }));
        }
      }
      setDatasRetrieved("yes");
    } catch {
      setDatasRetrieved("no");
      alert("An error has occured. Please try later.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const races = Promise.all([
      getRaces(user1.name, user1.scrim, setUser1),
      getRaces(user2.name, user2.scrim, setUser2),
    ]);
    races.then((infos) => {
      getRacesInCommon(infos);
    });
  };

  return (
    <div className="App">
      <UserContext.Provider
        value={{
          user1: user1,
          user2: user2,
          date: date,
          handleChange: handleChange,
          handleSubmit: handleSubmit,
          datasRetrieved: datasRetrieved,
        }}
      >
        <Main />
      </UserContext.Provider>
    </div>
  );
}
export default App;
