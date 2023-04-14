import api from "../../api"
import React, { useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import classes from './stats.module.css'
import { Pie } from 'react-chartjs-2';
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Stats() {
  const [res, setResult] = React.useState(null)
  async function fetch() {
    const res = await api.get("/stats")
    setResult(res)
    console.log(res.data.data[0])
    console.log(res.data.branches)
    console.log(res.data.branchsat)

  }
  useEffect(() => {
    fetch();
  }, [])
  if (!res) {
    return <div style={{ display: "flex", minHeight: "100vh", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <Spinner size={"20px"} color="#407FEE" />

    </div>
  }
  return <div className={classes.thisbody}>
    <h1 style={{ fontSize: "24px", textAlign: "left", width: "100%" }}>Stats</h1>
    <div className={classes.display}>
      <div className={classes.pie_div} style={{ marginRight: "3rem" }}>
        <Pie
          options={{
            plugins: {
              legend: {
                display: true, position: "bottom", labels: {
                  padding: 13, usePointStyle: true, pointStyle: "circle",
                  boxWidth: 8, boxHeight: 8
                }
              }
            }
          }}
          data={{
            labels: res.data.label[0],
            datasets: [
              {
                label: "# of Votes",
                data: res.data.data[0],
                backgroundColor: ['#407FEE', '#808080', "#330906"],
                borderColor: '#ffffff',
                borderWidth: 1,
              },
            ],
          }}
        />

      </div>

      <div className={classes.pie_div}>
        <Pie
          options={{
            plugins: {
              legend: {
                display: true, position: "bottom", labels: {
                  padding: 13, usePointStyle: true, pointStyle: "circle",
                  boxWidth: 8, boxHeight: 8
                }
              }
            }
          }}
          data={{
            labels: res.data.label[1],
            datasets: [
              {
                label: "# of Votes",
                data: res.data.data[1],
                backgroundColor: ['#81e7e1', '#50bfe0', '#f7e0e1', '#d7948c', '#b7bfe4', '#90ee90', '#808080', "#330906"],
                borderColor: '#ffffff',
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>
      <div className={classes.pie_div} style={{ marginLeft: "3rem" }}>
        <Pie
          options={{
            plugins: {
              legend: {
                display: true, position: "bottom", labels: {
                  padding: 13, usePointStyle: true, pointStyle: "circle",
                  boxWidth: 8, boxHeight: 8
                }
              }
            }
          }}
          data={{
            labels: res.data.label[2],
            datasets: [
              {
                label: "# of Votes",
                data: res.data.data[2],
                backgroundColor: ['#F89999', '#b7bfe4', '#50bfe0',],
                borderColor: '#ffffff',
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>
    </div>
    {/*<div className={classes.display} >


        </div>*/}
    <div className={classes.dis_card} style={{ marginBottom: '5rem' }}>
      <h2 style={{ color: "#202124", fontSize: "18px", width: "100%", textAlign: "start", marginBottom: "0px" }}>Branch wise stats</h2>
      {res.data.branches.map(m => {
        return <div className={classes.card}>
          <p className={classes.top} style={{ marginTop: "0rem", marginBottom: "0.7rem" }}>
            <div className={classes.branch}>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>{m}</span>
            </div>
            <div>
              <span style={{ fontSize: "15px", color: "#909090" }}>{res.data.branchsat[m][3]} placed</span>
            </div>
          </p>
          <div style={{
            display: "flex", flexDirection: "row",
            alignItems: "center", justifyContent: "center", marginTop: "0rem"
          }}>
            <div className={classes.single_stat}>
              <span >{res.data.branchsat[m][0]}L</span>
              <p>Min sal</p>
            </div>
            <div className={classes.single_stat}>
              <span>{res.data.branchsat[m][1]}L</span>
              <p>Max sal</p>
            </div>
            <div className={classes.single_stat}>
              <span>{res.data.branchsat[m][2]}L</span>
              <p>Avg sal</p>
            </div>
          </div>
        </div>
      })}

    </div>
  </div>


}
export default Stats