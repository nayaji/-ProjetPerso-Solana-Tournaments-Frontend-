document.addEventListener('DOMContentLoaded', () => {
let playerCount = 0;  // Initialisation de playerCount
let isLobbyFull = false;  // Initialisation pour savoir si le lobby est plein


  const playerCountDisplay = document.getElementById('playerCountDisplay');
  const joinLobbyButton = document.getElementById('joinLobbyButton');
  const gameLinkContainer = document.getElementById('gameLinkContainer');
  const gameLink = document.getElementById('gameLink');
  
  const serverIP = '127.0.0.1';  // Remplacez par votre IP publique si nécessaire
  const serverPort = 27015;      // Port du serveur de jeu
  const apiBaseUrl = 'https://grown-dynamic-mallard.ngrok-free.app';  // Ton URL d'API, remplace avec la bonne
  
  // Mise à jour du nombre de joueurs dans le lobby
  async function updatePlayerCount() {
    try {
      const response = await fetch(`${apiBaseUrl}/count-players`);

      
      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();
      playerCount = data.playerCount || 0;
      playerCountDisplay.textContent = `${playerCount} / 10`;

      if (playerCount >= 10 && !isLobbyFull) {
        isLobbyFull = true;
        startGame();
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de joueurs:', error);
      playerCountDisplay.textContent = 'Erreur de connexion';
    }
  }

  // Fonction pour lancer le jeu
  function startGame() {
    console.log('Lancement du serveur de jeu...');

    const connectionLink = `steam://connect/${serverIP}:${serverPort}`;
    gameLink.textContent = `Cliquez ici pour rejoindre la partie : ${connectionLink}`;
    gameLink.href = connectionLink;
    gameLinkContainer.style.display = 'block';

    joinLobbyButton.disabled = true;
  }

  

  // Ajouter un joueur au lobby
  joinLobbyButton.addEventListener('click', async () => {
    try {
      joinLobbyButton.disabled = true;  // Désactiver le bouton temporairement pour éviter le spam
      const player = { id: Date.now() }; // Identifiant unique basé sur la date
      
      const response = await fetch(`${apiBaseUrl}/join-lobby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'ajout: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        updatePlayerCount();
      } else {
        alert(data.message || 'Impossible de rejoindre le lobby.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du joueur au lobby:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    } finally {
      joinLobbyButton.disabled = false;
    }
  });

  // Vérifier le nombre de joueurs toutes les 3 secondes
  updatePlayerCount();
  setInterval(updatePlayerCount, 3000);
});
