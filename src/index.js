import MetaMaskOnboarding from '@metamask/onboarding';
import { ethers } from 'ethers';

const player = document.querySelector(".success-anim");
const onboarding = new MetaMaskOnboarding();
const btn = document.querySelector('.onboard');
const statusText = document.querySelector('h1');
const statusDesc = document.querySelector('.desc');
const loader = document.querySelector('.loader');
const confetti = document.querySelector('.confetti');
const balanceElement = document.getElementById('balance');
const balanceContainer = document.getElementById('balanceContainer');

const isMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
};

const connected = async (accounts) => {
    try {
        // Initialize provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        const formattedBalance = ethers.utils.formatEther(balance);

        statusText.innerHTML = 'Connected!';
        statusDesc.innerHTML = `Address: ${accounts[0]}`;
        balanceElement.innerHTML = `Balance: ${formattedBalance} ETH`;
        btn.style.display = 'none';
        loader.style.display = 'none';
        confetti.style.display = 'block';
        player.play();
        balanceContainer.style.display = 'block';
    } catch (error) {
        console.error('Error fetching balance:', error);
        statusText.innerHTML = 'Error';
        statusDesc.innerHTML = 'Unable to fetch balance. Please check your connection.';
        balanceElement.innerHTML = '';
    }
};

const connectWallet = async () => {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        return accounts;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        statusText.innerHTML = 'Error';
        statusDesc.innerHTML = 'Unable to connect to wallet. Please try again.';
        return [];
    }
};

const onClickInstallMetaMask = () => {
    onboarding.startOnboarding();
    loader.style.display = 'block';
};

btn.addEventListener('click', async () => {
    btn.style.backgroundColor = '#cccccc';
    loader.style.display = 'block';

    try {
        const accounts = await connectWallet();
        if (accounts.length > 0) {
            connected(accounts);
        } else {
            statusText.innerHTML = 'Connect your wallet';
            statusDesc.innerHTML = 'To begin, please connect your MetaMask wallet.';
            btn.innerText = 'Connect MetaMask';
            loader.style.display = 'none';
        }
    } catch (error) {
        console.error('Error during wallet connection:', error);
        loader.style.display = 'none';
    }
});

const MetaMaskClientCheck = () => {
    if (!isMetaMaskInstalled()) {
        statusText.innerText = 'You need to Install a Wallet';
        statusDesc.innerText = 'We recommend the MetaMask wallet.';
        btn.innerText = 'Install MetaMask';
        btn.onclick = onClickInstallMetaMask;
    } else {
        connectWallet().then((accounts) => {
            if (accounts.length > 0) {
                connected(accounts);
            } else {
                statusText.innerHTML = 'Connect your wallet';
                statusDesc.innerHTML = 'To begin, please connect your MetaMask wallet.';
                btn.innerText = 'Connect MetaMask';
                loader.style.display = 'none';
            }
        }).catch(error => {
            console.error('Error during wallet connection:', error);
            loader.style.display = 'none';
        });
    }
};

MetaMaskClientCheck();
