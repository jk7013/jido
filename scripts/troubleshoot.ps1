# Jido 문제 해결 스크립트
Write-Host "🔧 Jido 문제 해결 도구" -ForegroundColor Green

# 1. 포트 충돌 해결
Write-Host "`n🔍 포트 충돌 확인 및 해결:" -ForegroundColor Yellow
$conflictingPorts = @()
$ports = @(3001, 5000, 8000)

foreach ($port in $ports) {
    $processes = netstat -ano | Select-String ":$port "
    if ($processes) {
        $conflictingPorts += $port
        Write-Host "  ⚠️ 포트 $port 사용 중" -ForegroundColor Red
        foreach ($process in $processes) {
            $pid = ($process -split '\s+')[-1]
            $processInfo = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($processInfo) {
                Write-Host "    - PID: $pid, 프로세스: $($processInfo.ProcessName)" -ForegroundColor Yellow
            }
        }
    }
}

if ($conflictingPorts.Count -gt 0) {
    Write-Host "`n💡 해결 방법:" -ForegroundColor Cyan
    Write-Host "  1. 다른 포트 사용: .\scripts\start-jido.ps1 -Port 3002" -ForegroundColor White
    Write-Host "  2. 충돌 프로세스 종료: taskkill /PID <PID> /F" -ForegroundColor White
}

# 2. Docker 문제 해결
Write-Host "`n🐳 Docker 문제 해결:" -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "  ✅ Docker 정상 작동" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Docker 문제 발생" -ForegroundColor Red
    Write-Host "  💡 해결 방법: Docker Desktop 재시작" -ForegroundColor Cyan
}

# 3. 컨테이너 상태 확인
Write-Host "`n📦 컨테이너 상태 확인:" -ForegroundColor Yellow
$containers = docker ps -a --filter "name=jido"
if ($containers) {
    foreach ($container in $containers) {
        $status = ($container -split '\s+')[6]
        $name = ($container -split '\s+')[-1]
        if ($status -eq "Up") {
            Write-Host "  ✅ $name 실행 중" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $name 중지됨" -ForegroundColor Red
        }
    }
}

# 4. 로그 확인
Write-Host "`n📋 최근 오류 로그:" -ForegroundColor Yellow
try {
    $frontendLogs = docker-compose logs frontend --tail=5 2>$null
    if ($frontendLogs -match "ERROR|error") {
        Write-Host "  ⚠️ 프론트엔드 오류 발견" -ForegroundColor Red
        Write-Host $frontendLogs -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ 프론트엔드 정상" -ForegroundColor Green
    }
} catch {
    Write-Host "  ❌ 로그 확인 실패" -ForegroundColor Red
}

Write-Host "`n🎯 문제 해결 완료!" -ForegroundColor Green

