const result = window.getFFResult?.();
const personal = document.getElementById('philosophyPersonal');
const popup = document.getElementById('philosophyPopup');
const popupClose = document.getElementById('popupClose');
const openPopupBtn = document.getElementById('openPopupBtn');
const keywordRow = document.querySelector('.keyword-row');
const philosophySummary = document.getElementById('philosophySummary');

if (result) {
  personal.textContent = `${result.type} 성향(${result.modeLabel || '기본'} 기준)으로 분석된 결과를 바탕으로, 사주 원국·자미두수 명반을 함께 보는 철학관 전문가를 추천해요.`;

  const dynamicKeywords = [];
  if (result.anxiety >= 15 || result.longing >= 16) {
    dynamicKeywords.push('심리 안정 부적', '감정 정화 의식');
  }
  if ((result.mode === 'ziwei' || result.mode === 'saju') && result.lensIntensity >= 15) {
    dynamicKeywords.push('재회 시기 풀이', '운세 창구 개운');
  }
  if (!dynamicKeywords.length) {
    dynamicKeywords.push('관계 균형 리딩', '재접촉 준비');
  }

  keywordRow.innerHTML += dynamicKeywords.map((k) => `<span class="keyword">${k}</span>`).join('');
  philosophySummary.textContent = dynamicKeywords.slice(0,2).join(' · ') + ' 중심으로 고수 추천을 정리했어.';
} else {
  personal.textContent = '아직 테스트 결과가 없어 기본 추천을 보여드려요. 테스트 후 방문하면 더 정확한 추천을 볼 수 있어요.';
}

function closePopup() {
  popup.hidden = true;
}

function openPopup() {
  popup.hidden = false;
}

// 자동 노출 제거: 사용자 액션으로만 표시
openPopupBtn?.addEventListener('click', openPopup);
popupClose?.addEventListener('click', closePopup);

popup?.addEventListener('click', (e) => {
  if (e.target === popup) closePopup();
});
