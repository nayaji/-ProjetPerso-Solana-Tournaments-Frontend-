// Vérifier si Phantom Wallet est disponible
if (window.solana && window.solana.isPhantom) {
  console.log("Phantom Wallet détecté");

  // Sélectionner les éléments nécessaires
  const payButton = document.getElementById('payButton');
  const accessCodeInput = document.getElementById('accessCode');
  const verifyCodeButton = document.getElementById('verifyCodeButton');
  const qrcodeContainer = document.getElementById('qrcodeContainer');
  const qrcodeElement = document.getElementById('qrcode');


  async function connectWallet() {
    try {
      const response = await window.solana.connect();
      console.log('Wallet connecté:', response.publicKey.toString());
      payButton.textContent = 'Pay';
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  }

  async function makePayment() {
    try {
      const response = await fetch('https://grown-dynamic-mallard.ngrok-free.app/generate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.qrCodeUrl) {
        qrcodeElement.src = data.qrCodeUrl;
        qrcodeContainer.style.display = 'block';
      } else {
        console.error('URL du QR Code manquante');
      }

    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error);
    }
  }

  async function checkTransactionStatus(transactionSignature) {
    try {
      const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
      const transactionStatus = await connection.getSignatureStatuses([transactionSignature]);

      return transactionStatus && transactionStatus.value[0].confirmations > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification de la transaction:', error);
      return false;
    }
  }

  async function handlePayment() {
    const { publicKey } = window.solana;

    if (!publicKey) {
      alert('Connectez d\'abord votre portefeuille');
      return;
    }

    const transaction = new solanaWeb3.Transaction();
    const transactionSignature = await window.solana.request({
      method: 'solana_signTransaction',
      params: [transaction],
    });

    const isConfirmed = await checkTransactionStatus(transactionSignature);

    if (isConfirmed) {
      await registerToLobby(publicKey.toString());
      window.location.href = '/lobby.html';
    } else {
      alert('La transaction n\'a pas été confirmée. Essayez à nouveau.');
    }
  }

  async function registerToLobby(publicKey) {
    try {
      const response = await fetch('https://grown-dynamic-mallard.ngrok-free.app/register-lobby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicKey }),
      });

      if (response.ok) {
        console.log('Clé publique enregistrée dans le lobby avec succès.');
      } else {
        console.error('Erreur lors de l\'enregistrement dans le lobby');
      }
    } catch (error) {
      console.error('Erreur de requête vers l\'API:', error);
    }
  }



  if (window.solana.publicKey) {
    payButton.textContent = 'Pay'; 
  } else {
    payButton.textContent = 'Connect'; 
  }

  payButton.addEventListener('click', async () => {
    if (!window.solana.publicKey) {
      await connectWallet(); 
    } else {
      await makePayment(); 
    }
  });

  verifyCodeButton.addEventListener('click');

} else {
  console.log('Phantom Wallet non détecté. Veuillez installer Phantom.');
}


