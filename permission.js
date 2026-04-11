const micBtn = document.getElementById('micBtn');
const successMsg = document.getElementById('successMsg');
const errorMsg = document.getElementById('errorMsg');

micBtn.addEventListener('click', async () => {
  micBtn.disabled = true;
  errorMsg.style.display = 'none';

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());

    successMsg.style.display = 'block';
    setTimeout(() => window.close(), 1800);
  } catch (error) {
    console.error('Microfone negado:', error);
    errorMsg.textContent = 'Não foi possível acessar o microfone. Verifique a permissão nas configurações do navegador.';
    errorMsg.style.display = 'block';
    micBtn.disabled = false;
    micBtn.textContent = 'Tentar novamente';
  }
});
