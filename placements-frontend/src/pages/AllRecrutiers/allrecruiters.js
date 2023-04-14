import React from "react";
import { useState,useEffect } from "react";
import api from "../../api";
import classes from "./allrecruiters.module.css";
import { useParams, useNavigate,useLocation ,Link} from "react-router-dom";
function Allrecruiters() {
    const [allrecruiter, setAllrecruiter] = useState([]);
    const location = useLocation()
    // const [name, setName] = useState([]);
    // const [description, setDescription] = useState([])
    const navigate = useNavigate();
    async function fetch() {
        const recruiters = await api.get('/allrecruiters')
        setAllrecruiter(recruiters.data.allrecruiter)
        console.log(recruiters.data.allrecruiter)
        console.log(allrecruiter[0])
        
        
        
    }
    useEffect(() => {
        fetch();
    }, [location])
    return <div className={classes.thisbody}>
    {allrecruiter.map(c => {
        return <div className={classes.card}>
            <div className={classes.image_div}>
                <img src={c.imageurl} className={classes.image} />
            </div>
            <div className={classes.rightside}>
                <Link style={{textDecoration:"none",color:"#202124"}} to={`/recruiter/${c._id}`}>
                    <h3 className={classes.name}>{c.name}</h3>
                </Link>
                
                <p className={classes.location}>{c.location}</p>
            </div>
        </div>
    })}
</div>
    
}
export default Allrecruiters