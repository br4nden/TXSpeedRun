// Assuming you have web3.min.js loaded in your HTML

const destinationWalletAddress = '0x000000000000000000000000000000000000dEaD'; // Replace with the desired wallet address
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pixelSize = 5; // Adjust the pixel size according to the canvas size
const paymentAmount = '0'; // 0.00025 GOETH in Wei !!! SET YOUR ETH AMOUNT HERE !!!
const colors = ['#FF6262','red', 'darkred','lightgreen','green','darkgreen','lightblue','darkblue', 'blue', '#F9FF84', 'yellow', '#C5CF00',  '#FCAA5E', 'orange',  'darkorange', '#D88FFF ', 'purple', '#8000C4' ,  ]; // Add or remove colors as needed

// BASE Mainnet Chain ID
const BASE_MAINNET_CHAIN_ID = 8453;

// Initialize the canvas with a white grid
function initializeCanvas() {
  for (let x = 0; x < canvas.width; x += pixelSize) {
    for (let y = 0; y < canvas.height; y += pixelSize) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }
}

// Function to handle user clicks and draw a colored pixel
async function drawPixel(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const pixelX = Math.floor(x / pixelSize) * pixelSize;
  const pixelY = Math.floor(y / pixelSize) * pixelSize;

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const web3 = new Web3(ethereum);

    const chainId = await web3.eth.getChainId();

    // Check if connected wallet is on the BASE Mainnet Network
    if (chainId !== BASE_MAINNET_CHAIN_ID) {
      alert('Please switch to the BASE Mainnet Network.');
      return;
    }

    const transactionParams = {
      from: accounts[0],
      to: destinationWalletAddress,
      value: paymentAmount,
    };
    console.log('Transaction Params:', transactionParams);

    // Prompt the user to confirm the transaction through MetaMask
    const txHash = await web3.eth.sendTransaction(transactionParams);
    console.log('Transaction Hash:', txHash);

    // Draw the pixel with the account color if the transaction is successful
    const color = colors[Math.floor(Math.random() * colors.length)]; // Choose a random color from the list
    ctx.fillStyle = color;
    ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);

    // MENU FOR COLOR CHOOSE
    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.top = y + 'px';
    menu.style.left = x + 'px';
    menu.style.backgroundColor = '#FFFFFF';
    menu.style.border = '1px solid #ADD8E6';
    menu.style.padding = '10px';
    menu.style.zIndex = '9999';
    menu.style.borderRadius = '10px';
    menu.style.borderWidth = '2px';

    const colorOptions = colors.map(color => {
      const option = document.createElement('button');
      option.style.backgroundColor = color;
      option.style.color = '#FFFFFF';
      option.style.border = '5px ';
      option.style.padding = '5px';
      option.style.margin = '5px';
      option.style.cursor = 'pointer';
      option.addEventListener('click', () => {
        ctx.fillStyle = color;
        ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
        menu.remove();
      });
      return option;
    });

    colorOptions.forEach(option => menu.appendChild(option));
    document.body.appendChild(menu);

  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while processing your transaction.');
  }
}

initializeCanvas();
canvas.addEventListener('click', drawPixel);
