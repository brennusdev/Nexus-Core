@echo off
REM ============================================================
REM NEXUS CORE - Iniciar API (Backend)
REM Uso: de dois cliques neste arquivo e deixe a janela ABERTA
REM enquanto estiver usando o frontend. Fechar a janela = parar API.
REM ============================================================
title Nexus Core - API (porta 8000)
cd /d "%~dp0Backend"
echo Iniciando Nexus Core API em http://localhost:8000 ...
echo Nao feche esta janela enquanto estiver usando o sistema.
echo.
python -m uvicorn App.main:app --reload --port 8000
pause
