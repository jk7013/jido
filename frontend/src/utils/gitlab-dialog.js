// GitLab 커밋 다이얼로그 JavaScript

// 다이얼로그 열기
function openGitLabDialog() {
  const dialog = document.getElementById('gitlab-commit-dialog');
  if (dialog) {
    dialog.style.display = 'flex';
    // 애니메이션을 위해 약간의 지연 후 show 클래스 추가
    setTimeout(() => {
      dialog.classList.add('show');
    }, 10);
    
    // 커밋 메시지 입력 필드에 포커스
    const commitMessage = document.getElementById('commit-message');
    if (commitMessage) {
      commitMessage.focus();
    }
  }
}

// 다이얼로그 닫기
function closeGitLabDialog() {
  const dialog = document.getElementById('gitlab-commit-dialog');
  if (dialog) {
    dialog.classList.remove('show');
    // 애니메이션 완료 후 숨김
    setTimeout(() => {
      dialog.style.display = 'none';
    }, 200);
  }
}

// GitLab 커밋 처리
async function handleGitLabCommit() {
  const commitMessage = document.getElementById('commit-message');
  const commitDescription = document.getElementById('commit-description');
  
  if (!commitMessage || !commitMessage.value.trim()) {
    showToast('커밋 메시지를 입력해주세요.', 'error');
    return;
  }
  
  const commitBtn = document.querySelector('.btn-primary');
  if (commitBtn) {
    commitBtn.disabled = true;
    commitBtn.textContent = '커밋 중...';
  }
  
  try {
    // 실제 GitLab API 호출 (현재는 시뮬레이션)
    const response = await simulateGitLabCommit({
      message: commitMessage.value.trim(),
      description: commitDescription ? commitDescription.value.trim() : '',
      branch: 'main'
    });
    
    if (response.success) {
      showToast('✅ Commit pushed to GitLab', 'success');
      closeGitLabDialog();
      
      // 폼 초기화
      if (commitMessage) commitMessage.value = '';
      if (commitDescription) commitDescription.value = '';
    } else {
      showToast('❌ 커밋 실패: ' + response.error, 'error');
    }
  } catch (error) {
    showToast('❌ 커밋 실패: ' + error.message, 'error');
  } finally {
    if (commitBtn) {
      commitBtn.disabled = false;
      commitBtn.textContent = '커밋';
    }
  }
}

// GitLab 커밋 시뮬레이션 (실제 API 연동 시 교체)
async function simulateGitLabCommit(data) {
  // 2초 지연으로 실제 API 호출 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 90% 성공률로 시뮬레이션
  if (Math.random() > 0.1) {
    return {
      success: true,
      commitId: 'abc123def456',
      message: 'Commit successful'
    };
  } else {
    return {
      success: false,
      error: 'Network error or permission denied'
    };
  }
}

// 토스트 알림 표시
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✅' : '❌';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // 애니메이션을 위해 약간의 지연 후 show 클래스 추가
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // 3초 후 자동 제거
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// 키보드 단축키 처리
function handleKeyboardShortcuts(event) {
  // Ctrl + Enter로 커밋 실행
  if (event.ctrlKey && event.key === 'Enter') {
    const dialog = document.getElementById('gitlab-commit-dialog');
    if (dialog && dialog.style.display !== 'none') {
      event.preventDefault();
      handleGitLabCommit();
    }
  }
  
  // ESC로 다이얼로그 닫기
  if (event.key === 'Escape') {
    const dialog = document.getElementById('gitlab-commit-dialog');
    if (dialog && dialog.style.display !== 'none') {
      closeGitLabDialog();
    }
  }
}

// 오버레이 클릭으로 다이얼로그 닫기
function handleOverlayClick(event) {
  if (event.target.classList.contains('dialog-overlay')) {
    closeGitLabDialog();
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 키보드 이벤트 리스너
  document.addEventListener('keydown', handleKeyboardShortcuts);
  
  // 오버레이 클릭 이벤트 리스너
  document.addEventListener('click', handleOverlayClick);
  
  // 다이얼로그가 이미 DOM에 있다면 이벤트 리스너 추가
  const dialog = document.getElementById('gitlab-commit-dialog');
  if (dialog) {
    // 다이얼로그 내부 클릭 시 이벤트 전파 중지
    dialog.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  }
});
