import React, { useEffect, useState } from 'react';
import api from "../../api"

const Attendance=()=>{
    const [date,setDate]=useState();
    const [deptId,setDeptId]=useState();
    const [students,setStudents]=useState([]);
    const depts=["CSE","ECE","IT","EEE","Mech","Civil","Chem","Bio-tech"]
    const deptIds=["733","735","737","734","736","732","802","805"]
    // const depts1={"CSE":"733"}
    const selectDept=(e)=>{
        setDeptId(deptIds[depts.indexOf(e.target.value)]);
        
    }
    async function fetch(date,deptId){
        const rollnos=await api.post('/students',{date,deptId});
        setStudents(rollnos.data.s);
        console.log(rollnos.data.s)
    }

    // async function fetch(){
    //     const students=await api.get(`/students/dept${deptId}`)
    // }
    useEffect(()=>{
        console.log(date,deptId)
        fetch(date,deptId);
    },[date,deptId]);

    return(
        <div style={{padding:"20%"}}>
            <form>
            <input type="date" onChange={(e=>setDate(e.target.value))}/>
            <select onChange={selectDept}>
                <option>Select Dept</option>
                {depts.map((dept,index)=>{
                    return <option key={index}>
                        {dept}
                    </option>
                })}
            </select>
            {/* <p>{date}-{depts}</p> */}
            <div>{students.map(s=>{
                return <div key={s}>{s}</div>
            })}</div>
            {/* <button>Find Students</button> */}
            </form>
        </div>
    )
}

export default Attendance;