
import React, { useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import classes from "./Recruitment.module.css"
import Modal from 'react-modal';
import { BsPlusLg } from 'react-icons/bs'
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";

Modal.setAppElement('#root')
const Recruitment = () => {
    const { id } = useParams()
    const [recruitement, setRecruitment] = React.useState(null)
    const [recruitement_logs, setRecruitmentLogs] = React.useState([])
    const [recruiter, setRecruiter] = React.useState(null)
    const [showForm, setShowForm] = React.useState(false)
    const [eligible_students, setEligibleStudents] = React.useState([])
    const [pre_eli, setPreEli] = React.useState([])
    const [filter_students, setFilterStudents] = React.useState([])
    const [modal_data, setModalData] = React.useState({})
    const [modalSelected, setModalSelected] = React.useState([])
    const [PreModalSelected, setPreModalSelected] = React.useState([])
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const dict = { "732": "CIVIL", "733": "CSE", "734": "EEE", "735": "ECE", "736": "MECH", "737": "IT" }
    const round_name_ref = React.useRef()
    const date_ref = React.useRef()
    const [addingStudents, setAddingStudents] = React.useState(false)
    const [addingRound, setAddingRound] = React.useState(false)
    const [refresh, setRefresh] = React.useState(false)
    const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    function openModal(id, arr, type) {
        //setModalData(data)
        setModalData({ type: type, id: id })
        setModalSelected(arr)
        setPreModalSelected(arr)
        setIsOpen(true);
    }

    function closeModal() {
        setModalSelected([])
        setPreModalSelected([])
        setModalData({})
        setIsOpen(false);
    }


    async function fetch() {
        const res = await api.get(`/recruitment/${id}`)
        setRecruitment(res.data.recruitment)
        setRecruitmentLogs(res.data.recruitement_logs)
        setRecruiter(res.data.recruiter)
        if (res.data.recruitement_logs == 0) {
            setEligibleStudents(res.data.recruitment.eligiblestudents)
            setPreEli(res.data.recruitment.eligiblestudents)
            setFilterStudents(res.data.recruitment.eligiblestudents)
        }
        else {
            let e = []
            let max_r = 0
            for (let i = 0; i < res.data.recruitement_logs.length; i++) {
                if (parseInt(res.data.recruitement_logs[i].round) > max_r) {
                    max_r = parseInt(res.data.recruitement_logs[i].round)
                    e = res.data.recruitement_logs[i].selected_students
                }
            }
            console.log(e)
            setEligibleStudents(e)
            setPreEli(e)
            setFilterStudents(e)
        }

        console.log(res)
    }
    useEffect(() => {
        fetch();
    }, [refresh])
    const manage = (m) => {
        if (!eligible_students.includes(m)) {
            setEligibleStudents([...eligible_students, m])
        }
        else {
            setEligibleStudents(eligible_students.filter(f => f != m))
        }
    }

    const manage_modal_students = (m) => {
        if (!modalSelected.includes(m)) {
            setModalSelected([...modalSelected, m])
        }
        else {
            setModalSelected(modalSelected.filter(f => f != m))
        }
    }

    const addround = async () => {
        setAddingRound(true)
        const res = await api.post('/add_recruitment_round', {
            recruitment_id: id,
            recruiter_id: recruitement.recruiter_id,
            name: round_name_ref.current.value,
            date: date_ref.current.value,
            eligible_students,
            round: recruitement_logs.length + 1
        })
        setAddingRound(false)
        if (res.data.success) {
            setShowForm(false)
            setRefresh(!refresh)
        }
    }

    const add_students = async (type, id) => {
        setAddingStudents(true)
        if (type == 1) {
            const res = await api.post('/add_selected_students', {
                recruitment_log_id: id,
                selected_students: modalSelected
            })
            console.log(res)
            if (res.data.success) {
                closeModal()
            }
            setAddingStudents(false)
            setRefresh(!refresh)
        }
        if (type == 2) {
            const res = await api.post('/add_attended_students', {
                recruitment_log_id: id,
                attended_students: modalSelected
            })
            console.log(res)
            if (res.data.success) {
                closeModal()
            }
            setAddingStudents(false)
            setRefresh(!refresh)
        }
    }

    const finish_recruitment = async () => {
        let max_r = 0
        let s = []
        for (let i = 0; i < recruitement_logs.length; i++) {
            if (parseInt(recruitement_logs[i].round) > max_r) {
                max_r = parseInt(recruitement_logs[i].round)
                s = recruitement_logs[i].selected_students
            }
        }
        if (s && s.length > 0) {
            const res = await api.post('/add_selected_students_into_recruitments', {
                recruitment_id: id,
                selected_students: s
            })
            if (res.data.success) {
                console.log("completed")
            }

        } else {
            console.log("No student got selected")
        }

    }

    const filter = (value) => {
        console.log(value)
        if (value == "") {
            setFilterStudents(pre_eli)
        }
        setFilterStudents(pre_eli.filter(f => f.includes(value)))
    }

    if (!recruitement || !recruiter) {
        return <div style={{ display: "flex", minHeight: "100vh", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Spinner size={"20px"} color="#407FEE" />

        </div>
    }
    return <div className={classes.thisbody}>
        <div className={recruitement.completed ? classes.top_layer_c : classes.top_layer_p}>
            <h1 style={{ fontSize: "1.2rem", margin: "0rem" }}>
                {`${recruiter.name} (${recruitement.academic_year})`}
            </h1>
            {!recruitement.completed && <div>
                {recruitement_logs.length > 0 && <button onClick={finish_recruitment} className={classes.add_round_btn}>Mark as complete</button>}
                <button onClick={() => setShowForm(!showForm)} className={classes.add_round_btn}>Add round {recruitement_logs.length + 1}</button>
            </div>
            }
            {recruitement.completed &&
                <button className={classes.finish_tag}>Finished</button>

            }
        </div>
        {showForm && <div className={classes.form_div} style={{ minHeight: "500px", border: "1px solid #e4e4e4", width: "700px" }}>
            <h2 style={{ fontSize: "1.1rem", marginTop: "0rem" }}>Round - {recruitement_logs.length + 1}</h2>
            <div className={classes.control}>
                <input
                    required
                    className={classes.input}
                    type="text"
                    placeholder=" "
                    ref={round_name_ref}
                />
                <span>Round name</span>
            </div>
            <div className={classes.control}>
                <input
                    required
                    className={classes.input}
                    type="date"
                    placeholder=" "
                    ref={date_ref}
                />
                <span>Date</span>
            </div>
            <p style={{ color: "#909090", fontSize: "0.9rem", marginTop: "2rem" }}>Eligible students</p>
            <div className={classes.eligible_div}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: "1.5rem 0rem", width: "100%", marginBottom: "1rem" }}>
                    <input type="text" placeholder="Search" className={classes.filter_input} onChange={e => filter(e.target.value)} />
                </div>
                <div className={classes.eligible_div_main}>
                    {filter_students.map(m => <div className={classes.single_student}>
                        <div style={{ display: "flex", flexDirection: "row", flexGrow: "1", alignItems: "center" }}>
                            <div className={classes.icon_div}>{dict[m.slice(6, 9)]}</div>
                            <span>{m}</span>
                        </div>
                        {<div className={eligible_students.includes(m) ? classes.selected : classes.not_selected} style={{ marginLeft: "1.5rem" }}
                            onClick={() => manage(m)}>
                        </div>}
                    </div>
                    )}
                </div>
            </div>
            <button onClick={addround} className={classes.button}>
                {addingRound ?
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                        <Spinner size={12} />
                    </div>
                    :
                    "Add round"
                }
            </button>
        </div>}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {recruitement_logs.map(m => {
                return <div className={classes.round_div}>
                    <p style={{ marginBottom: '0px' }}>{m.name}</p>
                    <p style={{ color: "#909090", fontSize: "13px", marginTop: "5px" }}>
                        {`${new Date(m.date).getDate()} ${Months[new Date(m.date).getMonth()]}, ${new Date(m.date).getFullYear()}`}</p>
                    <div className={classes.round_info_div}>
                        <div className={classes.single_info_div}>
                            <span style={{ fontSize: "24px", fontWeight: "600", margin: "0rem" }}>{m.eligible_students.length}</span>
                            <p>Eligible students</p>
                        </div>
                        <div className={classes.single_info_div}>
                            {m.attended_students ? <p style={{ fontSize: "24px", fontWeight: "600", margin: "0rem" }}>{m.attended_students.length}</p>
                                :
                                <BsPlusLg onClick={() => openModal(m._id, m.eligible_students, 2)} className={classes.plus_icon} />
                            }
                            <p>Attended students</p>
                        </div>

                        <div className={classes.single_info_div}>
                            {m.selected_students ? <p style={{ fontSize: "24px", fontWeight: "600", margin: "0rem" }}>{m.selected_students.length}</p>
                                :
                                <BsPlusLg onClick={() => openModal(m._id, m.eligible_students, 1)} className={classes.plus_icon} />
                            }
                            <p>Selected students</p>
                        </div>

                    </div>

                </div>
            })}
        </div>

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className={classes.modal}
            overlayClassName={classes.overlay}
            contentLabel="Example Modal"
        >
            <div className={classes.eligible_div_modal}>
                {PreModalSelected.map(m => <div className={classes.single_student_modal}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <div className={classes.icon_div}>{dict[m.slice(6, 9)]}</div>
                        <span>{m}</span>
                    </div>
                    {<div className={modalSelected.includes(m) ? classes.selected : classes.not_selected} style={{ marginLeft: "1.5rem" }}
                        onClick={() => manage_modal_students(m)}>
                    </div>}
                </div>
                )}
            </div>
            <button className={classes.button} style={{ width: "90%" }} onClick={() => add_students(modal_data.type, modal_data.id)}>
                {addingStudents ?
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                        <Spinner size={12} />
                    </div>
                    :
                    modal_data.type == 1 ? "Add selected students" : "Add attended students"
                }

            </button>

        </Modal>
    </div>
}

export default Recruitment