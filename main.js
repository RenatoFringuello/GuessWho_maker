// players
let players = []
const input_sizes_ids = [
    'card-pl-width',
    'card-pl-height',
    'card-gs-width',
    'card-gs-height'
]

// DOM elements
const preview_sec     = document.getElementById('preview-sec')
const paper           = document.getElementById('paper')
const print_btn       = document.getElementById('print')
const test_cb         = document.getElementById('test-checkbox')
const rootStyles      = document.documentElement
const to_print        = document.getElementById('to-print')
test_cb.checked       = false

function loadTeams(){
    setSelectToPrint(test_cb.checked, to_print)
    showTeams(test_cb.checked)
}

function setSelectToPrint(is_test, to_print){
    let appendHTML = `<option value="" selected disabled>-- select the cards to print --</option>`
    if(is_test){
        // append team, guess, all
        appendHTML += `
        <option value="0">ALL</option>>
        <option value="1">TEAM</option>
        <option value="2">GUESS</option>`
    }
    else{
        appendHTML += `
        <option value="0">ALL</option>>
        <option value="1">TEAM 1</option>
        <option value="2">TEAM 2</option>
        <option value="3">GUESS</option>`
    }
    to_print.innerHTML = appendHTML 
}

function printSet(index){
    // se non viene selezionato nulla allora stampa tutto (3 = ALL)
    index = (index === '') ? 0 : parseInt(index, 10)

    // Create a new window or iframe
    const printWindow = window.open('', '_blank')

    // Add the HTML content you want to print
    let teams = document.querySelectorAll('.team')

    // metto in un array il singolo team in modo da implementare un solo tipo di inject tramite foreach (per il caso in cui sia ALL)
    teams = (index !== 0) ? [teams[index -1]] : teams

    let contentToPrint = ''

    teams.forEach((team)=>{
        contentToPrint += team.outerHTML 
    })

    printWindow.document.write(`
      <html>
        <head>
            <link rel="stylesheet" href="style.css">
            <title>Print</title>
        </head>
        <body>
            <main>
                <section>
                    ${contentToPrint}
                </section>
            </main>
        </body>
      </html>
    `)
  
    // to load the css
    window.setTimeout(function(){
        // Close the document
        printWindow.document.close()
      
        // Print the content
        printWindow.print()

        window.clearTimeout(this)
    }, 2000)
}

function showTeams(is_test){
    paper.innerHTML = ``
    if (is_test){
        paper.innerHTML = `
        <div class="team_name subtitle">TEST (DON'T forget to print on grayscale!)</div>
        <div class="team">
            <div class="front-back-wrapper">
                <div class="gw-card guess small card-bound">
                    <div class="wrapper guess_gradient">
                        <div class="gw-card_header">prova</div>
                        <img src="res/assets/img/user.png">
                    </div>
                </div>
                <div class="gw-card guess small">
                    <div class="wrapper guess_gradient">
                        <div class="logo">?</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="team">
            <div class="front-back-wrapper">
                <div class="gw-card guess big card-bound">
                    <div class="wrapper guess_gradient">
                        <div class="gw-card_header">prova</div>
                        <img src="res/assets/img/user.png">
                    </div>
                </div>
                <div class="gw-card guess big">
                    <div class="wrapper guess_gradient">
                        <div class="logo">?</div>
                    </div>
                </div>
            </div>
        </div>`
    }
    else {
        // 3 teams
        for (let i = 0; i < 3; i++) {
            // get the team type
            team_type      = (i == 0) ? 'team_1'     : (i == 1) ? 'team_2' : 'guess'
            team_back_type = (i  > 1) ? 'guess_back' : team_type
            card_size      = (i  > 1) ? 'big'        : 'small'
            
            // init the team wrapper
            const team_wrapper  = document.createElement('div')
            team_wrapper.className = `team_wrapper ${team_type}`

            // inject team name
            team_wrapper.innerHTML += `<div class="team_name subtitle">${team_type.replace('_', ' ')}</div>`

            // init the team
            const team  = document.createElement('div')
            team.className = 'team'

            //set the card for each player
            players.forEach((player) => {
                // player is a literal obj (name, src)

                const card = `
                <div class="front-back-wrapper">
                    <div class="gw-card ${team_type} ${card_size} card-bound">
                        <div class="wrapper ${team_type}_gradient">
                            <div class="gw-card_header">${player.name}</div>
                            <img src="${player.src}">
                        </div>
                    </div>
                    <div class="gw-card ${team_back_type} ${card_size}">
                        <div class="wrapper ${team_back_type}_gradient">
                            <div class="logo">?</div>
                        </div>
                    </div>
                </div>`

                // add the card to the team
                team.innerHTML += card
            })

            team_wrapper.appendChild(team)
            team_wrapper.appendChild(team)

            // add the team to the paper
            paper.appendChild(team_wrapper)
        }
    }
}

