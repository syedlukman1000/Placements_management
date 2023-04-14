import React from "react";
import { useState } from "react";
import api from "../../api";
import classes from "./addrecruitment.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";

const Form = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [success, setSuccess] = useState(null)
    const [skills, setSkills] = useState([]);
    const [role, setRole] = useState(null);
    const [cgpa, setCgpa] = useState(null);
    const [backlogs, setBacklogs] = useState(null);
    const [year, setYear] = useState(null);
    const [hackathons, setHackathons] = useState(null);
    const [skill, setSkill] = useState(null);
    const [pack, setPack] = useState(null)
    const [academic_year, setAcademicYear] = useState(null);
    const [adding, setAdding] = React.useState(false)
    const addrecruitment = async (e) => {
        setAdding(true)
        e.preventDefault()
        const res = await api.post(`/addrecruitment/${id}`, {
            skills,
            role,
            cgpa,
            backlogs,
            year,
            hackathons,
            pack,
            academic_year,
        })
        setAdding(false)
        if (res.data.success) {
            setSuccess("Recruiter added successfull.")
            navigate(`/recruitment/${res.data.recruitment_id}`)
            console.log("successs")
        }
    }
    return (
        <div className={classes.thisbody} style={{ marginBottom: "10rem" }}>
            <h1 style={{ fontSize: "24px" }}>Add Recruitment</h1>
            <div className={classes.mainbody}>
                <form action="" method="" className={classes.form}>
                    <div className={classes.mainbody}>
                        <div className={classes.control}>
                            <input

                                className={classes.input}
                                type="text"
                                placeholder=" "
                                required
                                onChange={(e) => setRole(e.target.value)}

                            />
                            <span>Enter role</span>
                        </div>
                        <div className={classes.control}>
                            <input

                                className={classes.input}
                                type="text"
                                placeholder=" "
                                required
                                onChange={(e) => setCgpa(e.target.value)}

                            />
                            <span>Enter cut off CGPA</span>
                        </div>
                        <div className={classes.control}>
                            <input

                                className={classes.input}
                                type="text"
                                placeholder=" "
                                required
                                onChange={(e) => setAcademicYear(e.target.value)}

                            />
                            <span>Academic year</span>
                        </div>

                        <div className={classes.control}>
                            <input

                                className={classes.input}
                                type="text"
                                placeholder=" "
                                required
                                onChange={(e) => setBacklogs(e.target.value)}

                            />
                            <span>Enter cut off backlogs</span>
                        </div>

                        <div className={classes.control}>
                            <input

                                className={classes.input}
                                type="text"
                                placeholder=" "
                                required
                                onChange={(e) => setHackathons(e.target.value)}

                            />
                            <span>Enter cut off hackathons</span>
                        </div>

                        <div className={classes.control}>
                            <input

                                className={classes.input}
                                type="text"
                                placeholder=" "
                                required
                                onChange={(e) => setYear(e.target.value)}

                            />
                            <span>Enter graduation year</span>
                        </div>

                        <div className={classes.skill_div}>
                            <div id="added skills">
                                {
                                    skills.map(skill => (
                                        <button className={classes.skillButton} type="button" key={skill} onClick={() => {
                                            var arr = []
                                            for (let i = 0; i < skills.length; ++i) {
                                                if (skills[i] !== skill) {
                                                    arr.push(skills[i])
                                                }
                                            }
                                            setSkills(arr);
                                        }
                                        }>
                                            <i className="fa fa-close">{skill}</i>
                                        </button>
                                    ))
                                }
                            </div>
                            <div className={classes.input_skill_div}>
                                <input className={classes.skillsInput} placeholder="Add skills required" id="skill" onChange={e => setSkill(e.target.value)} required />
                                <button className={classes.addButton} type="button" onClick={() => {
                                    document.getElementById("skill").value = "";
                                    setSkills([...skills, skill]);
                                    setSkill("");
                                }} ><b>+</b></button>
                            </div>
                        </div>

                        <div className={classes.control}>
                            <input

                                className={classes.input}
                                type="text"
                                placeholder=" "
                                required
                                onChange={e => setPack(e.target.value)}

                            />
                            <span>Package</span>
                        </div>
                        <button className={classes.button} type="submit" onClick={addrecruitment}>
                            {adding ?
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                    <Spinner size={12} />
                                </div>
                                :
                                "Submit"
                            }
                        </button>


                    </div>

                </form>
            </div>
        </div>
    )
}

export default Form;