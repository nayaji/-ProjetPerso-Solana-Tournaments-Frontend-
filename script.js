let publicKey = null;
let isLobbyFull = false;
let playerCount = 1; // initial player count (1, since user is already in lobby)

const connectButton = document.getElementById('connectButton');
const payButton = document.getElementById('payButton');
const leaveLobbyButton = document.getElementById('leaveLobbyButton');
const playerCountDisplay = document.getElementById('playerCount');

// Fonction pour se connecter avec Phantom
connectButton.addEventListener('click', async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      publicKey = resp.publicKey.toString();
      console.log('Public key:', publicKey);
      await registerPublicKey(publicKey);
      window.location.href = '/dashboard.html';
    } catch (err) {
      console.error('Erreur de connexion Phantom:', err);
    }
  } else {
    alert('Veuillez installer Phantom Wallet');
  }
});

// Enregistrer la public key dans la base de données
async function registerPublicKey(publicKey) {
  const response = await fetch('https://grown-dynamic-mallard.ngrok-free.app/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey })
  });
  const result = await response.json();
  console.log(result);
}


// Mettre à jour le nombre de joueurs dans le lobby
function updatePlayerCount(count) {
  playerCount = count;
  playerCountDisplay.textContent = playerCount;

  if (playerCount >= 10 && !isLobbyFull) {
    isLobbyFull = true;
    startGame();
  }
}

// Démarrer le jeu lorsque 10 joueurs sont dans le lobby
function startGame() {
  console.log('Lancement du serveur de jeu...');
  
  // Afficher un lien ou un message pour les joueurs
  const connectionLink = `steam://connect/${serverIP}:${serverPort}`;
  document.getElementById('gameLink').textContent = `Cliquez ici pour rejoindre la partie : ${connectionLink}`;
  
}

