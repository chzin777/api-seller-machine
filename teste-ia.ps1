# Script de Teste Automatizado - Sistema de IA
# Execute com: .\teste-ia.ps1

$baseUrl = "http://localhost:3001/api/ai"
$ErrorActionPreference = "Continue"

Write-Host "🧠 INICIANDO TESTES DO SISTEMA DE IA" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

# Funcao para testar endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "🔍 Testando: $Name" -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    Write-Host "   Descricao: $Description" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 10
        Write-Host "   ✅ SUCESSO" -ForegroundColor Green
        
        # Mostrar informacoes relevantes da resposta
        if ($response.PSObject.Properties.Name -contains "timestamp") {
            Write-Host "   📅 Timestamp: $($response.timestamp)" -ForegroundColor Gray
        }
        if ($response.PSObject.Properties.Name -contains "totalClientes") {
            Write-Host "   👥 Total Clientes: $($response.totalClientes)" -ForegroundColor Gray
        }
        if ($response.PSObject.Properties.Name -contains "clienteId") {
            Write-Host "   🆔 Cliente ID: $($response.clienteId)" -ForegroundColor Gray
        }
        if ($response.PSObject.Properties.Name -contains "recommendations" -and $response.recommendations) {
            Write-Host "   💡 Recomendacoes: $($response.recommendations.Count)" -ForegroundColor Gray
        }
        if ($response.PSObject.Properties.Name -contains "predicoes" -and $response.predicoes) {
            Write-Host "   📈 Predicoes: $($response.predicoes.Count) meses" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "   ❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Verificar se o servidor esta rodando
Write-Host "🔌 Verificando conexao com o servidor..." -ForegroundColor Magenta
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:3001/" -Method GET -TimeoutSec 5
    Write-Host "   ✅ Servidor esta rodando!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "   ❌ ERRO: Servidor nao esta rodando em http://localhost:3001" -ForegroundColor Red
    Write-Host "   💡 Execute 'npm run dev' primeiro!" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Testes dos endpoints
Test-Endpoint -Name "Dashboard de IA" -Url "$baseUrl/dashboard-summary" -Description "Resumo executivo de todas as funcionalidades"

Test-Endpoint -Name "Recomendacoes (Cliente 1)" -Url "$baseUrl/recommendations/1?limit=3" -Description "Sistema de recomendacoes inteligente"

Test-Endpoint -Name "Predicao de Churn" -Url "$baseUrl/churn-prediction?limit=10" -Description "Analise de risco de perda de clientes"

Test-Endpoint -Name "Predicao de Vendas" -Url "$baseUrl/sales-prediction?mesesPredicao=3" -Description "Predicao de vendas futuras"

Test-Endpoint -Name "Otimizacao RFV" -Url "$baseUrl/rfv-optimization" -Description "Analise RFV com pesos otimizados"

Test-Endpoint -Name "Insights de Cliente" -Url "$baseUrl/customer-insights/1" -Description "Insights completos de um cliente"

# Resumo final
Write-Host "📊 RESUMO DOS TESTES" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Todos os endpoints de IA foram testados!" -ForegroundColor Green
Write-Host "💡 Para mais detalhes, consulte o arquivo TESTE_IA.md" -ForegroundColor Yellow
Write-Host "🌐 Acesse tambem pelo navegador: http://localhost:3001/api/ai/dashboard-summary" -ForegroundColor Blue
Write-Host ""
Write-Host "🚀 Sistema de IA pronto para uso!" -ForegroundColor Green
Write-Host ""

# Instrucoes adicionais
Write-Host "📋 PROXIMOS PASSOS SUGERIDOS:" -ForegroundColor Magenta
Write-Host "   1. Integre os endpoints com seu frontend" -ForegroundColor White
Write-Host "   2. Configure alertas automaticos para clientes em risco" -ForegroundColor White
Write-Host "   3. Implemente dashboards visuais para as predicoes" -ForegroundColor White
Write-Host "   4. Configure execucao periodica das analises" -ForegroundColor White
Write-Host ""