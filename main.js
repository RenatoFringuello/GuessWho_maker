// players
const players = [
    'Rhysand', 
    'Feyre', 
    'Suriel', 
    'Nesta', 
    'Tamlin', 
    'Elain', 
    'Lucien', 
    'Gwyn', 
    'Cassian', 
    'Azriel', 
    'Ruhn', 
    'Hunt', 
    'Aelin', 
    'Rowan', 
    'Lysandra', 
    'Lidia', 
    'Danika', 
    'Bryce', 
    'Manon', 
    'Dorian', 
    'Chaol'
]

// DOM elements
const paper     = document.getElementById('paper')
const test_cb   = document.getElementById('test-checkbox')
const print_btn = document.getElementById('header-collapse')

//listen to the btn
print_btn.addEventListener('click', (e)=>{
    // remove the header
    const header = document.getElementById('header')
    header.remove()

    // print
    window.print()
})

// listen to the test checkbox
test_cb.addEventListener('change', (e)=>{
    paper.innerHTML = ``
    if (e.srcElement.checked){
        paper.innerHTML = `
            <div class="team">
                <div class="gw-card test_card small">
                    <div class="wrapper test_card_gradient">
                        <div class="logo">?</div>
                    </div>
                </div>
            
                <div class="gw-card test_card big">
                    <div class="wrapper test_card_gradient">
                        <div class="logo">?</div>
                    </div>
                </div>
            </div>`
    }
    else{
        // 3 teams
        for (let i = 0; i < 3; i++) {
            // get the team type
            team_type      = (i == 0) ? 'player1'    : (i == 1) ? 'player2' : 'guess'
            team_back_type = (i  > 1) ? 'guess_back' : team_type
            card_size      = (i  > 1) ? 'big'        : 'small'

            
            
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
                            <img src="img/${player}.png">
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
})