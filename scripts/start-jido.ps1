# Jido 서버 자동 시작 스크립트
param(
    [string]$Port = "3001"
)

Write-Host "🚀 Jido 서버 시작 중..." -ForegroundColor Green

# 1. 기존 컨테이너 정리
Write-Host "`n🧹 기존 컨테이너 정리 중..." -ForegroundColor Yellow
docker-compose down 2>$null

# 2. 포트 매핑 자동 수정
Write-Host "`n🔧 포트 매핑 설정 중..." -ForegroundColor Yellow
$composeFile = "docker-compose.yml"
$composeContent = Get-Content $composeFile -Raw

# 포트 매핑 패턴 찾기 및 수정
$pattern = "(\s+-\s+"")\d+:\d+(""  # React 프론트엔드)"
$replacement = "`$1$Port`:$Port`$2"
$newContent = $composeContent -replace $pattern, $replacement

if ($newContent -ne $composeContent) {
    Set-Content $composeFile $newContent
    Write-Host "  ✅ 포트 매핑을 $Port`:$Port 로 수정" -ForegroundColor Green
}

# 3. Vite 설정 자동 수정
Write-Host "`n⚙️ Vite 설정 확인 중..." -ForegroundColor Yellow
$viteConfigFile = "frontend/vite.config.ts"
if (Test-Path $viteConfigFile) {
    $viteContent = Get-Content $viteConfigFile -Raw
    $portPattern = "port:\s*\d+,"
    $portReplacement = "port: $Port,"
    
    if ($viteContent -match $portPattern) {
        $newViteContent = $viteContent -replace $portPattern, $portReplacement
        Set-Content $viteConfigFile $newViteContent
        Write-Host "  ✅ Vite 포트를 $Port 로 설정" -ForegroundColor Green
    }
}

# 4. 서비스 시작
Write-Host "`n🎬 서비스 시작 중..." -ForegroundColor Yellow
docker-compose up -d

# 5. 상태 확인
Write-Host "`n📊 서비스 상태 확인:" -ForegroundColor Yellow
Start-Sleep -Seconds 5
docker-compose ps

# 6. 접속 정보 출력
Write-Host "`n🎯 접속 정보:" -ForegroundColor Green
Write-Host "  🌐 Frontend: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "  📊 MLflow: http://localhost:5000" -ForegroundColor Cyan
Write-Host "  🔧 Backend: http://localhost:8000" -ForegroundColor Cyan

Write-Host "`n✅ Jido 서버가 성공적으로 시작되었습니다!" -ForegroundColor Green

