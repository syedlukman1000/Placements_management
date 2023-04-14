const express = require("express")
require('dotenv').config()
const app = express()
const db = require('./db');
const nodemailer = require("nodemailer")
const { ObjectID, ObjectId } = require('mongodb');
const cors = require('cors')
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
const path = require('path')



db.initDb((err, db) => {
    if (err) {
        console.log(err)
    } else {
        console.log("connected")
        const port = process.env.PORT || 3001
        console.log(port)
        app.listen(port)
    }
})


app.post('/adduser', async (req, res) => {
    try {
        const database = db.getDb().db("Placements")
        await database.collection("students").insertMany(
            [{
                _id: "160120737178",
                name: "Sai Krishna Puni",
                gender: "male",
                cgpa: 9.1,
                mail: "punisaikrishna@gmail.com",
                branch: "it",
                contact_number: "9951645990",
                year_of_passing: 2024,
                skills: ["react", "express"]
            },
            {
                _id: "160120737172",
                name: "Shiva Theja",
                gender: "male",
                cgpa: 9.38,
                mail: "shivatheja.l@gmail.com",
                branch: "it",
                contact_number: "9441791701",
                year_of_passing: 2024,
                skills: ["react", "express"]
            },
            {
                _id: "160120737177",
                name: "Srinath reddy",
                gender: "male",
                cgpa: 9.28,
                mail: "srinathreddy200230@gmail.com",
                branch: "it",
                contact_number: "7981602417",
                year_of_passing: 2024,
                skills: ["react", "express"]
            }
            ]
        )
        res.send("inserted")
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
})
app.post('/addrecruiter', async (req, res) => {
    try {
        const database = db.getDb().db("Placements")
        await database.collection("recruiters").insertOne({
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            type: req.body.type,
            imageurl: req.body.imageurl
        })
        res.send({ success: 1 })
    }
    catch (err) {
        console.log(err)
        res.send({ error: err.message })
    }
})
app.post('/addrecruitment/:id', async (req, res) => {
    try {

        console.log(req.params.id)
        const database = db.getDb().db("Placements")
        const x1 = await database.collection('recruitments').insertOne({
            skills: req.body.skills,
            academic_year: req.body.academic_year,
            role: req.body.role,
            cgpa: parseFloat(req.body.cgpa),
            recruiter_id: ObjectId(req.params.id),
            hackathons: req.body.hackathons,
            year: req.body.year,
            package: parseFloat(req.body.pack),
            eligiblestudents: [],
            selected_students: []
        })
        const studentslist = await database.collection("students").find({ 'cgpa': { $gte: parseFloat(req.body.cgpa) } }).toArray()

        console.log(studentslist)

        let mail = []
        let gender = []
        let id = []
        let branch = []

        for (let i = 0; i < studentslist.length; i++) {
            mail.push(studentslist[i].mail)
            gender.push(studentslist[i].gender)
            id.push(studentslist[i]._id)
            branch.push(studentslist[i].branch)
        }


        let x = mail

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'it3batch3@gmail.com',
                pass: 'rzgmeqvufcqtzeyp'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        for (let i = 0; i < 2; i++) {
            var mailoptions = {
                from: 'it3batch3@gmail.com',
                to: x[i],
                subject: 'mail',
                text: 'mail sent',

            };
            transporter.sendMail(mailoptions, function (err, info) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("sent");
                }
            })

        }
        await database.collection("recruitments").updateOne({ _id: ObjectId(x1.insertedId) },
            {
                $set: { "eligiblestudents": id }
            })
        res.send({ success: 1, recruitment_id: x1.insertedId })

    }
    catch (err) {
        res.send({ error: err.message })
        console.log(err)
    }
})
app.get("/recruiter/:id", async (req, res) => {
    const id = req.params.id
    const database = db.getDb().db("Placements")
    const company = await database.collection("recruiters").find({ _id: ObjectId(id) }).toArray()
    const recruitments = await database.collection("recruitments").find({ recruiter_id: ObjectId(id) }).toArray()
    let s_b = { 'it': 0, "cse": 0, "civil": 0, "eee": 0, "mech": 0, "ece": 0, "chem": 0 }
    dict = { "732": "civil", "733": "cse", "734": "eee", "735": "ece", "736": "mech", "737": "it" }
    console.log(recruitments)
    selected = recruitments[0].selected_students

    gb = [0, 0]
    if (selected != []) {
        for (let i = 0; i < selected.length; i++) {
            gender = await database.collection("students").find({ _id: selected[i] }).toArray()
            if (gender[0].gender == "male") {
                gb[1] += 1

            }
            else {
                gb[0] += 1
            }
        }
        for (let i = 0; i < selected.length; i++) {
            s_b[dict[selected[i].slice(6, 9)]] += 1
        }



    }

    labels = []
    branches = []
    sumi = 0
    for (i in s_b) {
        if (s_b[i] != 0) {
            labels.push(i)
            branches.push(s_b[i])

        }

    }
    if (gb != []) {
        sumi = gb[0] + gb[1]
    }


    // console.log(company[0].name)
    // console.log(req.params)
    res.send({
        company, recruitments, gb, branches, labels, sumi
    })
})
app.get("/recruitment/:id", async (req, res) => {
    try {
        const id = req.params.id
        const database = db.getDb().db("Placements")
        const recruitment = await database.collection("recruitments").findOne({ _id: ObjectId(id) })
        const recruitement_logs = await database.collection("recruitment_logs").find({ recruitment_id: ObjectId(id) }).toArray()
        const recruiter = await database.collection("recruiters").findOne({ _id: ObjectId(recruitment.recruiter_id) })
        console.log(recruiter)
        // console.log(company[0].name)
        // console.log(req.params)
        res.send({
            recruitment, recruitement_logs, recruiter
        })
    } catch (err) {
        res.send({ error: err.message })
    }
})
app.get("/allrecruiters", async (req, res) => {
    try {
        const database = db.getDb().db("Placements")
        const allrecruiter = await database.collection("recruiters").find().toArray()
        console.log(allrecruiter)
        res.send({
            allrecruiter
        })
    }
    catch (err) {
        res.send({ error: err.message })
    }
})
app.get("/", async (req, res) => {

    try {
        const database = db.getDb().db("Placements")
        const result = await database.collection("recruitments").find().toArray()
        hp = 0
        avg = 0
        c = 0

        dict1 = { "732": "civil", "733": "cse", "734": "eee", "735": "ece", "736": "mech", "737": "it" }
        comp = {}
        const result1 = await database.collection("recruitments").find(
            { academic_year: { $eq: "2021-2022" } }).toArray()
        pack = {}
        for (i = 0; i < result1.length; i++) {
            k = await database.collection('recruiters').findOne({ _id: result1[i].recruiter_id }
            )
            pack[k.name] = result1[i].package
        }
        sum2 = {}

        for (let i = 0; i < result1.length; i++) {
            hp = Math.max(result1[i].package, hp)
            avg += result1[i].package * (result1[i].selected_students.length)
            c += result1[i].selected_students.length
            dict = { 'it': 0, 'cse': 0, 'civil': 0, 'mech': 0, 'eee': 0, 'ece': 0, 'chem': 0 }

            for (let j = 0; j < result1[i].selected_students.length; j++) {
                dict[dict1[result1[i].selected_students[j].slice(6, 9)]] += 1
            }
            res1 = await database.collection('recruiters').findOne({
                _id: result1[i].recruiter_id

            })
            k = 0
            for (o in dict) {
                k = k + dict[o]
            }

            if (k != 0) {
                if ([res1.name] in comp) {
                    for (k in dict) {
                        comp[res1.name][k] += dict[k]

                    }
                }
                else {
                    comp[res1.name] = dict
                }
            }
        }

        avg = Math.round(avg / c)
        console.log(comp);
        compname = []
        for (i in comp) {
            compname.push(i)
        }
        for (i in comp) {
            sum2[i] = [0, 0]
            for (j in dict) {
                sum2[i][0] += comp[i][j]
                sum2[i][1] = pack[i]
            }
        }
        console.log(sum2)
        console.log(compname)
        console.log(pack)
        // console.log(hp)
        // console.log(avg)
        // console.log(c)
        dict1 = {}
        for (let i = 0; i < result.length; i++) {
            if (result[i].academic_year in dict1) {
                dict1[result[i].academic_year][0] += result[i].package * (result[i].selected_students.length)
                dict1[result[i].academic_year][1] += result[i].selected_students.length
            }
            else {
                dict1[result[i].academic_year] = [result[i].package * (result[i].selected_students.length), result[i].selected_students.length]
            }
        }


        for (i in dict1) {
            dict1[i][0] = dict1[i][0] / dict1[i][1]
        }
        // console.log(dict1)
        labels = []
        data = []
        for (i in dict1) {
            labels.push(i)
            data.push(dict1[i][0])
        }
        labels = labels.reverse()
        data = data.reverse()
        dataOfUpcomingRounds = []
        // code for displaying upcoming rounds for dashboard
        const dataForUpcomingRounds = await database.collection("recruitment_logs").find({ /*date: { $gte: new Date() } */ }).toArray();
        for (let i = 0; i < dataForUpcomingRounds.length; ++i) {
            var calc = Math.ceil(
                (
                    dataForUpcomingRounds[i].date.getTime() - (new Date()).getTime()
                )
                /
                (1000 * 3600 * 24)
            )
            console.log(dataForUpcomingRounds[i].date, calc);
            if (calc >= 0) {
                dataForUpcomingRounds[i].calc = calc
                dataOfUpcomingRounds.push(dataForUpcomingRounds[i])
            }
        }
        // console.log(dataOfUpcomingRounds.length);
        res.send({ hp, avg, c, data, labels, dataOfUpcomingRounds, compname, comp, sum2 })

    }
    catch (err) {
        console.log(err)
    }
})
app.get("/search", async (req, res) => {
    const comapanyname = req.query.q
    console.log(comapanyname)
    try {
        const database = db.getDb().db("Placements")
        const result = await database.collection("recruiters").aggregate([
            {
                $search: {
                    index: 'searchRecruiters',
                    text: {
                        query: comapanyname,
                        path: "name",
                        "fuzzy": {
                            maxEdits: 2,
                            maxExpansions: 50
                        }
                    }
                }
            }

        ]).toArray()
        console.log(result)
        res.send({ result })
    }
    catch (err) {
        res.send({ error: err.message })
    }
})
app.post("/recruitment_status", async (req, res) => {
    try {

        const database = db.getDb().db("Placements")
        await database.collection("recruitments").insertOne({
            year: 2022,
            companyname: 'Google',
            role: 'abc',
            date: '22-10-2022',
            criteria: { 'Cgpa': 8.00, 'skills': ['java', 'c'], 'Backlogs': 0, 'Hackthons': 2, 'Graduation year': 2024 },
            package: 24,
            eligiblestudents: [],
            selectedstudents: [],
        })

        const db1 = db.getDb().db("Placements")
        const studentslist = await db1.collection("students").find({ 'cgpa': { $gte: 9.3 } }).toArray()
        // console.log(studentslist[0].mail,studentslist[0]._id)
        var s1 = []
        var s2 = []
        for (let i = 0; i < studentslist.length; i++) {
            s1.push(studentslist[i].mail)
            s2.push(studentslist[i]._id)

        }


        // var x = s1
        // var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'it3batch3@gmail.com',
        //         pass: 'rzgmeqvufcqtzeyp'
        //     }
        // });
        // for (let i = 0; i < x.length; i++) {
        //     var mailoptions = {
        //         from: 'it3batch3@gmail.com',
        //         to: x[i],
        //         subject: 'mail',
        //         text: 'mail sent',

        //     };
        //     transporter.sendMail(mailoptions, function (err, info) {
        //         if (err) {
        //             console.log(err);
        //         }
        //         else {
        //             console.log("sent");
        //         }
        //     })

        // }
        // db1.collection("recruitments").updateOne({ companyname: req.body.companyname },
        //     { $set: { "eligiblestudents": s2 } })
        // res.send("sent")



    }
    catch (err) {
        console.log(err)
        res.send(err.message)
    }

})
app.post('/add_selected_students_into_recruitments', async (req, res) => {
    try {
        const { recruitment_id, selected_students } = req.body;
        const database = db.getDb().db("Placements")
        newid = ObjectID(recruitment_id)
        let s_b = { 'it': 0, "cse": 0, "civil": 0, "eee": 0 }
        dict = { "732": "civil", "733": "cse", "734": "eee", "735": "ece", "736": "mech", "737": "it" }
        for (let i = 0; i < selected_students.length; i++) {
            if (s_b[dict[selected_students[i].slice(6, 9)]] != null) {
                s_b[dict[selected_students[i].slice(6, 9)]] += 1
            }
        }
        console.log(s_b)
        await database.collection("recruitments").updateOne({ _id: newid },
            {
                $set: {
                    selected_students: selected_students,
                    it: s_b["it"],
                    cse: s_b["cse"],
                    completed: true
                }
            })
        await database.collection("students").updateMany({ _id: { $in: selected_students } }, {
            $push: {
                obtainedCompanies: { recruitment_id: recruitment_id }
            }
        })
        /*for (let i = 0; i < selectedstudents.length; ++i) {
            const companies = await database.collection("students").find({ _id: { $eq: selectedstudents[i] } }).obtainedCompanies
            const tempDoc = { companyName: companyname, obtainedRole: role }
            companies1.push(tempDoc)
            await database.collection("students").updateOne({ _id: selectedstudents[i] }, { $set: { obtainedCompanies: companies1 } })

        }*/
        res.send({ success: 1 })
    }
    catch (err) {
        console.log(err)
        res.send(err.message)
    }

})
app.get("/stats", async (req, res) => {
    function find(a, k) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] == k) {
                return true
            }
        }
        return false
    }
    try {
        dict = { "732": "CIVIL", "733": "CSE", "734": "EEE", "735": "ECE", "736": "MECH", "737": "IT" }
        bf = { "female": 0, "male": 0 }
        dict2 = { "CIVIL": 0, "CSE": 0, "EEE": 0, "ECE": 0, "MECH": 0, "IT": 0 }
        type = { "product": 0, "service": 0 }
        const database = db.getDb().db("Placements")
        students = await database.collection("recruitments").find(
            { academic_year: { $eq: "2021-2022" } }).toArray()
        minsal = { "CIVIL": 99999, "CSE": 99999, "EEE": 99999, "ECE": 99999, "MECH": 99999, "IT": 99999 }
        maxsal = { "CIVIL": 0, "CSE": 0, "EEE": 0, "ECE": 0, "MECH": 0, "IT": 0 }
        avgsal = { "CIVIL": 0, "CSE": 0, "EEE": 0, "ECE": 0, "MECH": 0, "IT": 0 }
        branchsat = { "CIVIL": [], "CSE": [], "EEE": [], "ECE": [], "MECH": [], "IT": [] }
        for (let i = 0; i < students.length; i++) {
            if (students[i].selected_students.length != 0) {
                a = students[i].selected_students
                for (let j = 0; j < a.length; j++) {
                    dict2[dict[a[j][6] + a[j][7] + a[j][8]]] += 1
                    maxsal[dict[a[j][6] + a[j][7] + a[j][8]]] = Math.max(maxsal[dict[a[j][6] + a[j][7] + a[j][8]]], students[i].package)
                    minsal[dict[a[j][6] + a[j][7] + a[j][8]]] = Math.min(minsal[dict[a[j][6] + a[j][7] + a[j][8]]], students[i].package)
                    avgsal[dict[a[j][6] + a[j][7] + a[j][8]]] += students[i].package
                    list = await database.collection("students").find({ _id: { $eq: a[j] } }).toArray()

                    bf[list[0].gender] += 1
                }
                list1 = await database.collection("recruiters").find({ _id: { $eq: ObjectId(students[i].recruiter_id) } }).toArray()
                type[list1[0].type] += 1
            }
        }
        for (i in minsal) {
            if (minsal[i] == 99999) {
                minsal[i] = 0
            }
        }
        for (i in avgsal) {

            if (dict2[i] != 0) {
                avgsal[i] = parseInt(Math.round(avgsal[i] / dict2[i]))
            }

        }

        for (i in branchsat) {
            branchsat[i].push(minsal[i])
            branchsat[i].push(maxsal[i])
            branchsat[i].push(avgsal[i])
            // console.log("fds"+avgsal[i].toFixed(2))

            branchsat[i].push(dict2[i])
        }
        // console.log("dsbdjhvh");
        console.log(branchsat)
        data = []
        d1 = []
        for (i in bf) {
            d1.push(bf[i])
        }
        data.push(d1)
        d2 = []
        for (i in dict2) {
            d2.push(dict2[i])
        }

        data.push(d2)
        d3 = []
        for (i in type) {
            d3.push(type[i])
        }
        data.push(d3)
        label = [["girls", "boys"], ["civil", "cse", "eee", "ece", "mech", "it"], ["product", "service"]]
        branches = ["CIVIL", "CSE", "EEE", "ECE", "MECH", "IT"]
        res.send({ data, label, branchsat, branches })
    }
    catch (err) {
        console.log(err)
        res.send(err.message)
    }
})


