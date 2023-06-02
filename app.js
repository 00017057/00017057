
// third party libraries
const express = require('express')
const app = express()

// node libraries
const fs = require('fs')
const PORT = 8000

app.set('view engine', 'pug')
app.use('/static', express.static('public')) // assets
app.use(express.urlencoded({ extended: false }))

// http://localhost:8000
app.get('/', (req, res) => {
    fs.readFile('./data/shpitems.json', (err, data) => {
        if (err) throw err

        const shpitems = JSON.parse(data)

        res.render('home', { shpitems: shpitems })
    })
})

app.post('/add', (req, res) => {
    const formData = req.body

    if (formData.shoppingitem.trim() == '') {
        fs.readFile('./data/shpitems.json', (err, data) => {
            if (err) throw err

            const shpitems = JSON.parse(data)

            res.render('home', { error: true, shpitems: shpitems })
        })
    } else {
        fs.readFile('./data/shpitems.json', (err, data) => {
            if (err) throw err

            const shpitems = JSON.parse(data)

            const shpitem = {
                id: id(),
                description: formData.shoppingitem,
                done: false
            }

            shpitems.push(shpitem)

            fs.writeFile('./data/shpitems.json', JSON.stringify(shpitems), (err) => {
                if (err) throw err

                fs.readFile('./data/shpitems.json', (err, data) => {
                    if (err) throw err

                    const shpitems = JSON.parse(data)

                    res.render('home', { success: true, shpitems: shpitems })
                })
            })
        })
    }
})

app.get('/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/shpitems.json', (err, data) => {
        if (err) throw err

        const shpitems = JSON.parse(data)

        const filteredShpitems = shpitems.filter(shpitem => shpitem.id != id)

        fs.writeFile('./data/shpitems.json', JSON.stringify(filteredShpitems), (err) => {
            if (err) throw err
            
            res.render('home', { shpitems: filteredShpitems, deleted: true })
        })
    })
})

app.listen(PORT, (err) => {
    if (err) throw err

    console.log(`This app is running on port ${ PORT }`)
})


function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
  }