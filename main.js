// players
let players    = [
    "Rhysand", 
    "Feyre", 
    "Suriel", 
    "Nesta", 
    "Tamlin", 
    "Elain", 
    "Lucien", 
    "Gwyn", 
    "Cassian", 
    "Azriel", 
    "Ruhn", 
    "Hunt", 
    "Aelin", 
    "Rowan", 
    "Lysandra", 
    "Lidia", 
    "Danika", 
    "Bryce", 
    "Manon", 
    "Dorian", 
    "Chaol"
]

const input_sizes_ids = [
    'card-pl-width',
    'card-pl-height',
    'card-gs-width',
    'card-gs-height'
]

// let is_loading = true

// DOM elements
const paper           = document.getElementById('paper')
const print_btn       = document.getElementById('print')
const test_cb         = document.getElementById('test-checkbox')
// const team_card_w_in  = document.getElementById('card-pl-width')
// const team_card_h_in  = document.getElementById('card-pl-height')
// const guess_card_w_in = document.getElementById('card-gs-width')
// const guess_card_h_in = document.getElementById('card-gs-height')
const rootStyles      = document.documentElement
const to_print        = document.getElementById('to-print')
test_cb.checked       = false

// fn
// function showLoader(){
// const loader = `
// <div class="loader-container">
//     <div class="loader"></div>
// </div>`

// paper.innerHTML = loader
// }

function loadPage(){
    setSelectToPrint(test_cb.checked, to_print)
    showSet(test_cb.checked)
}

// function getPlayers(){
//     is_loading = true
//     fetch(`http://127.0.0.1:5500/players.json`)
//         .then(response => response.json())
//         .then(data     => {
//             players = data;
//             is_loading = false
//             loadPage()
//         })
//         .catch(error => {
//             is_loading = false
//             console.error('Error fetching image names:', error);
//         });
// }

function setSelectToPrint(is_test, to_print){
    let appendHTML = `<option value="" selected disabled>-- select the cards to print --</option>`
    if(is_test){
        // append team, guess, all
        appendHTML += `
        <option value="0">ALL</option>>
        <option value="1">TEAM 1</option>
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
    const printWindow = window.open('', '_blank');

    // Add the HTML content you want to print
    let teams = document.querySelectorAll('.team');

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
    `);
  
    // to load the css
    window.setTimeout(function(){
        // Close the document
        printWindow.document.close();
      
        // Print the content
        printWindow.print();

        window.clearTimeout(this)
    }, 2000)
}

function showSet(is_test){
    paper.innerHTML = ``
    if (is_test){
        paper.innerHTML = `
        <div class="team_name subtitle">TEST (DON'T forget to print on grayscale!)</div>
        <div class="team">
            <div class="front-back-wrapper">
                <div class="gw-card guess small card-bound">
                    <div class="wrapper guess_gradient">
                        <div class="gw-card_header">prova</div>
                        <img src="res/img/user.png">
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
                        <img src="res/img/user.png">
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
    else{
        // 3 teams
        for (let i = 0; i < 3; i++) {
            // get the team type
            team_type      = (i == 0) ? 'team_1'     : (i == 1) ? 'team_2' : 'guess'
            team_back_type = (i  > 1) ? 'guess_back' : team_type
            card_size      = (i  > 1) ? 'big'        : 'small'

            // inject team name
            paper.innerHTML += `<div class="team_name subtitle">${team_type.replace('_', ' ')}</div>`
            
            // init the team
            const team  = document.createElement('div')
            team.className = 'team'

            //set the card for each player
            players.forEach((player) => {
                const card = `
                <div class="front-back-wrapper">
                    <div class="gw-card ${team_type} ${card_size} card-bound">
                        <div class="wrapper ${team_type}_gradient">
                            <div class="gw-card_header">${player}</div>
                            <img src="res/img/${player}.png">
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

            // add the team to the paper
            paper.appendChild(team)
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

//listen to the btn
print_btn.addEventListener('click', (e)=>{
    const to_print   = document.getElementById('to-print')
    printSet(to_print.value)
})

// listen to the test checkbox
test_cb.addEventListener('change', (e)=>{
    loadPage()
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
        loadPage()
    })
})

// get the size of the cards and set it to the value
initSize(input_sizes_ids)

// load page
loadPage()