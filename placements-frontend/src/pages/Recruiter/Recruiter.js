import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api"
import classes from "./Recruiter.module.css"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
function Recruiter() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [result, setResult] = useState(null)
    const [company, setCompany] = useState(null)
    const [recruitments, setRecruitments] = useState(null)
    const [girlsvsboys, setGirlsvsboys] = useState(null)
    const [branches, setBranches] = useState(null)
    const [labels, setLabels] = useState(null)
    const [completed, setComplete] = useState(null)

    async function fetch() {

        const res = await api.get(`/recruiter/${id}`)

        setResult(res.data)
        console.log(res.data)
        setCompany(res.data.company[0])
        setRecruitments(res.data.recruitments)
        setGirlsvsboys(res.data.gb)
        setBranches(res.data.branches)
        setLabels(res.data.labels)

        console.log(company)
        console.log(recruitments)
        console.log(girlsvsboys)

    }
    useEffect(() => {
        fetch();
    }, [])
    if (!result) {
        return <div style={{ display: "flex", minHeight: "100vh", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Spinner size={"20px"} color="#407FEE" />

        </div>
    }
    /*if (branches.length == 0) {
        return <div>

            <h1 className={classes.div_name}>
                {company.name}
            </h1>
            <div className={classes.div_img}>
                <img className={classes.img} src={company.imageurl} />
            </div>
            <div className={classes.div_des}>
                {company.description}
            </div>
            <h3 className={classes.div_name}>
                Recruitment History
            </h3>
            <div className={classes.dis_card}>
                {recruitments.map(m => <div className={classes.card}><div className={classes.div_status} style={{ cursor: "pointer" }} onClick={() => navigate(`/recruitment/${m._id}`)}>
                    <h3>{m.academic_year}</h3>
                    <div>

                        {m.completed === true ? <h3 style={{ color: "green" }}>Finished</h3> : <h3 style={{ color: "red" }}>in progress</h3>}

                    </div>


                </div>
                    <div> {m.completed === true ? <div className={classes.completed}>
                        <div>
                            package offered :{m.package} LPA
                    </div>
                        <div>
                            no of students selected : {m.selected_students.length}
                        </div>
                    </div> : <></>}
                    </div>
                </div>
                )}




            </div>
            <Link to={`/addrecruitment/${id}`}>Add recruitement</Link>


        </div>



    }*/
    return <div style={{ marginBottom: '10rem' }}>

        <h1 className={classes.div_name}>
            {company.name}
        </h1>
        <div className={classes.div_img}>
            <img className={classes.img} src={company.imageurl} />
        </div>
        <div className={classes.div_des}>
            {company.description}
        </div>
        <h3 className={classes.div_name} style={{ fontSize: "18px", marginTop: "2rem" }}>
            Latest recruitement stats
        </h3>

        <div>
            {branches.length > 0 && <div>
                <p className={classes.package}>
                    {recruitments[0].package} LPA package
            </p>
                <p className={classes.package} style={{ marginLeft: "15px" }}>
                    {result.sumi} students placed
            </p>
                <div className={classes.display}>
                    <div className={classes.pie_div} style={{ marginRight: "3rem" }}>
                        <Pie
                            options={{
                                plugins: {
                                    legend: {
                                        display: true, position: "bottom", labels: {
                                            padding: 13, usePointStyle: true, pointStyle: "circle",
                                            boxWidth: 20, boxHeight: 20
                                        }
                                    }
                                }
                            }}
                            data={{
                                labels: ["girls", "boys"],
                                datasets: [
                                    {
                                        label: "got placement",
                                        data: girlsvsboys,
                                        backgroundColor: ['#ff985f', '#008080', '#000000', '#c563a9', '#ffe800', '#81e7e1', "rgba(253, 0, 13, 0.68)", '#50bfe0', '#f7e0e1', '#d7948c', '#b7bfe4', '#90ee90', '#808080', "#330906"],
                                        borderColor: '#ffffff',
                                        borderWidth: 1,
                                    },
                                ],
                            }} />
                    </div>
                    <div className={classes.pie_div}>

                        <Pie
                            options={{
                                plugins: {
                                    legend: {
                                        display: true, position: "bottom", labels: {
                                            padding: 13, usePointStyle: true, pointStyle: "circle",
                                            boxWidth: 20, boxHeight: 20
                                        }
                                    }
                                }
                            }}
                            data={{
                                labels: labels,
                                datasets: [
                                    {
                                        label: "got placement",
                                        data: branches,
                                        backgroundColor: ['#ff6384', '#36a2eb', 'yellow', '#c563a9', '#ffe800', '#81e7e1', "rgba(253, 0, 13, 0.68)", '#50bfe0', '#f7e0e1', '#d7948c', '#b7bfe4', '#90ee90', '#808080', "#330906"],
                                        borderColor: '#ffffff',
                                        borderWidth: 1,
                                    },
                                ],
                            }} />
                    </div>
                </div>
            </div>
            }

            <div className={classes.rec_div} style={{ marginTop: '5rem' }}>

                <h2 style={{ fontSize: "18px", margin: "0px" }}>Recruitment History</h2>

                <Link to={`/addrecruitment/${id}`} style={{ textDecoration: "underline", fontSize: '0.9rem' }}>Add recruitement</Link>
            </div>
            <div className={classes.dis_card}>
                {recruitments.map(m => <div className={classes.card}><div className={classes.div_status} style={{ cursor: "pointer" }} onClick={() => navigate(`/recruitment/${m._id}`)}>
                    <h3 style={{ marginTop: '0px', fontSize: '17px' }}>{m.academic_year}</h3>
                    <div>
                        {m.completed === true ? <span className={classes.finish_tag}>Finished</span> :
                            <span style={{ backgroundColor: "#F4E07C" }} className={classes.finish_tag}>In progress</span>}
                    </div>


                </div>
                    {m.completed === true && <p style={{ marginBottom: '0px', marginTop: '0.3rem' }}>
                        Package offered : {m.package} LPA
                        </p>}
                    {m.completed === true && <p style={{ marginBottom: '0px', marginTop: '0.3rem' }}>
                        No of students selected : {m.selected_students.length}
                    </p>}
                    {/*<div>{m.completed === true ? <div className={classes.completed}>
                        <div>
                            package offered :{m.package} LPA
                        </div>
                        <div>
                            no of students selected : {m.selected_students.length}
                        </div>
                    </div> : <></>
        </div>*/}
                </div>
                )}




            </div>
        </div>
    </div>
}

export default Recruiter