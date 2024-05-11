import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function timestampToDateTime(timestamp:number) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2); // 注意月份是从0开始的
  const day = `0${date.getDate()}`.slice(-2);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function App() {

  const [countryList, setcountryList] = useState([])
  const [currentIndex, setcurrentIndex] = useState(0)
  
  useEffect(() => {
    axios.get('https://randomuser.me/api/?results=100')
    .then(res => {
      const { results } = res.data
      console.log(results)
      
      let countryList:any[] = []
      results.forEach((item:any) => {
        var date = new Date(item.registered.date);
        const timestamp = Math.floor(date.getTime());
        item.registered.timestamp = timestamp;
        item.registered.daytime = timestampToDateTime(timestamp)
        if (!countryList.find(itm => itm.country === item.location.country)) {
          countryList.push({
            country: item.location.country,
            list: [item]
          })
        } else {
          const countryItem = countryList.find(itm => itm.country === item.location.country)
          countryItem.list.push(item)
        }
      })
      countryList.sort(function(a, b) {
        return b.list.length - a.list.length;
      });
      countryList.forEach((item:any, index:number) => {
        item.id = index + 1
        item.list.sort(function(a:any, b:any) {
          return b.registered.timestamp - a.registered.timestamp;
        });
      })
      setcountryList(countryList)
    })
  }, [])

  return (
    <>
      {
        countryList.map((country:any, index) => (
          <div className="container">
            <div className="country-item">
              <div className="title-sec">
                <div>Country: {country.country}</div>
                <div className="user-count">(userCount: {country.list.length})</div>
                {
                  currentIndex === index + 1 ? 
                  <div className="expand-tip" onClick={() => setcurrentIndex(0)}>[collapse]</div> :
                  <div className="expand-tip" onClick={() => setcurrentIndex(index + 1)}>[expand]</div>
                }
              </div>
              {
                country.id === currentIndex &&
                (
                  <div className="content-sec">
                    {
                      country.list.map((item:any, index:number) => (
                        <div className="user-item">
                          <img className="avatar" src={item.picture.medium} alt="" />
                          <div className="info-item">
                          <span className="info-key">Name: </span>{item.name.first} {item.name.last}
                          </div>
                          <div className="info-item">
                          <span className="info-key">Gender: </span>{item.gender}
                          </div>
                          <div className="info-item">
                            <span className="info-key">City: </span>{item.location.city}
                          </div>
                          <div className="info-item">
                            <span className="info-key">State: </span>{item.location.state}
                          </div>
                          <div className="info-item">
                            <span className="info-key">Date Registered: </span>{item.registered.daytime}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>
        ))
      }
    </>
  )
}

export default App;