function initSize(input_sizes_ids){
    input_sizes_ids.forEach((id)=>{ 
        // const id_cp = id // to reset its value each iteration
        const element = document.getElementById(id)
        id = id.replaceAll('-', '_')
        // get the value from :root
        element.value = getComputedStyle(rootStyles).getPropertyValue(`--${id}`).replace('cm', '')
    })
}

// drag n drop functions
function handleDragEnter(event) {
    event.preventDefault()
    document.getElementById('dropArea').classList.add('dragover')
}

function handleDragOver(event) {
    event.preventDefault()
}

function handleDragLeave(event) {
    document.getElementById('dropArea').classList.remove('dragover')
}

function handleDrop(event) {
    event.preventDefault()
    document.getElementById('dropArea').classList.remove('dragover')

    const files = event.dataTransfer.files

    if (files.length > 0) {
        handleFiles(files)
    }
}

// choose images on click
function chooseFiles(){
    document.getElementById('fileInput').click();
}
function handlePickImages() {
    const files = document.getElementById('fileInput').files
    
    if (files.length > 0) {
        handleFiles(files)
    }
}

// load images
function handleFiles(files) {
    const previewElement = document.getElementById('preview')

    for (const file of files) {
        // only if is a image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()

            // load the image
            reader.onload = function (e) {
                // remove the img extension and underscores
                player_to_add = file.name.replace(new RegExp(/\.\S+/), '').replaceAll('_', ' ')

                // check for duplicates
                if(!players.some(obj => obj.name === player_to_add)){ 
                    // ok
                    players.push({
                        "name": player_to_add,
                        "src" : e.target.result
                    })
                }
                else{
                    // error this player already exists
                    alert(`the player ${player_to_add} already exists, change its name`)
                    return
                }

                // create the img wrap with remove button
                const img_wrap     = document.createElement('div')
                img_wrap.className = "img-wrap"
                img_wrap.id        = player_to_add
                
                // create the remove button
                const rm_button     = document.createElement('button')
                rm_button.className = 'btn'
                rm_button.innerHTML = '&cross;'
                
                // get the image
                const img = new Image()
                img.src   = e.target.result

                // add event listener
                rm_button.addEventListener('click', function remove_card(){
                    // remove the listen ti click
                    rm_button.removeEventListener('click', remove_card)
                    
                    // remove the player
                    img_wrap.remove()
                    players = players.filter((player)=>{return player.name != img_wrap.id})
                    
                    // if there are no players hide the preview section
                    if(players.length == 0){
                        preview_sec.style.display = 'none'
                    }
                    else{
                        // refresh preview
                        loadTeams()
                    }
                })
                
                //append button and img
                img_wrap.appendChild(rm_button) 
                img_wrap.appendChild(img)
                
                // append all in preview
                previewElement.appendChild(img_wrap)

                // refresh
                loadTeams()

                // show the preview-sec section
                preview_sec.style.display = 'block'

            }

            // lettura di dati da URL (data: ..base64 code..)
            reader.readAsDataURL(file)

        }
    }
}

//listen to the btn
print_btn.addEventListener('click', (e)=>{
    const to_print   = document.getElementById('to-print')
    printSet(to_print.value)
})

// listen to the test checkbox
test_cb.addEventListener('change', (e)=>{
    loadTeams()
})

// listen to the all inputs size
input_sizes_ids.forEach((input_id)=>{
    const input = document.getElementById(input_id)

    input.addEventListener('change', (e)=>{
        let in_id = e.srcElement.id
        // change root variables
        in_id = in_id.replaceAll('-', '_')

        rootStyles.style.setProperty(`--${in_id}`, `${input.value}cm`)

        // reload page
        loadTeams()
    })
})

// get the size of the cards and set it to the value
initSize(input_sizes_ids)

// set the select dropdown options
setSelectToPrint(test_cb.checked, to_print)

// remove the preview section 
preview_sec.style.display = 'none'