# Jido 프로젝트 설정 검증 스크립트
Write-Host "🔍 Jido 프로젝트 설정 검증 중..." -ForegroundColor Green

# 1. 포트 사용 확인
Write-Host "`n📡 포트 사용 상태 확인:" -ForegroundColor Yellow
$ports = @(3001, 5000, 8000)
foreach ($port in $ports) {
    $result = netstat -an | Select-String ":$port "
    if ($result) {
        Write-Host "  ❌ 포트 $port 이미 사용 중" -ForegroundColor Red
    } else {
        Write-Host "  ✅ 포트 $port 사용 가능" -ForegroundColor Green
    }
}

# 2. Docker 상태 확인
Write-Host "`n🐳 Docker 상태 확인:" -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "  ✅ Docker 설치됨: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Docker가 설치되지 않음" -ForegroundColor Red
    exit 1
}

# 3. 필수 파일 존재 확인
Write-Host "`n📁 필수 파일 확인:" -ForegroundColor Yellow
$requiredFiles = @(
    "docker-compose.yml",
    "frontend/package.json",
    "frontend/vite.config.ts",
    "backend/requirements.txt"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file 존재" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file 누락" -ForegroundColor Red
    }
}

# 4. 포트 매핑 검증
Write-Host "`n🔗 포트 매핑 검증:" -ForegroundColor Yellow
$composeContent = Get-Content "docker-compose.yml" -Raw
if ($composeContent -match "3001:3001") {
    Write-Host "  ✅ 프론트엔드 포트 매핑 올바름" -ForegroundColor Green
} else {
    Write-Host "  ❌ 프론트엔드 포트 매핑 문제" -ForegroundColor Red
}

Write-Host "`n🎯 검증 완료! 이제 'docker-compose up -d' 실행 가능" -ForegroundColor Green

