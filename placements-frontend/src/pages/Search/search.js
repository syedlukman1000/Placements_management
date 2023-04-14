
import React from "react"
import { useLocation, useSearchParams,Link } from "react-router-dom"
import api from "../../api"
import classes from './search.module.css'

const Search = () => {
    const location = useLocation()
    const [query] = useSearchParams()
    const [results, setResults] = React.useState([])
    const [term,setTerm]=React.useState(null)

    React.useEffect(() => {
        const fetch = async() => {
            const res = await api.get(`/search?q=${query.get('q')}`)
            setTerm(query.get('q'))
            setResults(res.data.result)
            console.log(res.data.result)
        }
        fetch()
    },[location])
    
    return <div className={classes.thisbody}>
        <h3 style={{ width: "100%", textAlign:"start"}}>Search results for "{term}"</h3>
        {results.map(c => {
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

export default Search