// app.get('/', async (req, res) => {
//     const database = db.getDb().db("---name---")
//     res.send("yeah. Lets do it")
// })
app.get("/user", (req, res) => {
    res.send("yeah. Lets do it")
})

app.post('/add_recruitment_round', async (req, res) => {
    try {
        const database = db.getDb().db("Placements")
        const { recruitment_id, recruiter_id, round, eligible_students } = req.body
        await database.collection('recruitment_logs').insertOne({
            recruitment_id: ObjectId(recruitment_id), recruiter_id: ObjectId(recruiter_id),
            round, eligible_students, date: new Date(req.body.date), name: req.body.name
        })
        res.send({ success: 1 })
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
})


app.post('/add_attended_students', async (req, res) => {
    try {
        const database = db.getDb().db("Placements")
        await database.collection('recruitment_logs').updateOne({
            _id: ObjectId(req.body.recruitment_log_id),
        }, {
            $set: {
                attended_students: req.body.attended_students
            }
        })
        res.send({ success: 1 })
    }
    catch (err) {
        console.log(err)
        res.send(err.message)
    }
})
app.post('/add', async (req, res) => {
    try {

        console.log(req.params.id)
        const database = db.getDb().db("Placements")
        const x1 = await database.collection('recruitments').insertOne({
            skills: ["python", "react", "javascript"],
            academic_year: "2019-2020",
            role: "web developer",
            cgpa: 8.7,
            recruiter_id: ObjectId('637da2c2c363d1cd68b2348c'),
            hackathons: 2,
            year: 2022,
            package: 18,
            completed: true,
            cse: 3,
            it: 3,
            eligiblestudents: ["160118737142", "160118737140", "160118733139", "160118737122", "160118737123", "160118737125", "160118733127", "160118733146"],
            selected_students: ["160118737142", "160118737140", "160118733139", "160118737122", "160118733127", "160118733146"]
        })
        res.send("done")
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
})

app.post('/add_selected_students', async (req, res) => {
    try {
        const database = db.getDb().db("Placements")
        await database.collection('recruitment_logs').updateOne({
            _id: ObjectId(req.body.recruitment_log_id),
        }, {
            $set: {
                selected_students: req.body.selected_students
            }
        })
        res.send({ success: 1 })
    }
    catch (err) {
        console.log(err)
        res.send(err.message)
    }
})

app.post('/students', async (req, res) => {
    try {
        if (req.body.date) {
            const { date, deptId } = req.body;
            var date1 = (new Date(date));
            console.log(date1, deptId);
            const database = db.getDb().db("Placements")
            const students = await database.collection('recruitment_logs').find({ date: date1 }).toArray();
            // console.log(students);
            s = []
            for (let i = 0; i < students.length; ++i) {
                for (let j = 0; j < students[i].attended_students.length; ++j) {
                    if (students[i].attended_students[j].slice(6, 9) === deptId) {
                        s.push(students[i].attended_students[j])
                    }
                }
            }
            // s=[]
            console.log(s);
            res.send({ s })
        }
    }
    catch (err) {

    }
})

/*
-----------------------Guide:-----------------------------

General route syntax:
--------------------------
app.post('/route_name', async (req, res) => {
    try {
        ------------------accessing database-------------------
        const database = db.getDb().db("Placements")
      ------------------------------
      -----------------------------
      ------mongo operations--------
      ------------------------------
      -----------------------------


      -----------sending response------------------------------
      res.send("inserted")
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
})



starting server:
-----------npm start---------------

Mongo Operations syntax::
--------Insertion--------------

----------------database.collection("collection_name").insertOne(-----------{document}----------)
----------------database.collection("collection_name").insertMany(-----------[{array of documents}]----------)


--------Read-----------------------
----------------database.collection("collection_name").findOne(-----------{filter operations}----------)
----------------database.collection("collection_name").find(-----------{filter operations}----------).toArray()
----------------Read documentation for more information

--------Update----------------------
----------------database.collection("collection_name").updateOne(-----------{filter operations},{update opeartions}----------)
----------------database.collection("collection_name").updateMany(-----------{filter operations},{update opeartions}----------)

---------Delete---------------------
----------------database.collection("collection_name").deleteOne(-----------{filter operations}----------)
----------------database.collection("collection_name").deleteMany(-----------{filter operations}---------)



---------------------------------Mongo Documention link------------------------
-------------------------------------------------------------------------------

https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/insert/

------------------------------------------------------------------------------


------Routes to complete   ::::::::::::::::::::::::::::

/send_notificaton

/add_company             ==== company collection

/add_recruitement        ==== recruitement collection

/add_recruitement_round  ==== recruitement logs collection

/add_selected_students_to_recruitement  === recruitment collection

/filter_students

/add_selected_students   ==== recruitment logs collection

/add_attended_students   ==== recruitment logs collection

/add_round_cleared_students ==== recruitment logs collection



==============Every one work in seperate branches===================
-------------------------------------------------------------------
         Branch name          =         Member
-------------------------------------------------------------------
         srinath                        Srinath
         shiva                          Shiva Theja
         sai                            Sai Krishna
-------------------------------------------------------------------


Git commands :::::::::::::


----------adding changes:::::::git add .
----------committing changes:::git commit -m "{message}"

----------push::::::::::::::git push origin {branch name}
----------pull::::::::::::::git push origin {branch name}

----------making branch ::::::::: git branch {branch name}
----------changing branch:::::::: git checkout {branch name}


*/