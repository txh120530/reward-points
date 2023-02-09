
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
const today = new Date();
function calculateRewardsPerMonth(user) {
  if(!user.transactions){
    return null;
  }
  user.transactions.map(transaction=> {
    if (transaction.amount >=50 && transaction.amount < 100) {
      transaction.points = transaction.amount-50;
  } else if (transaction.amount >100){
    transaction.points = (2*(transaction.amount-100)+50);
  } else {
    transaction.points = 0;
  }
  })

}

function getLast3Months() {
    let last3Months = [];
    var month = 1;
    for(let i = 3; i > 0; i--)
    last3Months.push(((12 + month - i) % 12));
    return last3Months;
}

const getTotal = (user, months, typeToSum) => {
    let results = [];
    months.map((month, index) => {
        let filteredList = user.transactions.filter(transaction => new Date(transaction.date).getMonth() == month );
        results[index] = filteredList.reduce((acc,cur)=>cur[typeToSum]+acc,0);
    })
    return(results)
}

const filterDates = (user) => {
  let clonedInitialDate = new Date(+today);
  let initialMonth = today.getMonth();
  let monthsToGoBack = initialMonth - 3;
  let movedDate = new Date(clonedInitialDate.setMonth(monthsToGoBack));
  user.transactions = user.transactions.filter((transaction) => {
    return new Date(transaction.date).getTime() >= movedDate.getTime() &&
           new Date(transaction.date).getTime() <= today.getTime();
  });
}

const UserRewards = ({user}) => {
  filterDates(user);
  calculateRewardsPerMonth(user);
  const months = getLast3Months(user);
  const totalTransactions = getTotal(user, months, 'amount');
  const totalPoints = getTotal(user, months, 'points');

  return(<>
  <div className="points-container">
              <h2 className="points-container__name">{user.user}</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount Spent</th>
                <th>Reward Points</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{monthNames[months[0]]}</td>
                <td>${totalTransactions[0]}</td>
                <td>{totalPoints[0]}</td>
              </tr>
              <tr>
                <td>{monthNames[months[1]]}</td>
                <td>${totalTransactions[1]}</td>
                <td>{totalPoints[1]}</td>
              </tr>
              <tr>
                <td>{monthNames[months[2]]}</td>
                <td>${totalTransactions[2]}</td>
                <td>{totalPoints[2]}</td>
              </tr>
              <tr>
                <td><b>Total</b></td>
                <td><b>${totalTransactions[0] + totalTransactions[1] + totalTransactions[2]}</b></td>
                <td><b>{totalPoints[0] + totalPoints[1] + totalPoints[2]}</b></td>
              </tr>
            </tbody>
          </table>
          </div>
          </>
  )  
}

function App() {
  const [loadedUsers, setLoadedUsers] = useState([]);
  useEffect(() => {
    axios.get('data.json')
    .then(res => {
     setLoadedUsers(res.data);
    })
    .catch(err => console.log(err))
  }, [])
  return(
    loadedUsers.map((user, i) =>  {
      return (<UserRewards key={`${user}-${i}`} user={user}/>) 
  })
  )
}

export default App;
