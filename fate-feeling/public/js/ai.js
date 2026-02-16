const chatPanel = document.getElementById('chatPanel');
const sendBtn = document.getElementById('coachBtn');
const situationInput = document.getElementById('situation');
const goalInput = document.getElementById('goal');
const goalChips = [...document.querySelectorAll('.goal-chip[data-goal]')];

function addBubble(text, role = 'ai', extraClass = '') {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${role} ${extraClass}`.trim();
  if (extraClass.includes('typing-indicator')) {
    bubble.innerHTML = '<span></span><span></span><span></span>';
  } else if (role === 'ai' && window.matchMedia('(max-width: 640px)').matches) {
    const plain = String(text).replace(/<br\s*\/?>/gi, '\n').trim();
    if (plain.length > 220) {
      const preview = plain.slice(0, 220);
      bubble.innerHTML = `<span class="bubble-preview"></span><button type="button" class="bubble-more">더보기</button>`;
      const previewEl = bubble.querySelector('.bubble-preview');
      const moreBtn = bubble.querySelector('.bubble-more');
      let expanded = false;
      const render = () => { previewEl.textContent = expanded ? plain : `${preview}…`; moreBtn.textContent = expanded ? '접기' : '더보기'; };
      moreBtn.addEventListener('click', () => { expanded = !expanded; render(); });
      render();
    } else {
      bubble.textContent = plain;
    }
  } else {
    bubble.innerHTML = text;
  }
  chatPanel.appendChild(bubble);
  chatPanel.scrollTop = chatPanel.scrollHeight;
  return bubble;
}

function buildAdvice(situation, goal) {
  const cleanSituation = situation.slice(0, 40);
  const goalLine = goal ? `목표로 적어주신 "${goal.slice(0, 26)}"를 기준으로 ` : '';
  return [
    `지금 "${cleanSituation}" 같은 상황이면 마음이 크게 흔들리는 게 자연스러워요. 먼저 스스로를 탓하지 않아도 괜찮아요.`,
    `${goalLine}오늘은 "보내기 전 10분 멈춤"을 실험해보세요. 감정이 올라올 때 바로 결론 내리기보다, 짧게 메모하고 숨을 고르는 방식이 도움이 됩니다.`,
    '📌 실행 가이드\n• 지금 감정 3단어 적기\n• 전달하고 싶은 핵심 문장 1개만 남기기\n• 내일 같은 시간에 다시 읽고 수정하기'
  ].join('<br/><br/>');
}

function randomDelay(ch) {
  if (/[,.!?\n]/.test(ch)) return 140 + Math.random() * 120;
  if (/\s/.test(ch)) return 28 + Math.random() * 20;
  return 24 + Math.random() * 55;
}

async function typeBubbleHtml(html) {
  const bubble = addBubble('', 'ai', 'bubble-pop');
  const plain = String(html).replace(/<br\s*\/?>/gi, '\n');
  let out = '';
  for (let i = 0; i < plain.length; i += 1) {
    out += plain[i];
    bubble.innerHTML = out.replace(/\n/g, '<br/>');
    await new Promise((resolve) => setTimeout(resolve, randomDelay(plain[i])));
  }
  bubble.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function sendMessage() {
  const situation = situationInput.value.trim();
  const goal = goalInput.value.trim();
  if (!situation) return alert('고민 내용을 먼저 적어줘.');

  addBubble(situation, 'user');
  situationInput.value = '';

  const thinking = addBubble('', 'ai', 'typing-indicator bubble-pop');
  setTimeout(async () => {
    thinking.remove();
    await typeBubbleHtml(buildAdvice(situation, goal));
  }, 850);
}

goalChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    goalChips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    goalInput.value = chip.dataset.goal || '';
  });
});

goalInput.addEventListener('input', () => {
  goalChips.forEach((c) => {
    const active = (c.dataset.goal || '') === goalInput.value.trim();
    c.classList.toggle('active', active);
  });
});

sendBtn.addEventListener('click', sendMessage);
situationInput.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') sendMessage(); });